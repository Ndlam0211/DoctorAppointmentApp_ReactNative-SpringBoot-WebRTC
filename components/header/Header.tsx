import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS } from '@/constants/Colors'
import { ImageBackground } from 'expo-image'
import Button from '@/components/button/Button'
import { router } from 'expo-router'

const Header = () => {
  return (
    <View style={styles.container}>
        <ImageBackground style={{flex:1}} source={require('@/assets/images/splash.png')}>
            <View style={styles.profile}>
                <View style={{flexDirection:'row'}}>  
                    <Image style={styles.image} source={require('@/assets/images/avatar.png')} />
                    <View style={styles.bio}>
                        <Text style={styles.text}>Hello, Welcome 🏕️</Text>
                        <Text style={[styles.text,{paddingTop:5}]}>Username</Text>
                    </View>
                </View>
                <View style={styles.bellIcon}>
                    <Button>
                        <Image source={require("@/assets/images/icon.png")} />
                    </Button>
                </View>
            </View>

            <TouchableOpacity onPress={() => router.push("/search")} style={styles.searchBar}>
                <Image style={styles.searchImage} source={require("@/assets/images/search.png")} />
                <Text style={styles.searchText}>{'Search Doctor...'}</Text>
            </TouchableOpacity>
        </ImageBackground>
    </View>
  );
}

export default Header

const styles = StyleSheet.create({
  container: {
    height: 200,
  },
  profile: {
    padding: 20,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    height: 48,
    backgroundColor: "gray",
    width: 48,
    borderRadius: 50,
    alignSelf: "center",
  },
  bio: {
    flexDirection: "column",
    paddingLeft: 10,
    paddingTop: 5,
  },
  text: {
    color: COLORS.SECONDARY,
    fontSize: 18,
  },
  bellIcon: {
    alignSelf: "center",
  },
  searchBar: {
    flexDirection: "row",
    borderWidth: 0.5,
    height: 45,
    borderRadius: 10,
    margin: 10,
    borderColor: "#EDEDFC",
  },
  searchImage: {
    alignSelf: "center",
    marginHorizontal: 10,
  },
  searchText: {
    alignSelf: "center",
    fontSize: 16,
    color: COLORS.SECONDARY
  },
});