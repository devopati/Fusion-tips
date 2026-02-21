import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  darkblack,
  PrimaryColor,
  whitecolor,
  yellowColor,
} from "@/src/constants/Colors";
import AdminFreeOdds from "./AdminFreeOdds";
import AdminVipOdds from "./AdminVipOdds";
import AdminHistoryScreen from "./AdminHistoryScreen";
import FreeOddsTopTab from "./FreeOddsTopTab";
import VipTopTab from "./VipTopTab";

const Tab = createMaterialTopTabNavigator();

const AdminTopTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#000000",
        },
        tabBarLabelStyle: {
          color: whitecolor,
          fontWeight: "bold",
        },
        tabBarIndicatorStyle: {
          backgroundColor: yellowColor,
        },
      }}
    >
      <Tab.Screen name="FREE ODDS" component={FreeOddsTopTab} />
      {/* <Tab.Screen name="VIP ODDS" component={VipTopTab} /> */}
      <Tab.Screen name="HISTORY" component={AdminHistoryScreen} />
    </Tab.Navigator>
  );
};

export default AdminTopTabs;

const styles = StyleSheet.create({});
