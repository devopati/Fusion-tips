import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { darkblack, PrimaryColor, whitecolor } from "@/src/constants/Colors";
import { FlatList } from "react-native-gesture-handler";
import IdentifierCard from "@/src/components/cards/IdentifierCard";
import { FreeTipsConstants } from "@/src/constants/subscriptions";

const freeIdentifiersData = [
  {
    title: "2+ Daily Free Tips",
    key: FreeTipsConstants.TWO_PLUS_DAILY,
  },
  {
    title: "Tip of the Day",
    key: FreeTipsConstants.TIP_OF_THE_DAY,
  },
  {
    title: "Two Plus Daily",
    key: FreeTipsConstants.TWO_PLUS_DAILY,
  },
];

const FreeOddsTopTab = () => {
  return (
    <View style={styles.container}>
      {/* <View style={styles.detailview}>
        <Text allowFontScaling={false} style={styles.text}>
          Select to View
        </Text>
      </View> */}
      <FlatList
        data={freeIdentifiersData}
        renderItem={({ item }) => <IdentifierCard type="free" data={item} />}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        numColumns={2}
        contentContainerStyle={styles.flatlist}
        columnWrapperStyle={{ gap: 10 }}
      />
    </View>
  );
};

export default FreeOddsTopTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 1,
    backgroundColor: "#000",
  },
  flatlist: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    columnGap: 10,
    paddingTop: 20,
  },
  detailview: {
    backgroundColor: PrimaryColor,
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
