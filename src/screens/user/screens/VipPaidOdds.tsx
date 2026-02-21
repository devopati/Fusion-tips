import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import OddContainer from "@/src/components/containers/OddContainer";
import useFirebaseFirestore from "../../hooks/useFirebaseFirestore";
import { useEffect } from "react";
import { darkblack } from "@/src/constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { NavigationPropType, OddsType } from "@/src/types/types";
import { useAppSelector } from "@/redux/hooks/reduxHooks";
import NoOdds from "@/src/components/containers/NoOdds";
import { SubscriptionsConstants } from "@/src/constants/subscriptions";

const VipPaidOdds = ({ route }: { route: { params: { type: string } } }) => {
  const navigation = useNavigation<NavigationPropType>();

  const { plans } = useAppSelector((s) => s.app);

  const { loading, getOddsHandler, oddsData } = useFirebaseFirestore();

  const [combinedOddsData, setCombinedOddsData] = useState<OddsType[]>([]);

  useEffect(() => {
    if (route.params.type !== SubscriptionsConstants.ALL_COMBINED_TIPS) {
      getOddsHandler(`vip-${route.params.type}`);
    } else {
      Object.values(SubscriptionsConstants).map(async (value) => {
        await getOddsHandler(`vip-${value}`);
      });
    }
  }, []);

  useEffect(() => {
    if (oddsData.length !== 0)
      setCombinedOddsData((prev) => [...prev, ...oddsData]);
    console.log(combinedOddsData.length);
  }, [oddsData]);

  useLayoutEffect(() => {
    const curr_plan = plans.filter((p) =>
      p.identifier.includes(route.params.type)
    )[0];
    navigation.setOptions({
      headerTitle: `VIP ${route.params.type
        .split("_")
        .join(" ")}`.toUpperCase(),
      // headerTitle: "VIP Odds",
    });
  }, []);

  if (oddsData.length === 0) {
    return <NoOdds />;
  }
  return (
    <View style={{ backgroundColor: darkblack, flex: 1, paddingVertical: 10 }}>
      <FlatList
        data={
          route.params.type === SubscriptionsConstants.ALL_COMBINED_TIPS
            ? combinedOddsData
            : oddsData
        }
        renderItem={({ item }) => <OddContainer data={item} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatlist}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => getOddsHandler(`vip-${route.params.type}`)}
          />
        }
      />
    </View>
  );
};

export default VipPaidOdds;

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
});
