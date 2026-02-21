import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  darkblack,
  PrimaryColor,
  whitecolor,
  yellowColor,
} from "@/src/constants/Colors";
import { FlatList } from "react-native-gesture-handler";
import IdentifierCard from "@/src/components/cards/IdentifierCard";
import { SubscriptionsConstants } from "@/src/constants/subscriptions";

const vipIdentifiersData = [
  {
    title: "Ultra Correct Scores",
    key: SubscriptionsConstants.CORRECT_SCORE,
  },
  {
    title: "HT/FT Tips",
    key: SubscriptionsConstants.HT_FT,
  },
  {
    title: "Ultra 10+ Odds",
    key: SubscriptionsConstants.DAILY_ODDS,
  },
  // {
  //   title: "Elite VIP Tips",
  //   key: SubscriptionsConstants.ELITE_VIP,
  // },
  {
    title: "Ultra 50+ Odds",
    key: SubscriptionsConstants.FIFTY_PLUS_DAILY_ODDS,
  },
  {
    title: "Over/Under Sure Tips",
    key: SubscriptionsConstants.ELITE_VIP_JACKPOT,
  },
];

const VipTopTab = () => {
  return (
    <View style={styles.container}>
      <View style={styles.detailview}>
        <Text allowFontScaling={false} style={styles.text}>
          Select to View
        </Text>
      </View>
      <FlatList
        data={vipIdentifiersData}
        renderItem={({ item }) => (
          <IdentifierCard type="vip" bgColor={yellowColor} data={item} />
        )}
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

export default VipTopTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 1,
    backgroundColor: darkblack,
  },
  flatlist: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    columnGap: 10,
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
