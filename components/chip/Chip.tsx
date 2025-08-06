import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { COLORS } from '@/constants/Colors';

interface ChipProps {
  name?: string;
  description?: string;
  index: number;
  selected?: number;
  onChange?: (index:number)=> void
}

const Chip:React.FC<ChipProps> = ({name, description, index, onChange, selected}) => {
    const onPress = useCallback(() => {
        onChange && onChange(index);
    },[index,onChange])

    const isSelected = index === selected;

   return (
     <TouchableOpacity
       onPress={onPress}
       style={[
         styles.container,
         isSelected && { backgroundColor: COLORS.PRIMARY },
       ]}
     >
       <Text style={isSelected ? { color: COLORS.SECONDARY } : null}>
         {name}
       </Text>
     </TouchableOpacity>
   );
}

export default Chip

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E9E9Fe",
    padding: 10,
    borderRadius: 8,
    alignSelf: "center",
  },
});