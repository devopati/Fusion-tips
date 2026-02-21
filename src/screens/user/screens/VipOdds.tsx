import { StyleSheet, Text, View } from "react-native";

import {
  darkblack,
  darkGreen,
  PrimaryColor,
  whitecolor,
} from "@/src/constants/Colors";
import OddsGroupCard from "@/src/components/button/OddsGroupCard";
import { ScrollView } from "react-native-gesture-handler";
import { UserScreenNames } from "@/src/constants/screen-names";
import { useNavigation } from "@react-navigation/native";
import { NavigationPropType } from "@/src/types/types";
import {
  subscribedIdentifiers,
  SubscriptionsConstants,
} from "@/src/constants/subscriptions";
import { useAppSelector } from "@/redux/hooks/reduxHooks";
import useRevenueCatSDKHook from "../../hooks/useRevenueCatSDKHook";
import { useEffect } from "react";

const VipOdds = () => {
  const navigation = useNavigation<NavigationPropType>();

  const { activePlans } = useAppSelector((s) => s.app);
  const { getCurrentCustomerActiveSubs } = useRevenueCatSDKHook();

  const navigateToUpgrading = (type: string, odd_type: string) => {
    const subscribed =
      activePlans.filter((p) => p.split(":")[1].includes(type)).length > 0;
    if (subscribed)
      return navigation.navigate(UserScreenNames.PAID_ODDS_SCREEN, {
        type: odd_type,
      });

    navigation.navigate(UserScreenNames.UPGRADE_PLAN, { type: odd_type });
  };

  const isSubscribed = (type: string) => {
    return activePlans.filter((p) => p.split(":")[1].includes(type)).length > 0;
  };

  useEffect(() => {
    //retry to make sure we have the latest data
    if (activePlans.length === 0) {
      getCurrentCustomerActiveSubs();
    }
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollcontainer}>
        <OddsGroupCard
          onPress={() =>
            navigateToUpgrading(
              subscribedIdentifiers.CORRECT_SCORE,
              SubscriptionsConstants.CORRECT_SCORE,
            )
          }
          btnStyle={styles.btn}
          titleStyle={styles.btntitle}
          title={`Ultra Correct Scores`}
          subscribed={isSubscribed(subscribedIdentifiers.CORRECT_SCORE)}
          vip
        />

        <OddsGroupCard
          onPress={() =>
            navigateToUpgrading(
              subscribedIdentifiers.HT_FT,
              SubscriptionsConstants.HT_FT,
            )
          }
          btnStyle={styles.btn}
          titleStyle={styles.btntitle}
          title={`HT/ FT PICKS`}
          subscribed={isSubscribed(subscribedIdentifiers.HT_FT)}
          vip
        />

        <OddsGroupCard
          onPress={() =>
            navigateToUpgrading(
              subscribedIdentifiers.TEN_PLUS,
              SubscriptionsConstants.DAILY_ODDS,
            )
          }
          btnStyle={styles.btn}
          titleStyle={styles.btntitle}
          title={`Ultra 10+ Odds`}
          subscribed={isSubscribed(subscribedIdentifiers.TEN_PLUS)}
          vip
        />

        <OddsGroupCard
          onPress={() =>
            navigateToUpgrading(
              subscribedIdentifiers.FIFTY_PLUS,
              SubscriptionsConstants.FIFTY_PLUS_DAILY_ODDS,
            )
          }
          btnStyle={styles.btn}
          titleStyle={styles.btntitle}
          title={`CS + HT/FT Combo`}
          subscribed={isSubscribed(subscribedIdentifiers.FIFTY_PLUS)}
          vip
        />

        <OddsGroupCard
          onPress={() =>
            navigateToUpgrading(
              subscribedIdentifiers.OVER_UNDER,
              SubscriptionsConstants.ELITE_VIP_JACKPOT,
            )
          }
          btnStyle={styles.btn}
          titleStyle={styles.btntitle}
          title={`OV/UN Sure Tips`}
          subscribed={isSubscribed(subscribedIdentifiers.OVER_UNDER)}
        />

        <OddsGroupCard
          onPress={() =>
            navigateToUpgrading(
              subscribedIdentifiers.ALL_COMBINED_TIPS,
              SubscriptionsConstants.ALL_COMBINED_TIPS,
            )
          }
          btnStyle={styles.btn}
          titleStyle={styles.btntitle}
          title={`All Combined Special Tips`}
          subscribed={isSubscribed(subscribedIdentifiers.ALL_COMBINED_TIPS)}
        />
      </ScrollView>
    </View>
  );
};

export default VipOdds;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingHorizontal: 4,
    backgroundColor: darkblack,
    paddingTop: 10,
  },

  scrollcontainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
    gap: 5,
    paddingBottom: 100,
  },
  btn: { paddingVertical: 10 },
  btntitle: { fontSize: 17, fontWeight: "bold" },
  detailview: {
    backgroundColor: PrimaryColor,
    paddingVertical: 10,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: whitecolor,
    fontWeight: "bold",
  },
  text1: {
    lineHeight: 25,
    fontWeight: "500",
    fontSize: 15,
    color: whitecolor,
  },
});
