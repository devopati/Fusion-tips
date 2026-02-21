import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import VipOdds from "./VipOdds";
import { PrimaryColor, whitecolor, yellowColor } from "@/src/constants/Colors";
import VipPaidOdds from "./VipPaidOdds";
import OddsDisplayScreen from "./OddsDisplayScreen";

const Tab = createMaterialTopTabNavigator();

const HomeTopTabs = () => {
  return (
    <View style={{ flex: 1 }}>
      <OddsDisplayScreen />
      {/* <VipOdds /> */}
    </View>
  );
};

export default HomeTopTabs;

const styles = StyleSheet.create({});
