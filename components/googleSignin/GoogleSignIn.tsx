import { View, Text, Image } from 'react-native'
import React from 'react'
import Button from '../button/Button'
import {GoogleSignin, isSuccessResponse} from '@react-native-google-signin/google-signin'
import { router } from 'expo-router'
import { useUser } from '@/context/UserContext'

const GoogleSignIn = () => {
    const { setUser } = useUser();

    GoogleSignin.configure({
        webClientId: process.env.WEB_CLIENT_ID,
        profileImageSize: 150
    });

    const handleLoginSuccess = (userData:any) => {
      setUser({
        name: userData.name,
        email: userData.email,
        photo: userData.photo,
      });

      router.replace("/home");
    };

    const SignInWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices()
            const response = await GoogleSignin.signIn()

            if (isSuccessResponse(response)) {
                const {user} = response.data;
                handleLoginSuccess(user);
                // call our backend api 
            } 
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <Button onPress={SignInWithGoogle} style={{backgroundColor:'white', flexDirection: 'row', gap:4, borderWidth:1, borderColor:'#939393'}}>
        <Image source={require('@/assets/images/google_icon.png')} />
        <Text style={{color:'black', fontSize:18}}>Continue with Google</Text>
    </Button>
  )
}

export default GoogleSignIn