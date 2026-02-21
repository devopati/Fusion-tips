import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { darkGreen } from "@/src/constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { NavigationPropType } from "@/src/types/types";
import { AdminScreenNames } from "@/src/constants/screen-names";

interface IdentifierCardProps {
  data: {
    title: string;
    key: string;
  };
  bgColor?: string;
  type: string;
}
const IdentifierCard: React.FC<IdentifierCardProps> = (props) => {
  const navigation = useNavigation<NavigationPropType>();
  return (
    <Pressable
      onPress={() =>
        navigation.navigate(
          props.type === "free"
            ? AdminScreenNames.FREE_ODDS
            : AdminScreenNames.VIP_ODDS,
          {
            type: props.data.key,
            title: props.data.title,
          }
        )
      }
      style={[styles.container, { backgroundColor: props.bgColor || "#000" }]}
    >
      <Text allowFontScaling={false} style={styles.title}>
        {props.data.title}
      </Text>
    </Pressable>
  );
};

export default IdentifierCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkGreen,
    padding: 20,
    width: Dimensions.get("window").width / 2 - 10,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
    lineHeight: 25,
  },
});
