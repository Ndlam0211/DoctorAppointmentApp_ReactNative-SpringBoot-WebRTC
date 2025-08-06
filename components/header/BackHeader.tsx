import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Button from '../button/Button';
import { router } from 'expo-router';

const BackHeader = () => {
  return (
    <TouchableOpacity style={styles.header} onPress={router.back}>
      <Button onPress={router.back} style={{ paddingRight: 10 }}>
        <Image source={require("@/assets/images/back.png")} />
      </Button>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Back</Text>
    </TouchableOpacity>
  );
}

export default BackHeader

const styles = StyleSheet.create({
      header: {
        flexDirection: "row",
        backgroundColor: "white",
        alignItems:'center',
        height: 60,
        width:'20%',
        paddingTop: 15,
      },
})