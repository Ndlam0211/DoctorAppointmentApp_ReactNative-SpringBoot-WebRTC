import { Image, ImageBackground, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import Button from "@/components/button/Button";

const Login = () => {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#0B3DA9' }}>
        <View style={{ flex: 0.7, justifyContent: 'center', marginTop: 20, alignItems: 'center' }}>
          <Image source={require('@/assets/images/facility.png')} style={{width:'100%'}} resizeMode='contain'/>
        </View>
        <View style={{ flex: 0.4, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <View style={{justifyContent: 'center', alignItems:'center'}}>
                <Text style={{fontSize:24,fontWeight:"bold",paddingVertical:10}}>Log in or Sign up</Text>
            </View>
            <View style={{flexDirection:'row', height:50, borderColor:'gray', borderWidth:2, alignItems:'center', margin:10, borderRadius:10}}>
              <Text style={{fontSize:18, paddingHorizontal:10}}>{'+84'}</Text>
              <TextInput style={{padding:10, fontSize:18, width:'100%'}} keyboardType='numeric' placeholder='Phone Number' maxLength={10} />
            </View>
            <View style={{width:'100%',paddingVertical:15, paddingHorizontal:10}}>
              <Button label={'Login with Mobile'} style={{backgroundColor:'#0B3DA9'}}/>
            </View>
        </View>
        <View style={{bottom:0,position:'absolute',width:'100%',paddingVertical:15, paddingHorizontal:10}}>
            <Button style={{backgroundColor:'white', flexDirection: 'row', gap:4, borderWidth:2, borderColor:'#939393'}}>
              <Image source={require('@/assets/images/google_icon.png')} />
              <Text style={{color:'black', fontSize:18}}>Continue with Google</Text>
            </Button>
        </View>
      </View>
    </View>
  )
}

export default Login;

const styles = StyleSheet.create({})