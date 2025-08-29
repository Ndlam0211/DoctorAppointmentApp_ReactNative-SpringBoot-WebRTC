import CallScreen from "@/components/calling/CallScreen";
import { useAppContext } from "@/context/AppProvider";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  mediaDevices,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from "react-native-webrtc";
import { io, Socket } from "socket.io-client";

const SERVER_URL = "http://10.18.0.210:8082";

const AudioCall = () => {
  const { doctorId, userId, isDoctorBoolean } = useLocalSearchParams();
  const isDoctor = isDoctorBoolean === "true";
  // const { isDoctor } = useAppContext() as unknown as { isDoctor: boolean };
  console.log("isDoctor:", isDoctor);

  // --- Refs / States ---
  const socketRef = useRef<Socket | null>(null);
  const pcRef = useRef<any>(null);
  const peerIdRef = useRef<string | null>(null); // socketId của đối tác (caller/callee)
  const localStreamRef = useRef<any>(null);
  const pendingRemoteCandidates = useRef<any[]>([]);

  const [users, setUsers] = useState<any[]>([]);
  const [incomingCall, setIncomingCall] = useState<any | null>(null);
  const [callActive, setCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState<string>("");
  const [calling, setCalling] = useState<boolean>(false);

  // --- Helpers ---
  const cleanupCall = () => {
    try {
      pcRef.current?.close();
    } catch {}
    pcRef.current = null;

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t: any) => t.stop());
      localStreamRef.current = null;
    }

    setCallActive(false);
    setIncomingCall(null);
    setCalling(false);
    setCallStatus("");
    pendingRemoteCandidates.current = [];
    peerIdRef.current = null;
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      return (
        granted["android.permission.RECORD_AUDIO"] ===
        PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  };

  const getLocalStream = async () => {
    if (localStreamRef.current) return localStreamRef.current;
    const ok = await requestPermissions();
    if (!ok) {
      setCallStatus("Permission denied");
      return null;
    }
    const s = await mediaDevices.getUserMedia({ audio: true, video: false });
    localStreamRef.current = s;
    return s;
  };

  const createPeerConnection = () => {
    const pc: any = new RTCPeerConnection({
      iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
    });

    // gửi ICE sang peer
    (pc as any).onicecandidate = (e: any) => {
      if (!e?.candidate) return;
      const to = peerIdRef.current;
      if (!to) {
        // chưa biết đối tác → bỏ qua (hoặc buffer lại nếu muốn)
        return;
      }
      socketRef.current?.emit("ice_candidate", {
        to,
        candidate: e.candidate, // giữ nguyên object
      });
    };

    // trạng thái kết nối
    (pc as any).onconnectionstatechange = () => {
      switch (pc.connectionState) {
        case "connected":
          setCallStatus("Connected");
          break;
        case "disconnected":
        case "failed":
          setCallStatus("Connection failed or disconnected");
          cleanupCall();
          break;
        case "closed":
          setCallStatus("Connection closed");
          cleanupCall();
          break;
      }
    };

    // nhận audio remote
    (pc as any).ontrack = (event: any) => {
      // Với audio-only, RN sẽ phát tự động khi track được add
      // event.streams[0] is remote stream
    };

    return pc;
  };

  // --- Socket & signaling (ONE useEffect) ---
  useEffect(() => {
    const s = io(SERVER_URL, { transports: ["websocket"] });
    socketRef.current = s;

    s.on("connect", () => {
      // register username (doctorId / userId theo vai trò)
      const username = (isDoctor ? doctorId : userId) as string;
      s.emit("register", username);
    });

    // Danh sách user (socketId + username)
    s.on("user_list", (list: any[]) => {
      const myId = s.id;
      const others = list.filter((u) => u.socketId !== myId);
      setUsers(others);
    });

    // Nhận offer (cuộc gọi tới)
    s.on("incoming_call", async (callData: any) => {
      // callData: { signal: {type, sdp}, from, callerName }
      peerIdRef.current = callData.from;
      setIncomingCall(callData);
      setCalling(true);
      setCallStatus("Incoming call...");
    });

    // Caller nhận answer
    s.on("call_accepted", async (payload: any) => {
      // payload could be { signal } or the signal object itself
      console.log("call_accepted payload:", payload);
      const pc = pcRef.current;
      if (!pc) return;

      // Normalize signal
      const signal = payload && payload.signal ? payload.signal : payload;

      if (!signal || typeof signal !== "object" || !signal.sdp) {
        console.error("call_accepted: invalid/empty signal received:", signal);
        return;
      }

      try {
        // Ensure using proper RTCSessionDescription
        const desc = new RTCSessionDescription(signal as any);
        await pc.setRemoteDescription(desc);

        // flush các remote ICE nhận sớm
        for (const c of pendingRemoteCandidates.current) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(c));
          } catch (iceErr) {
            console.error("Error adding buffered ICE candidate:", iceErr);
          }
        }
        pendingRemoteCandidates.current = [];
        setCallActive(true);
        setCallStatus("Connected");
      } catch (err) {
        console.error("setRemoteDescription(answer) error:", err);
      }
    });

    // Nhận ICE Candidate từ peer
    s.on("ice_candidate", async ({ candidate }: any) => {
      const pc = pcRef.current;
      if (!pc) return;
      try {
        if (!pc.remoteDescription) {
          // Chưa có remote SDP → buffer lại
          pendingRemoteCandidates.current.push(candidate);
        } else {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error("addIceCandidate error:", err);
      }
    });

    // Bị từ chối
    s.on("call_rejected", (data: any) => {
      setCallStatus("Call rejected: " + (data?.reason || ""));
      cleanupCall();
    });

    // Đầu kia kết thúc cuộc gọi
    s.on("call_ended", () => {
      setCallStatus("Call ended");
      cleanupCall();
    });

    return () => {
      s.removeAllListeners();
      s.disconnect();
      cleanupCall();
    };
  }, [doctorId, userId, isDoctor]);

  // --- Actions ---
  const makeCall = async (targetSocketId: string) => {
    try {
      peerIdRef.current = targetSocketId; // ❗ quan trọng để endCall/ICE dùng được
      setCalling(true);
      setCallStatus("Initializing call...");

      const stream = await getLocalStream();
      if (!stream) return;

      const pc = createPeerConnection();
      pcRef.current = pc;

      // add local tracks
      stream.getTracks().forEach((t: any) => pc.addTrack(t, stream));

      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false,
      });
      await pc.setLocalDescription(offer);

      socketRef.current?.emit("call_user", {
        userToCall: targetSocketId,
        from: socketRef.current?.id,
        signal: offer, // { type, sdp }
      });

      setCallStatus("Calling...");
    } catch (err) {
      console.error("Error making call:", err);
      setCallStatus("Failed to make call");
      cleanupCall();
    }
  };

  const answerCall = async () => {
    try {
      if (!incomingCall) return;
      setCallStatus("Connecting...");

      peerIdRef.current = incomingCall.from; // ❗ quan trọng
      const stream = await getLocalStream();
      if (!stream) return;

      const pc = createPeerConnection();
      pcRef.current = pc;

      stream.getTracks().forEach((t: any) => pc.addTrack(t, stream));

      // set remote offer
      // Normalize incoming offer (may be wrapped or raw)
      const incomingSignal =
        incomingCall && incomingCall.signal
          ? incomingCall.signal
          : incomingCall;
      if (
        !incomingSignal ||
        typeof incomingSignal !== "object" ||
        !incomingSignal.sdp
      ) {
        console.error("answerCall: invalid incoming offer:", incomingCall);
        setCallStatus("Invalid offer received");
        cleanupCall();
        return;
      }

      await pc.setRemoteDescription(new RTCSessionDescription(incomingSignal));

      // flush remote ICE đã buffer
      for (const c of pendingRemoteCandidates.current) {
        await pc.addIceCandidate(new RTCIceCandidate(c));
      }
      pendingRemoteCandidates.current = [];

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Ensure we emit a plain object (type + sdp) so server/peer get valid SDP
      const localDesc = pc.localDescription;
      const outSignal = localDesc
        ? { type: localDesc.type, sdp: localDesc.sdp }
        : { type: answer.type, sdp: (answer as any).sdp };

      console.log("Emitting answer_call with signal:", outSignal);

      socketRef.current?.emit("answer_call", {
        to: incomingCall.from,
        signal: outSignal, // ensure {type, sdp}
      });

      setCallActive(true);
      setIncomingCall(null);
      setCallStatus("Connected");
    } catch (err) {
      console.error("Error answering call:", err);
      setCallStatus("Answer failed");
      cleanupCall();
    }
  };

  const endCall = () => {
    const to = peerIdRef.current;
    if (to) {
      socketRef.current?.emit("end_call", { to });
    }
    cleanupCall();
  };

  const rejectCall = () => {
    const to = incomingCall?.from;
    console.log("Rejecting call, notifying caller:", to);
    socketRef.current?.emit("reject_call", {
      to,
      reason: "User rejected the call",
    });

    // Ensure local cleanup for callee
    setIncomingCall(null);
    setCalling(false);
    setCallStatus("Call rejected");
    cleanupCall();
  };

  // renderItem removed in favor of inline FlatList item renderer

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Audio Calls</Text>
        <Text style={styles.headerSubtitle}>
          Connect with doctors or patients
        </Text>
      </View>

      {!calling && (
        <View style={styles.content}>
          {users.length > 0 ? (
            <View>
              <Text style={styles.sectionTitle}>
                Available users ({users.length})
              </Text>
              <FlatList
                data={users}
                keyExtractor={(item) => item.socketId}
                renderItem={({ item }) => (
                  <View style={styles.userCard}>
                    <View style={styles.userInfo}>
                      <Image
                        source={require("@/assets/images/avatar.png")}
                        style={styles.userAvatar}
                      />
                      <View>
                        <Text style={styles.userName}>
                          {item.username || item.socketId}
                        </Text>
                        <Text style={styles.userMeta}>{item.socketId}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.callButton}
                      onPress={() => makeCall(item.socketId)}
                    >
                      <Text style={styles.callButtonText}>Call</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No users connected</Text>
            </View>
          )}
        </View>
      )}

      {calling && (
        <CallScreen
          answerCall={answerCall}
          rejectCall={rejectCall}
          callActive={callActive}
          callStatus={callStatus}
          incomingCall={incomingCall}
          userId={userId}
          doctorId={doctorId}
          isDoctor={isDoctor}
          endCall={endCall}
        />
      )}
    </View>
  );
};

export default AudioCall;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  infoText: { fontSize: 16, marginBottom: 5, color: "#333" },
  usersText: { fontSize: 16, color: "#666", textAlign: "center" },
  header: {
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  headerSubtitle: { fontSize: 12, color: "#666", marginTop: 4 },
  content: { flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fafafa",
    marginBottom: 8,
  },
  userInfo: { flexDirection: "row", alignItems: "center" },
  userAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  userName: { fontSize: 14, fontWeight: "600" },
  userMeta: { fontSize: 12, color: "#888" },
  callButton: {
    backgroundColor: "#0a84ff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  callButtonText: { color: "#fff", fontWeight: "600" },
  emptyBox: { alignItems: "center", justifyContent: "center", padding: 40 },
  emptyText: { color: "#999" },
});
