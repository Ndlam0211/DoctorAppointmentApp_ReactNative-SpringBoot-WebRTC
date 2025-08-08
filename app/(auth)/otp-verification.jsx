import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { OtpInput } from 'react-native-otp-entry';
import { router, useLocalSearchParams } from 'expo-router';
import Button from "@/components/button/Button";

const OtpVerification = () => {
    const { mobileNumber } = useLocalSearchParams();
    const [counter, setCounter] = useState(30);

    const countDown = useCallback(() => {
        if(counter>0){
            setCounter(counter=>counter-1);
        }
    }, [counter]);

    useEffect(()=>{
        const timer = setInterval(countDown,1000);
        return () => clearInterval(timer);
    });

    const onTextChange = useCallback((text) => {

    },[]);

    const onOTPFilled = useCallback(() => {
        router.push("/bottom-tab");
    },[]);

  return (
    <View style={{ flex: 1, backgroundColor:'white', marginTop:20 }}>
      <View style={{marginTop:20, justifyContent:'center', alignItems:'center'}}>
        <Text style={{fontSize:18}}>{"We've sent a verification code to"}</Text>
        <Text style={{fontSize:18, fontWeight:'bold'}}>+84-{mobileNumber}</Text>
      </View>
      <View style={{marginTop:20, marginHorizontal:20}}>
        <OtpInput numberOfDigits={6} onTextChange={onTextChange} onFilled={onOTPFilled}/>
      </View>

      {counter > 0 && <Text style={{alignSelf:'center', marginTop:20}}>Resend OTP in {counter}s</Text>}
      {counter === 0 && <Button><Text style={{fontSize:18, color:'#0B3DA9'}}>{'Resend OTP'}</Text></Button>}
    </View>
  );
}

export default OtpVerification

const styles = StyleSheet.create({})