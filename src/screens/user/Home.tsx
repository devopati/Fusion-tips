import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { darkblack } from "@/src/constants/Colors";
import UpgradePlanBanner from "@/src/components/banner/UpgradePlanBanner";
import { ScrollView } from "react-native-gesture-handler";
import PagerNavigationBanner from "@/src/components/banner/PagerNavigationBanner";
import HomeTopTabs from "./screens/HomeTopTabs";

const Home = () => {
  return (
    <View style={{ flex: 1, backgroundColor: darkblack }}>
      {/* <UpgradePlanBanner /> */}
      {/* <PagerNavigationBanner /> */}
      <HomeTopTabs />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
