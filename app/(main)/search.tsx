import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback } from 'react'
import { COLORS } from '@/constants/Colors';
import SearchBar from '@/components/search/SearchBar';

const Search = () => {
  const onChange = useCallback((text:string) => {
    console.log(text);
  },[]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar onChange={onChange} />
      </View>

      <View style={styles.subContainer}>
        <Text>Recetn Searches</Text>
        <TouchableOpacity style={styles.clearButton}><Text style={styles.clearText}>Clear</Text></TouchableOpacity>
      </View>
      {/* List of recent searches */}
    </View>
  );
}

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.SECONDARY,
  },
  searchContainer: {
    backgroundColor: COLORS.PRIMARY,
    height: 65,
    alignItems: "center",
  },
  subContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  clearButton: {

  },
  clearText: {
    color: COLORS.PRIMARY,
    fontWeight: "bold"
  }
});