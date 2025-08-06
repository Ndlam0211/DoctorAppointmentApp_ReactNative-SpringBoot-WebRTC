import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import {Calendar, CalendarContext, WeekCalendar} from 'react-native-calendars'
import React, { useState } from 'react'
import dayjs from 'dayjs'
import BackHeader from '../header/BackHeader';
import { COLORS } from '@/constants/Colors';
import SectionHeader from '../sectionHeading/SectionHeader';
import Chip from '../chip/Chip';

const timeSlots = Array.from({ length: 8 }, (_, i) => ({
  time: `${10 + i}:00 ${10 + i >= 12 ? "PM" : "AM"}`,
  value: `${10 + i}:00`,
}));

const reminderSlots = [
  {
    title: '10 min',
    value: '10'
  },
  {
    title: '15 min',
    value: '15'
  },
  {
    title: '30 min',
    value: '30'
  },
]

const AppointmentSlot = () => {
  const today = dayjs().format("YYYY-MM-DD");
  const maxDate = dayjs().add(14, "day").format("YYYY-MM-DD");

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [selectedRemindTime, setSelectedRemindTime] = useState(0);

  return (
    <ScrollView style={styles.container}>
        <View style={{paddingLeft:20, paddingTop:10}}>
            <BackHeader />
        </View>
        <Calendar 
            minDate={today} maxDate={maxDate}
            onDayPress={(day)=>setSelectedDate(day?.dateString)} 
            markedDates={{[selectedDate]: {selected: true, disableTouchEvent: true, selectedColor: COLORS.PRIMARY} }}
        />
        <View style={styles.content}>
          <SectionHeader title={'Available Time Slot'} />
          <View>
            <FlatList 
              data={timeSlots}
              horizontal
              style={{padding:10, marginRight:10}}
              contentContainerStyle={{gap:8}}
              keyExtractor={(item, i)=>i.toString()}
              renderItem={({item,index}) => <Chip onChange={(index) => setSelectedSlot(index)} selected={selectedSlot} name={item.time} description={item.value} key={index} index={index} />}
            />
          </View>
          <SectionHeader title={'Remind Me Before'} />
          <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between', gap:8,padding:10}}>
            {reminderSlots.map((item,i) => <Chip onChange={(index) => setSelectedRemindTime(index)} selected={selectedRemindTime} name={item.title} description={item.value} key={i} index={i}/>)}
          </View>
        </View>
    </ScrollView>
  );
}

export default AppointmentSlot

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'white',
    },
    content: {
      padding:10
    }
})