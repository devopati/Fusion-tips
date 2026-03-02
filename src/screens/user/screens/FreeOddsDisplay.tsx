import React, { useEffect } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

import OddContainer from "@/src/components/containers/OddContainer";
import NoOdds from "@/src/components/containers/NoOdds";
import useFirebaseFirestore from "../../hooks/useFirebaseFirestore";
import { NavigationPropType } from "@/src/types/types";
import { UserScreenNames } from "@/src/constants/screen-names";

const T = {
  bg: "#05080F",
  paper: "#080D17",
  gridLine: "#111E30",
  ink: "#C8D8EE",
  dim: "#2E4560",
  softDim: "#3A5070",
  pending: "#F59E0B",
  pendingDim: "#180E00",
  accent: "#F59E0B",
};

const FreeOddsDisplay = ({
  route,
}: {
  route: { params: { type: string } };
}) => {
  const navigation = useNavigation<NavigationPropType>();
  const {
    loading,
    getOddsHandler,
    freeOdds: oddsData,
  } = useFirebaseFirestore();

  useEffect(() => {
    getOddsHandler(`free-${route.params.type}`);
  }, []);

  return (
    <SafeAreaView edges={["bottom"]} style={styles.root}>
      {/* ── Ticker bar ── */}
      <View style={styles.tickerBar}>
        {/* <View style={styles.tickerDot} /> */}
        <Text style={styles.tickerText}>
          {/* LIVE FEED · */}
          {route.params.type?.replace(/-/g, " ").toUpperCase()}
        </Text>
        <Text style={styles.tickerCount}>{oddsData.length} TIPS</Text>
      </View>

      {/* ── List ── */}
      {oddsData.length === 0 ? (
        <NoOdds />
      ) : (
        <FlatList
          data={oddsData}
          renderItem={({ item }) => <OddContainer data={item} />}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => getOddsHandler(`free-${route.params.type}`)}
              tintColor={T.accent}
              colors={[T.accent]}
            />
          }
        />
      )}

      {/* ── History footer ── */}
      <View style={styles.footerWrap}>
        <Pressable
          onPress={() =>
            navigation.navigate(UserScreenNames.HISTORY, {
              type: `free-${route.params.type}`,
            })
          }
          style={({ pressed }) => [
            styles.historyBtn,
            pressed && { opacity: 0.65 },
          ]}
        >
          <Ionicons name="time-outline" size={14} color={T.softDim} />
          <Text style={styles.historyLabel}>MATCH HISTORY</Text>
          <Ionicons name="chevron-forward" size={14} color={T.dim} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default FreeOddsDisplay;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: T.bg,
  },

  // Ticker
  tickerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: T.gridLine,
    gap: 8,
  },
  tickerDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: T.pending,
  },
  tickerText: {
    flex: 1,
    fontSize: 10,
    fontWeight: "800",
    color: T.softDim,
    letterSpacing: 2.2,
  },
  tickerCount: {
    fontSize: 10,
    fontWeight: "700",
    color: T.dim,
    letterSpacing: 1.5,
  },

  list: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 20,
  },

  // Footer
  footerWrap: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: T.gridLine,
  },
  historyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 13,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: T.gridLine,
    backgroundColor: T.paper,
  },
  historyLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "800",
    color: T.softDim,
    letterSpacing: 2,
  },
});
