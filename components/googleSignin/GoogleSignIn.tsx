import { View, Text, Image } from 'react-native'
import React from 'react'
import Button from '../button/Button'
import {GoogleSignin, isSuccessResponse} from '@react-native-google-signin/google-signin'
import { router } from 'expo-router'
import { useUser } from '@/context/UserContext'
import { authenticate } from '@/api/authService'

const GoogleSignIn = () => {
    const { setUser, setToken } = useUser();

    GoogleSignin.configure({
      webClientId:
        "117197118056-fguqeigrk289d1eeu3cdk2qr1mjet1av.apps.googleusercontent.com",
      profileImageSize: 150,
    });

    const handleLoginSuccess = async (userData:any, token:string) => {
      setUser({
        name: userData.name,
        email: userData.email,
        photo: userData.photo,
      });

      setToken(token);
      router.replace("/home");
    };

    const SignInWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices()
            const response = await GoogleSignin.signIn()
            
            if (isSuccessResponse(response)) {
              authenticate(response.data).then(async (res) => {
                console.log("token: ", res);
                const { user } = response.data;
                handleLoginSuccess(user, res?.token);
              }).catch((error) => {
                console.log("Error authenticating with backend: ", error);
              });
            }
        } catch (error) {
            console.log("Error signing in with Google: ", error);
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