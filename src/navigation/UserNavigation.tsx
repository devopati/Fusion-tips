import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserScreenNames } from "../constants/screen-names";
import Home from "../screens/user/Home";
import History from "../screens/user/History";
import EmptyHeader from "../components/headers/EmptyHeader";
import UpgradePlan from "../screens/user/UpgradePlan";
import FaqScreen from "../screens/user/FaqScreen";
import PrivacyPolicyScreen from "../screens/user/PrivacyPolicyScreen";
import { PrimaryColor, whitecolor } from "../constants/Colors";
import SubscriptionList from "../screens/user/SubscriptionList";
import VipPaidOdds from "../screens/user/screens/VipPaidOdds";
import Settings from "../screens/user/Settings";
import FreeOddsDisplay from "../screens/user/screens/FreeOddsDisplay";

const Stack = createNativeStackNavigator();

const UserNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={UserScreenNames.HOME}
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={UserScreenNames.HISTORY}
        component={History}
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
        name={UserScreenNames.FAQS}
        component={FaqScreen}
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
        name={UserScreenNames.SETTINGS}
        component={Settings}
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
        name={UserScreenNames.PRIVACY_POLICY}
        component={PrivacyPolicyScreen}
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
        name={UserScreenNames.UPGRADE_PLAN}
        component={UpgradePlan}
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
        name={UserScreenNames.SUBSCRIPTION_LIST}
        component={SubscriptionList}
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
        name={UserScreenNames.PAID_ODDS_SCREEN}
        component={VipPaidOdds}
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
        name={UserScreenNames.FREE_ODDS_SCREEN}
        component={FreeOddsDisplay}
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

export default UserNavigation;

const styles = StyleSheet.create({});
