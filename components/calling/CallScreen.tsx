import { fetchDoctorById } from "@/api/doctors";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import Button from "../button/Button";

const CallScreen = ({
  userId,
  doctorId,
  isDoctor,
  endCall,
  callActive,
  callStatus,
  incomingCall,
  rejectCall,
  answerCall,
}: any) => {
  const [callDuration, setCallDuration] = React.useState(0);
  const timeRef = useRef<number | null>(null);
  const [doctorData, setDoctorData] = React.useState<any>(null);

  useEffect(() => {
    if (callActive) {
      setCallDuration(0);
      timeRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timeRef.current as number);
    }

    return () => {
      clearInterval(timeRef.current as number);
    };
  }, [callActive]);

  const { data: doctor, isLoading } = useQuery({
    // include id in key so cached values per doctor are separate
    queryKey: ["doctorById", doctorId],
    queryFn: () => fetchDoctorById(String(doctorId)),
    enabled: !!doctorId,
    retry: 1,
  });
  
  console.log(
    "Doctor data:",
    doctor ? JSON.stringify(doctor, null, 2) : "(no doctor yet)"
  );

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.statusText}>{callStatus}</Text>
        {callDuration > 0 && (
          <Text style={styles.timerText}>{formatTime(callDuration)}</Text>
        )}
      </View>

      <View style={styles.centerContent}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <>
            <Image
              source={
                isDoctor && doctor?.image
                  ? { uri: doctor.image }
                  : require("@/assets/images/avatar.png")
              }
              style={styles.avatar}
            />

            <Text style={styles.nameText}>
              {isDoctor ? doctor?.name ?? "Unknown" : "Patient"}
            </Text>
          </>
        )}
        <Text style={styles.roleText}>{isDoctor ? "Doctor" : "Patient"}</Text>
      </View>

      <View style={styles.controls}>
        {(!incomingCall || callActive) && (
          <View style={styles.endWrapper}>
            <Button
              label="End Call"
              onPress={endCall}
              style={styles.endButton}
            />
          </View>
        )}

        {incomingCall && !callActive && (
          <View style={styles.answerRow}>
            <Button
              label="Accept"
              onPress={answerCall}
              style={[styles.actionButton, { backgroundColor: "#4CAF50" }]}
            />
            <Button
              label="Reject"
              onPress={rejectCall}
              style={[styles.actionButton, { backgroundColor: "#F44336" }]}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default CallScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B3DA9" },
  topBar: { paddingTop: 48, paddingBottom: 12, alignItems: "center" },
  statusText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  timerText: { color: "#fff", fontSize: 14, marginTop: 6 },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.2)",
  },
  nameText: { color: "#fff", fontSize: 22, fontWeight: "700", marginTop: 12 },
  roleText: { color: "rgba(255,255,255,0.85)", fontSize: 14, marginTop: 4 },
  controls: { paddingBottom: 40, alignItems: "center" },
  endWrapper: { alignItems: "center" },
  endButton: { backgroundColor: "#F44336", paddingHorizontal: 24 },
  answerRow: { flexDirection: "row", gap: 12 },
  actionButton: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
});
