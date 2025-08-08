import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View, Modal, Image } from "react-native";
import Button from "../button/Button";
import { COLORS } from "@/constants/Colors";
import { router } from "expo-router";

const ConfirmationModal = ({visible, onClose, modalText}) => {
    const onPress = useCallback(() => {
        onClose && onClose();
        router.push('/home')
    },[onClose])

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          onClose && onClose();
        }}
      >
        <View style={styles.container}>
          <View style={styles.modalView}>
            <View style={styles.imageContainer}>
                <Image source={require('@/assets/images/like.png')} />
            </View>
            <View style={{alignItems:'center'}}>
                <Text style={styles.textStyle}>{'Thank You !'}</Text>
                <Text style={{fontSize:18, color:'gray'}}>{'Your appointment successful'}</Text>
                <Text style={{paddingVertical:10, fontSize:16, alignSelf:'center'}}>{modalText}</Text>
            </View>
            <View style={styles.buttonClose}>
                <Button onPress={onPress} label={"Done"} style={{backgroundColor: COLORS.PRIMARY}} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // nền mờ
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    margin: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
    height: "80%",
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#2196F3",
  },
  buttonClose: {
    width:'100%',
    position:'absolute',
    bottom:20,
  },
  textStyle: {
    fontSize:28,
    paddingVertical:10,
    fontWeight:400
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  imageContainer: {
    backgroundColor: "#EDEDFC",
    borderRadius: '50%',
    height:120,
    width: 120,
    alignItems:'center',
    justifyContent:'center'
  }
});
