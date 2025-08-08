import React from "react";
import { Image } from "react-native";
import HomeFilled from "@/assets/images/home-filled.png";
import HomeEmpty from "@/assets/images/home-empty.png";
import AppointmentFilled from "@/assets/images/appointment-filled.png";
import AppointmentEmpty from "@/assets/images/appointment-empty.png";
import SettingFilled from "@/assets/images/setting-filled.png";
import SettingEmpty from "@/assets/images/settings.png";
import ProfileFilled from "@/assets/images/ProfileFilled.png";
import ProfileEmpty from "@/assets/images/ProfileEmpty.png";
import { Tabs } from "expo-router";

const BottomTabNavigator = () => {
  return (
    <Tabs
        screenOptions={({route}) => ({
            tabBarIcon: ({focused}) => {
                if (route.name === "home") {
                  return (
                    <Image
                      style={{ height: 32, width: 32 }}
                      source={focused ? HomeFilled : HomeEmpty}
                    />
                  );
                } else if (route.name === "appointment") {
                  return (
                    <Image
                      style={{ height: 32, width: 32 }}
                      source={focused ? AppointmentFilled : AppointmentEmpty}
                    />
                  );
                } else if (route.name === "setting") {
                  return (
                    <Image
                      style={{ height: 32, width: 32 }}
                      source={focused ? SettingFilled : SettingEmpty}
                    />
                  );
                } else if (route.name === "profile") {
                  return (
                    <Image
                      style={{ height: 32, width: 32 }}
                      source={focused ? ProfileFilled : ProfileEmpty}
                    />
                  );
                } 
            },
            tabBarLabel: ()=>{return null},
            headerStyle: {backgroundColor:"#0B3DA9"},
            headerTintColor:'white',
            headerTitleStyle: {},
            headerBackTitleVisible: false,
            headerShown: false,
            tabBarStyle: {
                alignItems:'center',
                justifyContent: 'center'
            },
            tabBarIconStyle:{
                marginTop:5
            }
        })}
    />
  );
};

export default BottomTabNavigator;
