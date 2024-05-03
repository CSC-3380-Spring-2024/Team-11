import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface TabsBarProps {
  selectedTab: string;
  onTabPress: (tabName: string) => void;
}

const TabsBar: React.FC<TabsBarProps> = ({ selectedTab, onTabPress }) => {
  const renderTab = (tabName: string, title: string) => {
    const isSelected = selectedTab === tabName;
    return (
      <TouchableOpacity
        key={tabName}
        style={{ flex: 1, alignItems: "center", paddingVertical: 10, borderBottomWidth: isSelected ? 2 : 0, borderBottomColor: "blue" }}
        onPress={() => onTabPress(tabName)}
      >
        <Text style={{ color: isSelected ? "blue" : "black", fontWeight: isSelected ? "bold" : "normal" }}>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", borderTopWidth: 1, borderTopColor: "#ccc", paddingBottom: 10 }}>
      {renderTab("timerApp", "Timer")}
      {renderTab("calendar", "Calendar")}
      {renderTab("calorieCounter", "Calorie Counter")}
      {renderTab("workoutCreator", "Workout Creator")}
    </View>
  );
};

export default TabsBar;
