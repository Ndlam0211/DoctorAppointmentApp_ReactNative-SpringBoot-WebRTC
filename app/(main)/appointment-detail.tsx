import { fetchDoctorById } from "@/api/doctors";
import Button from "@/components/button/Button";
import DoctorCard from "@/components/doctors/DoctorCard";
import BackHeader from "@/components/header/BackHeader";
import { COLORS } from "@/constants/Colors";
import { doctorMetrics } from "@/constants/DoctorMetrics";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

const AppointmentDetail = () => {
  const { doctorId } = useLocalSearchParams();

  const { data } = useQuery({
    queryKey: ["doctorById"],
    queryFn: () => fetchDoctorById(doctorId as string),
    enabled: !!doctorId,
  });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <BackHeader />
        <View>
          <DoctorCard
            {...data}
            style={{ width: "100%" }}
            imageStyle={{ height: 350 }}
            displayAll
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            paddingVertical: 10,
            marginTop: 20,
          }}
        >
          {doctorMetrics.map((item, i) => (
            <View key={i} style={{ alignItems: "center" }}>
              <View style={styles.imageContainer}>
                <Image source={item.icon} />
              </View>
              <Text>{item.label}</Text>
              <Text>{item.tilte}</Text>
            </View>
          ))}
        </View>
        <Text style={{ fontSize: 18, paddingVertical: 10, fontWeight: "500" }}>
          {"About me"}
        </Text>
        <Text style={{ paddingVertical: 5 }}>
          {
            "I'm the top most immunologists specialist in Crist Hospital in LonDon, UK, Read more..."
          }
        </Text>
      </ScrollView>
      <View
        style={{ position: "absolute", bottom: 10, width: "100%", padding: 10 }}
      >
        <Button
          onPress={() =>
            router.push({
              pathname: "/audio-call",
              params: {
                doctorId: "doctor123",
                userId: "test123",
                isDoctorBoolean: "false",
              },
            })
          }
          style={{ backgroundColor: COLORS.PRIMARY }}
          label="Voice Call"
        />
      </View>
    </View>
  );
};

export default AppointmentDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  imageContainer: {
    borderRadius: "50%",
    backgroundColor: "#EDEDFC",
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
});
