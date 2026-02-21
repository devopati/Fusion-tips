import { StyleSheet, Text, View, ScrollView } from "react-native";
import {
  whitecolor,
  yellowColor,
  PrimaryColor,
  darkblack,
} from "@/src/constants/Colors";
import OddsGroupCard from "@/src/components/button/OddsGroupCard";
import { UserScreenNames } from "@/src/constants/screen-names";
import { useNavigation } from "@react-navigation/native";
import { NavigationPropType } from "@/src/types/types";
import {
  FreeTipsConstants,
  subscribedIdentifiers,
  SubscriptionsConstants,
} from "@/src/constants/subscriptions";
import { useAppSelector } from "@/redux/hooks/reduxHooks";
import useRevenueCatSDKHook from "../../hooks/useRevenueCatSDKHook";
import { useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const SCREEN_BG = "#0B1628";
const MUTED = "#8A9BB0";
const DIVIDER = "#1E2F45";
const GOLD = "#F5C842";
const PREMIUM_BG = "#F5C842";

const OddsDisplayScreen = () => {
  const navigation = useNavigation<NavigationPropType>();

  const navigateToOdds = (type: string) => {
    navigation.navigate(UserScreenNames.FREE_ODDS_SCREEN, { type });
  };

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
    if (activePlans.length === 0) {
      getCurrentCustomerActiveSubs();
    }
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── FREE TIPS Section ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FREE TIPS</Text>
          <Text style={styles.sectionSubtitle}>
            Expert predictions available to everyone
          </Text>

          <View style={styles.grid}>
            <OddsGroupCard
              onPress={() => navigateToOdds(FreeTipsConstants.TWO_PLUS_DAILY)}
              title="2 Odds Daily"
              icon="today"
              vip={false}
            />
            <OddsGroupCard
              onPress={() => navigateToOdds(FreeTipsConstants.SINGLE_BRAVE)}
              title="5 Odds Daily"
              icon="trophy"
              vip={false}
            />
            {/* <OddsGroupCard
              onPress={() => navigateToOdds(FreeTipsConstants.TWO_PLUS_DAILY)}
              title="BTTS Tips"
              icon="trophy"
              vip={false}
            />
            <OddsGroupCard
              onPress={() => navigateToOdds(FreeTipsConstants.SINGLE_BRAVE)}
              title="Over 2.5"
              icon="trending-up"
              vip={false}
            /> */}
          </View>
        </View>

        {/* ── Divider ── */}
        <View style={styles.divider} />

        {/* ── FIXED VIP TIPS Section ── */}
        <View style={styles.section}>
          <View style={styles.vipTitleRow}>
            <Text style={styles.vipSectionTitle}>FIXED VIP TIPS</Text>
            <View style={styles.premiumBadge}>
              <Ionicons name="star" size={12} color={PrimaryColor} />
              <Text style={styles.premiumText}>PREMIUM</Text>
            </View>
          </View>
          <Text style={styles.sectionSubtitle}>
            Exclusive high-odds predictions for subscribers
          </Text>

          <View style={styles.grid}>
            <OddsGroupCard
              onPress={() =>
                navigateToUpgrading(
                  subscribedIdentifiers.SUPREME_CORRECT_SCORES,
                  SubscriptionsConstants.SUPREME_CORRECT_SCORES,
                )
              }
              title="Supreme Correct Scores"
              subscribed={isSubscribed(
                subscribedIdentifiers.SUPREME_CORRECT_SCORES,
              )}
              vip
            />
            <OddsGroupCard
              onPress={() =>
                navigateToUpgrading(
                  subscribedIdentifiers.ELITE_HT_FT_VIP,
                  SubscriptionsConstants.ELITE_HT_FT_VIP,
                )
              }
              title="Elite HT/FT VIP"
              subscribed={isSubscribed(subscribedIdentifiers.ELITE_HT_FT_VIP)}
              vip
            />

            <OddsGroupCard
              onPress={() =>
                navigateToUpgrading(
                  subscribedIdentifiers.SURE_DRAWS_VIP,
                  SubscriptionsConstants.SURE_DRAWS_VIP,
                )
              }
              title="Sure Draws VIP"
              subscribed={isSubscribed(subscribedIdentifiers.SURE_DRAWS_VIP)}
              vip
            />
            <OddsGroupCard
              onPress={() =>
                navigateToUpgrading(
                  subscribedIdentifiers.CS_HT_FT_COMBO,
                  SubscriptionsConstants.CS_HT_FT_COMBO,
                )
              }
              title="CS + HT/FT Combo"
              subscribed={isSubscribed(subscribedIdentifiers.CS_HT_FT_COMBO)}
              vip
            />
            <OddsGroupCard
              onPress={() =>
                navigateToUpgrading(
                  subscribedIdentifiers.ALL_COMBINATIONS_VIP,
                  SubscriptionsConstants.ALL_COMBINATIONS_VIP,
                )
              }
              title="All Combinations VIP"
              subscribed={isSubscribed(
                subscribedIdentifiers.ALL_COMBINATIONS_VIP,
              )}
              vip
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OddsDisplayScreen;

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkblack,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  /* Section */
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: whitecolor,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: MUTED,
    fontWeight: "400",
    marginBottom: 20,
  },

  /* Grid */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  /* Divider */
  divider: {
    height: 1,
    backgroundColor: DIVIDER,
    marginHorizontal: 16,
    marginTop: 12,
  },

  /* VIP Title Row */
  vipTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  vipSectionTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: GOLD,
    letterSpacing: 0.5,
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: PREMIUM_BG,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: "800",
    color: PrimaryColor,
    letterSpacing: 0.5,
  },
});
