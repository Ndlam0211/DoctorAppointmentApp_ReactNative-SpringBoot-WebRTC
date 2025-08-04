import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '@/components/header/Header';
import Categories from '@/components/categories/Categories';

const Home = () => {
  return (
    <View style={{flex:1, backgroundColor:'white'}}>
        <Header/>
        <Categories />
    </View>
  )
}

export default Home;

const styles = StyleSheet.create({})