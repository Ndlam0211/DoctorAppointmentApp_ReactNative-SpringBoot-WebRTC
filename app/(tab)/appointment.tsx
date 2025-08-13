import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { fetchDoctorById } from "@/api/doctors";
import { fetchSpecialityById } from "@/api/specialities";
import dayjs from "dayjs";
import { COLORS } from "@/constants/Colors";

const AppointmentCard = ({ appointment }: { appointment: any }) => {
  const { data: doctor, isLoading: loadingDoctor } = useQuery({
    queryKey: ["doctorById", appointment.doctor],
    queryFn: () => fetchDoctorById(appointment.doctor),
    enabled: !!appointment.doctor,
  });

  const { data: speciality, isLoading: loadingSpeciality } = useQuery({
    queryKey: ["speciality", doctor?.speciality],
    queryFn: () => fetchSpecialityById(doctor?.speciality as string),
    enabled: !!doctor?.speciality,
  });

  if (loadingDoctor || loadingSpeciality) {
    return (
      <View style={styles.cardContainer}>
        <ActivityIndicator color="white" />
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.cardContainer}>
      <View style={{ flexDirection: "row" }}>
        <Image source={{ uri: doctor?.image }} style={styles.doctorImage} />
        <View style={{ paddingHorizontal: 10 }}>
          <Text style={styles.cardText}>{doctor?.name}</Text>
          <Text style={styles.cardText}>{speciality?.title}</Text>
        </View>
      </View>

      <View style={styles.dateTimeRow}>
        <View style={styles.iconTextRow}>
          <Image source={require("@/assets/images/calendar.png")} />
          <Text style={styles.dateTimeText}>
            {dayjs(appointment.slot?.date).format("DD MMM")}
          </Text>
        </View>

        <View style={styles.iconTextRow}>
          <Image source={require("@/assets/images/clock.png")} />
          <Text style={styles.dateTimeText}>
            {formatTime(appointment.slot?.time)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const formatTime = (time: string) => {
  if (!time) return "";
  const [hour, minute] = time.split(":").map(Number);
  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour > 12 ? hour - 12 : hour;
  return `${formattedHour}:${minute.toString().padStart(2, "0")} ${suffix}`;
};

const Appointment = () => {
  const appointments = useSelector(
    (state: any) => state.appointment.appointments
  );

  if (appointments.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Bạn chưa có lịch hẹn nào.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={appointments}
      keyExtractor={(item, index) => item.id || index.toString()}
      renderItem={({ item }) => <AppointmentCard appointment={item} />}
      contentContainerStyle={{ paddingVertical: 10 }}
    />
  );
};

export default Appointment;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.PRIMARY,
    marginHorizontal: 10,
    marginBottom: 12,
    borderRadius: 10,
    padding: 20,
  },
  doctorImage: {
    height: 72,
    width: 72,
    borderRadius: 10,
  },
  cardText: {
    color: "white",
    fontSize: 16,
    paddingVertical: 5,
  },
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  iconTextRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateTimeText: {
    color: "white",
    paddingHorizontal: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
  },
});
