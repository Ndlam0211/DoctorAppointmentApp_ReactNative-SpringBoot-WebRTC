import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchDoctors } from '@/api/doctors';
import DoctorCard from './DoctorCard';
import { COLORS } from '@/constants/Colors';
import Button from '../button/Button';
import { router } from 'expo-router';
import { useUser } from '@/context/UserContext';

const DoctorsList = ({horizontal}:any) => {
  const {token} = useUser();

    const {data,isLoading,error} = useQuery({
        queryKey:['doctors'],
        queryFn:() => fetchDoctors(String(token)),   
    }) ;

  return (
    <View style={[styles.container, !horizontal ? {height:'100%'} : {}]}>
        {!horizontal && <View style={styles.header}>
            <Button onPress={router.back}>
                <Image  source={require('@/assets/images/back.png')} />
            </Button>
        </View>}
        <FlatList 
            data={data}
            horizontal={horizontal}
            style={[styles.container]}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{gap:16}}
            showsHorizontalScrollIndicator={false}
            numColumns={horizontal ? 1 : 2}
            columnWrapperStyle={!horizontal && {justifyContent:'space-between',flex:1, gap:16, margin:10}}
            renderItem={({item}) => <DoctorCard horizontal={horizontal} key={item.id} {...item} />} />
    </View>
  )
}

export default DoctorsList

const styles = StyleSheet.create({
  container: {
    height:"100%",
    padding: 6,
    marginRight: 3,
    backgroundColor: COLORS.SECONDARY,
  },
  header: { 
    flexDirection: "row", 
    backgroundColor: "white", 
    height: 60 ,
    paddingTop:15,
    paddingLeft: 10
  }
});
