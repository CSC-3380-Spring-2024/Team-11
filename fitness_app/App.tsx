import React from "react";
import { View } from "react-native";
import MainMenu from "./components/mainMenu";

const App: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <MainMenu navigation={undefined} />
    </View>
  );
};

export default App;