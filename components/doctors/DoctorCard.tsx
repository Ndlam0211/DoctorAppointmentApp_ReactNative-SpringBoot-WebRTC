import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchSpecialityById } from '@/api/specialities';

interface DoctorCardProps {
  id?: string;
  name?: string;
  image?: string;
  speciality?: string;
  horizontal?: string;
  style?: ViewStyle;
  imageStyle?: ViewStyle;
  displayAll?: boolean;
}

const cardGap = 16;
const cardWidth = (Dimensions.get('window').width - cardGap * 3)/2;

const DoctorCard:React.FC<DoctorCardProps> = ({id,name,image,speciality,horizontal,style,imageStyle,displayAll, ...props}) => {
    const { data } = useQuery({
      queryKey: ["specialities"],
      queryFn: () => fetchSpecialityById(speciality as string),
    });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() =>
        router.push({ pathname: "/doctor-detail", params: { doctorId: id } })
      }
    >
      <Image
        source={{ uri: image }}
        style={[styles.image, !horizontal ? { height: 220 } : {}, imageStyle]}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "wrap",
          padding: 5,
        }}
      >
        <Text style={styles.nameText}>{name}</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: displayAll?8:2 }}>
          <Image source={require("@/assets/images/star.png")} />
          <Text>{props?.rating}</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", padding: 5 }}>
        {displayAll && <Text style={{color:'gray',fontSize:16}}>{data?.title}</Text>}
        {!displayAll && <Text>Fee </Text>}
        {!displayAll && <Text style={{ fontWeight: "500" }}>${props?.fee}</Text>}
      </View>
    </TouchableOpacity>
  );
}

export default DoctorCard

const styles = StyleSheet.create({
    container:{
        flex:1,
        width: cardWidth,
    },
    image: {
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        width: '100%',
        height:"48%"
    },
    nameText: {
        fontSize:16,
        fontWeight:'500'
    }
})