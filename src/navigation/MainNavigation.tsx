import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AdminScreenNames, UserScreenNames } from "../constants/screen-names";
import UserNavigation from "./UserNavigation";
import AdminNavigation from "./AdminNavigation";

import { createDrawerNavigator } from "@react-navigation/drawer";
import FaqScreen from "../screens/user/FaqScreen";
import { PrimaryColor } from "../constants/Colors";

const Drawer = createDrawerNavigator();

function UserDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#000",
        },
        drawerStyle: {
          backgroundColor: "#000",
        },
        drawerLabelStyle: {
          color: "#fff",
        },
        drawerActiveBackgroundColor: PrimaryColor,
        drawerPosition: "right",
        headerTintColor: "#fff",
      }}
    >
      <Drawer.Screen name={UserScreenNames.USER} component={UserNavigation} />
      <Drawer.Screen name={UserScreenNames.FAQS} component={FaqScreen} />
    </Drawer.Navigator>
  );
}

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={UserScreenNames.DRAWER}
        options={{
          title: "Supreme Scores",
        }}
        component={UserDrawer}
      />
      <Stack.Screen name={AdminScreenNames.ADMIN} component={AdminNavigation} />
    </Stack.Navigator>
  );
};

export default MainNavigation;

const styles = StyleSheet.create({});
