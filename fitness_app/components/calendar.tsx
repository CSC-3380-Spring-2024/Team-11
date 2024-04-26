import React from "react";
import { View, Text } from "react-native";

const Calendar: React.FC = () => {
  // Get current date
  const today = new Date();
  let options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric", 
    month: "long", 
    day: "numeric", 
};
  const dateString = today.toLocaleDateString(undefined, options);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>{dateString}</Text>
      <Text style={{ fontSize: 16 }}>Plans for the day:</Text>
      <Text>Placeholder for plan 1</Text>
      <Text>Placeholder for plan 2</Text>
      <Text>Placeholder for plan 3</Text>
    </View>
  );
};

export default Calendar;