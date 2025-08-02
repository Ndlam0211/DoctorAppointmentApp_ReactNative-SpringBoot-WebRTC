import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import Button from '@/components/button/Button';
import { router } from 'expo-router';

export default function Index() {
  const {navigate} = useNavigation();
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('@/assets/images/splash.png')}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 0.8, justifyContent: 'center', marginTop: 120, alignItems: 'center' }}>
          <Image source={require('@/assets/images/doctor.png')} style={{width:'100%'}} resizeMode='contain'/>
        </View>
        <View style={{ flex: 0.45, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <View style={{justifyContent: 'center', alignItems:'center'}}>
                <Text style={{fontSize:24,fontWeight:"bold",paddingVertical:10}}>Welcome to MediKart</Text>
                <Text style={{fontSize:18, paddingVertical:10,alignSelf:'center', paddingHorizontal:10, textAlign:'center', color:'gray'}}>{'Book appointments with your favourite doctors'}</Text>
            </View>
        </View>
        <View style={{bottom:0,position:'absolute',width:'100%',paddingVertical:15, paddingHorizontal:10}}>
            <Button label={'Get started'} onPress={()=>router.push("/login")} style={{backgroundColor:'#0B3DA9'}}/>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({})
