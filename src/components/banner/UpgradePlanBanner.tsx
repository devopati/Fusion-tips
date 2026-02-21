import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { PrimaryColor, whitecolor } from "@/src/constants/Colors";
import PrimaryButton from "../button/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { NavigationPropType } from "@/src/types/types";
import { UserScreenNames } from "@/src/constants/screen-names";
import { useAppSelector } from "@/redux/hooks/reduxHooks";

const UpgradePlanBanner = () => {
  const navigation = useNavigation<NavigationPropType>();
  const { activePlans } = useAppSelector((s) => s.app);

  if (activePlans.length !== 0) return null;
  return (
    <View style={styles.container}>
      <Text allowFontScaling={false} style={styles.title}>
        VIP - Over 98% Success Rate
      </Text>
      <PrimaryButton
        onPress={() => navigation.navigate(UserScreenNames.SUBSCRIPTION_LIST)}
        title="Upgrade"
      />
    </View>
  );
};

export default UpgradePlanBanner;

const styles = StyleSheet.create({
  container: {
    backgroundColor: PrimaryColor,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  title: {
    color: whitecolor,
    fontSize: 16,
    fontWeight: "bold",
  },
});
