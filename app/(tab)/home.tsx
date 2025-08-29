import { fetchDoctorById } from "@/api/doctors";
import { fetchSpecialityById } from "@/api/specialities";
import Button from "@/components/button/Button";
import Categories from "@/components/categories/Categories";
import DoctorsList from "@/components/doctors/DoctorsList";
import Header from "@/components/header/Header";
import SectionHeader from "@/components/sectionHeading/SectionHeader";
import { COLORS } from "@/constants/Colors";
import { useAppContext } from "@/context/AppProvider";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

const Home = () => {
  const appointments = useSelector(
    (state: any) => state.appointment.appointments
  );

  const {
    values: { isDoctor },
  } = useAppContext() as unknown as { values: { isDoctor: boolean } };
  console.log("isDoctor:", isDoctor);

  const { data } = useQuery({
    queryKey: ["doctorById", appointments[0]?.doctor],
    queryFn: () => fetchDoctorById(appointments[0]?.doctor),
    enabled: !!appointments[0]?.doctor,
  });

  console.log("doctor data:", JSON.stringify(data, null, 2));

  const { data: specialityObj } = useQuery({
    queryKey: ["speciality", data?.speciality],
    queryFn: () => fetchSpecialityById(data?.speciality as string),
    enabled: !!data?.speciality, // chỉ gọi khi có ID
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <Header />

      {!isDoctor && (
        <View>
          <Categories />

          {appointments.length > 0 && (
            <View>
              <SectionHeader
                title={"Appointments"}
                onPress={() => router.push("/appointment")}
              />
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/appointment-detail",
                    params: { doctorId: data?.id },
                  })
                }
                style={styles.cardContainer}
              >
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={{ uri: data?.image }}
                    style={styles.doctorImage}
                  />
                  <View style={{ paddingHorizontal: 10 }}>
                    <Text style={styles.cardText}>{data?.name}</Text>
                    <Text style={styles.cardText}>{specialityObj?.title}</Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                  }}
                >
                  <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
                    <Image source={require("@/assets/images/calendar.png")} />
                    <Text style={{ color: "white", paddingHorizontal: 10 }}>
                      {dayjs(appointments[0]?.slot?.date).format("DD MMM")}
                    </Text>
                  </View>

                  <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
                    <Image source={require("@/assets/images/clock.png")} />
                    <Text style={{ color: "white", paddingHorizontal: 10 }}>
                      {appointments[0]?.slot?.time?.split(":")[0] > 12
                        ? appointments[0]?.slot?.time + " PM"
                        : appointments[0]?.slot?.time + " AM"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}

          <SectionHeader
            title={"Top Doctors"}
            onPress={() => router.push("/doctors")}
          />
          <DoctorsList horizontal />
        </View>
      )}
      {isDoctor && (
        <View style={{ padding: 15, width: "100%" }}>
          <Button
            onPress={() => {
              // Generate a doctor ID based on timestamp or use a default
              router.push({
                pathname: "/audio-call",
                params: {
                  doctorId: "doctor123",
                  userId: "test123",
                  isDoctorBoolean: "true",
                },
              });
            }}
            label={"Connect with patients"}
            style={{ backgroundColor: "#0B3DA9" }}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.PRIMARY,
    height: 140,
    marginHorizontal: 10,
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
});
