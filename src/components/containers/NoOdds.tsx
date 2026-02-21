import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { darkblack } from "@/src/constants/Colors";

const NoOdds = () => {
  return (
    <View
      style={{
        backgroundColor: darkblack,
        flex: 1,
        paddingVertical: 10,
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 18,
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        {/* No odds available */}
        ...
      </Text>
    </View>
  );
};

export default NoOdds;

const styles = StyleSheet.create({});
