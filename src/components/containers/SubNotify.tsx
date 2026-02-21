import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { PrimaryColor } from "@/src/constants/Colors";

const SubNotify = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Our source is legit and transparent. Winning is guaranteed to all VIP
        members.
      </Text>
    </View>
  );
};

export default SubNotify;

const styles = StyleSheet.create({
  container: {
    backgroundColor: PrimaryColor,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "white",
  },
  title: {
    color: "white",
    fontSize: 16,
  },
});
