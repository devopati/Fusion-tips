import { Dimensions, StyleSheet, Text, View } from "react-native";
import { darkblack } from "@/src/constants/Colors";
import PrimaryButton from "../button/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { NavigationPropType } from "@/src/types/types";
import {
  AdminScreenNames,
  UserScreenNames,
} from "@/src/constants/screen-names";

const AdminTopNavigationBanner = () => {
  const navigation = useNavigation<NavigationPropType>();

  return (
    <View style={styles.container}>
      <PrimaryButton
        onPress={() => navigation.navigate(AdminScreenNames.POST_ODD)}
        btnStyle={styles.btn}
        title="Post Odd"
      />

      <PrimaryButton
        onPress={() => navigation.navigate(AdminScreenNames.NOTIFY)}
        btnStyle={styles.btn}
        title="Notify Users"
      />

      {/* <PrimaryButton
        // onPress={_handlePressButtonAsync}
        // onPress={() => navigation.navigate(AdminScreenNames.ADMIN)}
        btnStyle={styles.btn}
        title="Actions"
      /> */}
    </View>
  );
};

export default AdminTopNavigationBanner;

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkblack,
    paddingVertical: 18,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btn: {
    width: Dimensions.get("window").width / 2.2,
    backgroundColor: "#333",
  },
});
