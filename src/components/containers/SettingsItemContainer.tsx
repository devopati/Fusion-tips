import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { ReactNode } from "react";
import { darkGreen, whitecolor } from "@/src/constants/Colors";
import Entypo from "@expo/vector-icons/Entypo";

interface SettingsItemContainerProps {
  icon?: ReactNode;
  title?: string;
  onPress?: () => void;
}

const SettingsItemContainer: React.FC<SettingsItemContainerProps> = (props) => {
  return (
    <Pressable onPress={props.onPress} style={styles.container}>
      <View style={styles.flex}>
        <View style={styles.icon}>{props.icon}</View>
        <Text style={styles.text}>{props.title}</Text>
      </View>
      <Entypo name="chevron-small-right" size={28} color={whitecolor} />
    </Pressable>
  );
};

export default SettingsItemContainer;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: darkGreen,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 15,
  },
  text: {
    color: whitecolor,
    fontSize: 16,
  },
  icon: {
    backgroundColor: whitecolor,
    padding: 8,
    borderRadius: 999,
  },
  flex: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
  },
});
