import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { PrimaryColor } from "@/src/constants/Colors";

const EmptyHeader = () => {
  return (
    <SafeAreaView
      style={{ backgroundColor: PrimaryColor, height: 54 }}
    ></SafeAreaView>
  );
};

export default EmptyHeader;

const styles = StyleSheet.create({});
