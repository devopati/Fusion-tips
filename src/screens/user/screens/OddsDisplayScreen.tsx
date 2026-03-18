import React, { useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { UserScreenNames } from "@/src/constants/screen-names";
import { NavigationPropType } from "@/src/types/types";
import {
  FreeTipsConstants,
  subscribedIdentifiers,
  SubscriptionsConstants,
} from "@/src/constants/subscriptions";
import { useAppSelector } from "@/redux/hooks/reduxHooks";
import useRevenueCatSDKHook from "../../hooks/useRevenueCatSDKHook";
import OddsGroupCard from "@/src/components/button/OddsGroupCard";
import { Button } from "react-native-paper";
import * as WebBrowser from "expo-web-browser";

const C = {
  screen: "#F4F6FB",
  white: "#FFFFFF",
  border: "#6d7075f3",
  ink: "#0D1525",
  sub: "#677490",
  blue: "#2563EB",
  blueLight: "#EFF6FF",
  gold: "#D97706",
  goldLight: "#FFFBEB",
};

const OddsDisplayScreen = () => {
  const navigation = useNavigation<NavigationPropType>();
  const { activePlans } = useAppSelector((s) => s.app);
  const { getCurrentCustomerActiveSubs } = useRevenueCatSDKHook();

  const navigateToOdds = (type: string) =>
    navigation.navigate(UserScreenNames.FREE_ODDS_SCREEN, { type });

  const navigateToUpgrading = (type: string, odd_type: string) => {
    const subscribed =
      activePlans.filter((p) => p.split(":")[1].includes(type)).length > 0;
    if (subscribed)
      return navigation.navigate(UserScreenNames.PAID_ODDS_SCREEN, {
        type: odd_type,
      });
    navigation.navigate(UserScreenNames.UPGRADE_PLAN, { type: odd_type });
  };

  // const isSubscribed = (type: string) =>
  //   activePlans.filter((p) => p.split(":")[1].includes(type)).length > 0;

  useEffect(() => {
    if (activePlans.length === 0) getCurrentCustomerActiveSubs();
  }, []);

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero header ── */}
        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>Today's Predictions</Text>
          <Text style={styles.heroTitle}>Pick your tips</Text>
          <Text style={styles.heroSub}>
            Expert-curated football predictions, updated daily
          </Text>
        </View>

        {/* ── Free Tips section ── */}
        <View style={styles.section}>
          {/* <View style={styles.sectionHead}>
            <View style={styles.sectionDot} />
            <Text style={styles.sectionLabel}>Free Tips</Text>
          </View> */}

          <View style={styles.grid}>
            <OddsGroupCard
              onPress={() => navigateToOdds(FreeTipsConstants.TWO_PLUS_DAILY)}
              title="2+ Odds Daily"
              icon="today"
              vip={false}
            />
            <OddsGroupCard
              onPress={() => navigateToOdds(FreeTipsConstants.OVER_UNDER)}
              title="Over / Under Tips"
              icon="trending-up"
              vip={false}
            />
            <OddsGroupCard
              onPress={() => navigateToOdds(FreeTipsConstants.TIP_OF_THE_DAY)}
              title="Tip of the Day"
              icon="star"
              vip={false}
            />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.buttons}>
          <Button
            onPress={async () => {
              await WebBrowser.openBrowserAsync(
                "https://www.freeprivacypolicy.com/live/a7f5d85b-7867-4589-9803-6721aaade292",
              );
            }}
            labelStyle={styles.link}
          >
            Privacy & Policy
          </Button>
          <Button
            onPress={() => navigation.navigate(UserScreenNames.FAQS)}
            labelStyle={styles.link}
          >
            FAQs
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default OddsDisplayScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
  scroll: {
    paddingBottom: 100,
  },

  // Hero
  hero: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
    // backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: "600",
    color: C.blue,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: C.white,
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 14,
    color: C.sub,
    lineHeight: 20,
  },

  // Section
  section: {
    paddingHorizontal: 16,
    paddingTop: 22,
  },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.blue,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: C.ink,
  },

  // Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 5,
  },

  divider: {
    height: 1,
    backgroundColor: C.border,
    marginHorizontal: 20,
    marginTop: 28,
  },
  buttons: {
    paddingVertical: 20,
  },
  link: { color: C.blue, fontSize: 15, fontWeight: "bold" },
});
