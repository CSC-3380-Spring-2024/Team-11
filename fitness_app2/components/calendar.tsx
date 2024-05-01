import React, { useState }from "react";
import { View, Text, StyleSheet} from "react-native";
import { Calendar, CalendarList, Agenda} from 'react-native-calendars';

const CalendarScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  return (
    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
      <CalendarList
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate || '']: { selected: true, selectedColor: 'blue' },
        }}
      />
      {selectedDate && (
        <View style={{ marginTop: 20 }}>
        </View>
      )}
    </View>
  );
};

export default CalendarScreen;