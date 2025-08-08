import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '@/components/header/Header';
import Categories from '@/components/categories/Categories';
import SectionHeader from '@/components/sectionHeading/SectionHeader';
import DoctorsList from '@/components/doctors/DoctorsList';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';

const Home = () => {
  const appointments = useSelector((state) => state.appointment.appointments);
  console.log(appointments);
  
  return (
    <ScrollView style={{flex:1, backgroundColor:'white'}}>
        <Header/>
        <Categories />
        <SectionHeader title={'Top Doctors'} onPress={()=>router.push('/doctors')}/>
        <DoctorsList horizontal/>
    </ScrollView>
  )
}

export default Home;

const styles = StyleSheet.create({})