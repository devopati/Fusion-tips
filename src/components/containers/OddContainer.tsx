import React, { useRef } from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { OddsType } from "@/src/types/types";
import { getLocalizedDate } from "@/src/utils/get-localized-date";

interface OddContainerProps {
  onPress?: (e: GestureResponderEvent) => void;
  data: OddsType;
  hide?: boolean;
  status?: "pending" | "won" | "lost";
  finalScore?: string;
}

// ─── Terminal Palette ─────────────────────────────────────────────────────────
const T = {
  bg: "#05080F",
  paper: "#080D17",
  grid: "#0B1220",
  gridLine: "#111E30",
  ink: "#C8D8EE",
  dim: "#2E4560",
  softDim: "#3A5070",

  won: "#00E5A0",
  lost: "#FF3B5C",
  pending: "#F59E0B",
  wonDim: "#001810",
  lostDim: "#1A0008",
  pendingDim: "#180E00",

  gold: "#F59E0B",
  goldDim: "#140C00",
  cyan: "#38BDF8",
};

const STATUS_MAP = {
  won: {
    color: "#00E5A0",
    dim: "#001810",
    label: "WIN",
    icon: "checkmark-sharp" as const,
  },
  lost: {
    color: "#FF3B5C",
    dim: "#1A0008",
    label: "LOSS",
    icon: "close" as const,
  },
  pending: {
    color: "#F59E0B",
    dim: "#180E00",
    label: "LIVE",
    icon: "radio-button-on" as const,
  },
};

const OddContainer = ({
  onPress,
  data,
  hide,
  status = "pending",
  finalScore,
}: OddContainerProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const onIn = () =>
    Animated.spring(scale, {
      toValue: 0.982,
      useNativeDriver: true,
      speed: 70,
    }).start();
  const onOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 70,
    }).start();

  const s = STATUS_MAP[status];

  return (
    <Pressable onPress={onPress} onPressIn={onIn} onPressOut={pressOut}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        {/* Left accent bar */}
        <View style={[styles.bar, { backgroundColor: s.color }]} />

        <View style={styles.body}>
          {/* ── Meta: league · date · odds ── */}
          <View style={styles.metaRow}>
            <Text style={styles.league} numberOfLines={1}>
              {(data.league_name ?? "LEAGUE").toUpperCase()}
            </Text>
            <View style={styles.metaRight}>
              <Text style={styles.dateText}>
                {data.date_of_play
                  ? getLocalizedDate(Number(data.date_of_play))
                  : "—"}
              </Text>
              <View style={styles.oddsChip}>
                <Text style={styles.oddsTag}>ODD</Text>
                <Text style={styles.oddsNum}>{hide ? "—" : data.odds}</Text>
              </View>
            </View>
          </View>

          {/* ── Match: team1 · dot · team2 ── */}
          <View style={styles.matchRow}>
            <Text style={styles.team} numberOfLines={1}>
              {data.team1_name}
            </Text>
            <View style={[styles.pulse, { backgroundColor: s.color }]} />
            <Text
              style={[styles.team, { textAlign: "right" }]}
              numberOfLines={1}
            >
              {data.team2_name}
            </Text>
          </View>

          {/* ── Prediction strip ── */}
          <View style={styles.predStrip}>
            {hide ? (
              <>
                <Ionicons name="lock-closed-sharp" size={11} color={T.gold} />
                <Text style={styles.lockText}>PREMIUM · UNLOCK TO VIEW</Text>
              </>
            ) : (
              <>
                <Text style={styles.predKey}>PICK</Text>
                <View style={styles.predDivider} />
                <Text style={styles.predVal}>{data.tip1}</Text>
              </>
            )}
          </View>

          {/* ── Footer: status + final score ── */}
          <View style={styles.footer}>
            <View
              style={[
                styles.pill,
                { backgroundColor: s.dim, borderColor: s.color + "50" },
              ]}
            >
              <Ionicons name={s.icon} size={9} color={s.color} />
              <Text style={[styles.pillText, { color: s.color }]}>
                {s.label}
              </Text>
            </View>

            {finalScore && (
              <View
                style={[
                  styles.pill,
                  {
                    backgroundColor: status === "lost" ? T.lostDim : T.wonDim,
                    borderColor: (status === "lost" ? T.lost : T.won) + "50",
                  },
                ]}
              >
                <Text style={styles.ftTag}>FT</Text>
                <Text
                  style={[
                    styles.pillText,
                    { color: status === "lost" ? T.lost : T.won },
                  ]}
                >
                  {finalScore}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );

  function pressOut() {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 70,
    }).start();
  }
};

export default OddContainer;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: T.paper,
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: T.gridLine,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 7,
  },
  bar: {
    width: 3,
  },
  body: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },

  // Meta
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  league: {
    fontSize: 10,
    fontWeight: "700",
    color: T.softDim,
    letterSpacing: 2,
    flexShrink: 1,
    marginRight: 8,
  },
  metaRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateText: {
    fontSize: 11,
    color: T.dim,
    fontVariant: ["tabular-nums"],
  },
  oddsChip: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 5,
    backgroundColor: T.goldDim,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: T.gold + "55",
  },
  oddsTag: {
    fontSize: 9,
    fontWeight: "800",
    color: T.dim,
    letterSpacing: 1.5,
  },
  oddsNum: {
    fontSize: 16,
    fontWeight: "900",
    color: T.gold,
    fontVariant: ["tabular-nums"],
  },

  // Match
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  team: {
    flex: 1,
    fontSize: 17,
    fontWeight: "800",
    color: T.ink,
    letterSpacing: -0.4,
  },
  pulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Prediction
  predStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: T.grid,
    borderRadius: 7,
    paddingVertical: 9,
    paddingHorizontal: 13,
  },
  predKey: {
    fontSize: 10,
    fontWeight: "800",
    color: T.softDim,
    letterSpacing: 2,
  },
  predDivider: {
    width: 1,
    height: 13,
    backgroundColor: T.dim,
  },
  predVal: {
    fontSize: 13,
    fontWeight: "700",
    color: T.cyan,
  },
  lockText: {
    fontSize: 10,
    fontWeight: "700",
    color: T.gold,
    letterSpacing: 1.5,
    marginLeft: 6,
  },

  // Footer
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  ftTag: {
    fontSize: 9,
    fontWeight: "700",
    color: T.softDim,
    letterSpacing: 1.5,
  },
});
