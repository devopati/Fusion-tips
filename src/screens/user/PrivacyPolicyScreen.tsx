import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { darkblack } from "@/src/constants/Colors";

const PrivacyPolicyScreen = () => {
  return (
    <View>
      <Text>PrivacyPolicyScreen</Text>
    </View>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 1,
    backgroundColor: darkblack,
    paddingTop: 10,
  },
});
