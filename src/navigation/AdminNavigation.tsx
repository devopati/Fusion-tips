import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AdminScreenNames } from "../constants/screen-names";
import PostOdd from "../screens/admin/PostOdd";
import AdminHome from "../screens/admin/AdminHome";
import { darkblack, PrimaryColor, whitecolor } from "../constants/Colors";
import EditOdd from "../screens/admin/EditOdd";
import AdminFreeOdds from "../screens/admin/screens/AdminFreeOdds";
import AdminVipOdds from "../screens/admin/screens/AdminVipOdds";
import NotifyUsers from "../screens/admin/NotifyUsers";

const Stack = createNativeStackNavigator();

const AdminNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={AdminScreenNames.ADMIN_HOME}
        component={AdminHome}
        options={{
          headerStyle: {
            backgroundColor: "#000",
          },
          headerTitleStyle: {
            color: whitecolor,
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name={AdminScreenNames.POST_ODD}
        component={PostOdd}
        options={{
          headerStyle: {
            // backgroundColor: PrimaryColor,
          },
          headerTitleStyle: {
            color: whitecolor,
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name={AdminScreenNames.EDIT_ODD}
        component={EditOdd}
        options={{
          headerStyle: {
            // backgroundColor: PrimaryColor,
          },
          headerTitleStyle: {
            color: whitecolor,
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name={AdminScreenNames.FREE_ODDS}
        component={AdminFreeOdds}
        options={{
          headerStyle: {
            backgroundColor: PrimaryColor,
          },
          headerTitleStyle: {
            color: whitecolor,
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name={AdminScreenNames.VIP_ODDS}
        component={AdminVipOdds}
        options={{
          headerStyle: {
            backgroundColor: PrimaryColor,
          },
          headerTitleStyle: {
            color: whitecolor,
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name={AdminScreenNames.NOTIFY}
        component={NotifyUsers}
        options={{
          headerStyle: {
            backgroundColor: PrimaryColor,
          },
          headerTitleStyle: {
            color: whitecolor,
            fontWeight: "bold",
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigation;
