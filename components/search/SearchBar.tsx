import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { COLORS } from '@/constants/Colors'
import Button from '../button/Button'
import { router } from 'expo-router'

interface SearchBarProps {
  onChange: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onChange }) => {
  return (
    <View style={styles.container}>
      <Button onPress={router.back} style={styles.backButton}><Text>Back</Text></Button>
      <TextInput style={styles.input} placeholder='Search Doctor...'
          clearButtonMode='always' autoCapitalize='none' autoCorrect={false} onChangeText={onChange} />
    </View>
  )
}

export default SearchBar

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.SECONDARY,
        flexDirection: 'row',
        borderRadius:10,
        margin: 10,
        height: 48,
        width: "95%",
        alignItems: "center"
    },
    backButton: {
      paddingHorizontal: 10
    },
    input: {
      width: "85%"
    }
})