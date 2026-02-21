import { StyleSheet, Text, View } from "react-native";
import { darkblack } from "@/src/constants/Colors";
import AdminTopNavigationBanner from "@/src/components/banner/AdminTopNavigationBanner";
import AdminTopTabs from "./screens/AdminTopTabs";
import AdminBottomSheet from "@/src/components/modals/AdminBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const AdminHome = () => {
  return (
    <View style={{ flex: 1, backgroundColor: darkblack }}>
      <AdminTopNavigationBanner />
      <AdminTopTabs />
      {/* <Text>AdminHome</Text> */}
    </View>
  );
};

export default AdminHome;

const styles = StyleSheet.create({});
