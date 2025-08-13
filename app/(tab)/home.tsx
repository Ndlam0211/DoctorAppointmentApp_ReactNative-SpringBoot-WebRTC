import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useMemo } from 'react'
import Header from '@/components/header/Header';
import Categories from '@/components/categories/Categories';
import SectionHeader from '@/components/sectionHeading/SectionHeader';
import DoctorsList from '@/components/doctors/DoctorsList';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { COLORS } from '@/constants/Colors';
import { useQuery } from '@tanstack/react-query';
import { fetchDoctorById } from '@/api/doctors';
import { specialities } from '@/constants/AppContent';
import { fetchSpecialities, fetchSpecialityById } from '@/api/specialities';
import dayjs from 'dayjs';

const Home = () => {
  const { token } = useSelector((state:any) => state.user);
  const appointments = useSelector((state:any) => state.appointment.appointments);

  const { data } = useQuery({
    queryKey: ["doctorById", appointments[0]?.doctor],
    queryFn: () => fetchDoctorById(appointments[0]?.doctor, token),
    enabled: !!appointments[0]?.doctor,
  });

  const { data: specialityObj } = useQuery({
    queryKey: ["speciality", data?.speciality],
    queryFn: () => fetchSpecialityById(data?.speciality as string),
    enabled: !!data?.speciality, // chỉ gọi khi có ID
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <Header />
      <Categories />

      {appointments.length > 0 && (
        <View>
          <SectionHeader title={"Appointments"} onPress={()=>router.push('/appointment')}/>
          <TouchableOpacity style={styles.cardContainer}>
            <View style={{ flexDirection: "row" }}>
              <Image source={{ uri: data?.image }} style={styles.doctorImage} />
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
    </ScrollView>
  );
}

export default Home;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.PRIMARY,
    height:140,
    marginHorizontal:10,
    borderRadius:10,
    padding:20
  },
  doctorImage: {
    height:72,
    width: 72,
    borderRadius:10,
  },
  cardText: {
    color: 'white',
    fontSize:16,
    paddingVertical:5
  }
});