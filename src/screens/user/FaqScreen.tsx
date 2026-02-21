import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { darkblack, PrimaryColor, whitecolor } from "@/src/constants/Colors";
import FaqContainer from "@/src/components/containers/FaqContainer";
import { FlatList, Pressable } from "react-native-gesture-handler";
import { faqsData } from "../../data/faq-data";
import AdminLoginModal from "@/src/components/modals/AdminLoginModal";
import * as Haptics from "expo-haptics";

const FaqScreen = () => {
  const [showLogin, setShowLogin] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <AdminLoginModal visible={showLogin} setVisible={setShowLogin} />
      <Pressable
        onLongPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setShowLogin(true);
        }}
        style={styles.detailview}
      >
        <Text allowFontScaling={false} style={styles.text}>
          Frequently Asked Questions
        </Text>
      </Pressable>
      <FlatList
        data={faqsData}
        renderItem={({ item }) => <FaqContainer data={item} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatlist}
      />
    </View>
  );
};

export default FaqScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 1,
    backgroundColor: darkblack,
    paddingTop: 10,
  },
  flatlist: {
    gap: 10,
    paddingBottom: 100,
  },
  detailview: {
    backgroundColor: "#000",
    marginVertical: 20,
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: whitecolor,
    fontWeight: "bold",
  },
});
