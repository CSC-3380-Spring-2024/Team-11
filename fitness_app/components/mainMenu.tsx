import React, { useState } from "react";
import { View, Text } from "react-native";
import TabsBar from "./mainMenuComponents/TabsBar";
import Calendar from "./calendar";
import CalorieCounter from "./calorieCounter";
import WorkoutCreator from "./workoutCreator";

const MainMenu: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("mainMenu");

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Main Content */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {selectedTab === "calendar" && <Calendar />}
        {selectedTab === "calorieCounter" && <CalorieCounter />}
        {selectedTab === "workoutCreator" && <WorkoutCreator />}
        {selectedTab === "mainMenu" && <Text>Main Menu Content Placeholder</Text>}
      </View>

      {/* Tab Bar */}
      <TabsBar selectedTab={selectedTab} onTabPress={setSelectedTab} />
    </View>
  );
};

export default MainMenu;