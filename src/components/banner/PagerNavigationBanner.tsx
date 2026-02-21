import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { darkblack } from "@/src/constants/Colors";
import PrimaryButton from "../button/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { NavigationPropType } from "@/src/types/types";
import { UserScreenNames } from "@/src/constants/screen-names";

const PagerNavigationBanner = () => {
  const navigation = useNavigation<NavigationPropType>();

  return (
    <View style={styles.container}>
      {/* <PrimaryButton
        onPress={() => navigation.navigate(UserScreenNames.HISTORY)}
        btnStyle={styles.btn}
        title="History"
      /> */}

      <PrimaryButton
        onPress={() => navigation.navigate(UserScreenNames.FAQS)}
        btnStyle={styles.btn}
        title="FAQs"
      />

      {/* <PrimaryButton
        onPress={() => navigation.navigate(UserScreenNames.SETTINGS)}
        btnStyle={styles.btn}
        title="Settings"
      /> */}

      {/* <PrimaryButton
        onPress={_handlePressButtonAsync}
        // onPress={() => navigation.navigate(AdminScreenNames.ADMIN)}
        btnStyle={styles.btn}
        title="Privacy & Policy"
      /> */}
    </View>
  );
};

export default PagerNavigationBanner;

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkblack,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btn: {
    width: "100%",
    // width: Dimensions.get("window").width / 2.2,
    backgroundColor: "#494949ff",
  },
});
