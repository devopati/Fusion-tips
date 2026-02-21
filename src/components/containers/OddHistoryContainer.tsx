import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { OddsType } from "@/src/types/types";
import { getLocalizedDate } from "@/src/utils/get-localized-date";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

/* -------------------------------------------------------------------------- */
/*                                   Colors                                   */
/* -------------------------------------------------------------------------- */

const CARD_BG = "#162236";
const INSET_BG = "#1C2F47";
const GOLD_BG = "#2B2000";
const GOLD = "#F5C842";
const WHITE = "#FFFFFF";
const MUTED = "#8A9BB0";
const TEAL = "#2ECC71";
const TEAL_BG = "#1E6B47";
const BLUE_PILL = "#2563EB";
const BORDER_TEAL = "#2ECC71";
const BORDER_BLUE = "#2563EB";
const BORDER_RED = "#EF4444";
const RED_BG = "#6B1E1E";
const PREDICTION_BLUE = "#3B9EF5";

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

const OddHistoryContainer = ({
  data,
  onPress,
  hide,
}: {
  data: OddsType;
  onPress?: (e: GestureResponderEvent) => void;
  hide?: boolean;
}) => {
  const status = data.tip1_status; // "won" | "lost" | undefined/pending

  const isWon = status === "won";
  const isLost = status === "lost";
  const isPending = !isWon && !isLost;

  const cardBorderColor = isWon
    ? BORDER_TEAL
    : isLost
      ? BORDER_RED
      : BORDER_BLUE;

  const hasFinalScore =
    (isWon || isLost) &&
    (data.team1_score !== undefined || data.team2_score !== undefined);

  const finalScore = hasFinalScore
    ? `${data.team1_score ?? 0}-${data.team2_score ?? 0}`
    : null;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, { borderColor: cardBorderColor }]}
    >
      {/* ── Top Row: Date | Status Badge | Odds Badge ── */}
      <View style={styles.topRow}>
        {/* Date */}
        <View style={styles.dateRow}>
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={14}
            color={MUTED}
          />
          <Text style={styles.dateText}>
            {data.date_of_play ? getLocalizedDate(data.date_of_play) : "—"}
          </Text>
        </View>

        {/* Status Badge */}
        {isPending && (
          <View style={[styles.statusBadge, { backgroundColor: BLUE_PILL }]}>
            <Ionicons name="time-outline" size={12} color={WHITE} />
            <Text style={styles.statusText}>PENDING</Text>
          </View>
        )}
        {isWon && (
          <View style={[styles.statusBadge, { backgroundColor: TEAL }]}>
            <Ionicons name="checkmark" size={12} color={WHITE} />
            <Text style={styles.statusText}>WON</Text>
          </View>
        )}
        {isLost && (
          <View style={[styles.statusBadge, { backgroundColor: BORDER_RED }]}>
            <Ionicons name="close" size={12} color={WHITE} />
            <Text style={styles.statusText}>LOST</Text>
          </View>
        )}

        {/* Odds Badge */}
        <View style={styles.oddsBadge}>
          <MaterialCommunityIcons name="trending-up" size={14} color={GOLD} />
          <Text style={styles.oddsText}>{hide ? "VIP" : data.odds}</Text>
        </View>
      </View>

      {/* ── League Name ── */}
      <Text style={styles.leagueText} numberOfLines={1}>
        {data.league_name}
      </Text>

      {/* ── Teams Row ── */}
      <View style={styles.teamsRow}>
        <Text
          style={styles.teamLeft}
          numberOfLines={1}
          allowFontScaling={false}
        >
          {data.team1_name}
        </Text>
        <Text style={styles.vs}>VS</Text>
        <Text
          style={styles.teamRight}
          numberOfLines={1}
          allowFontScaling={false}
        >
          {data.team2_name}
        </Text>
      </View>

      {/* ── Prediction Box ── */}
      <View style={styles.predictionBox}>
        {hide ? (
          <View style={styles.lockRow}>
            <Ionicons name="lock-closed" size={13} color={GOLD} />
            <Text style={styles.lockText}>Premium</Text>
          </View>
        ) : (
          <Text style={styles.predictionText} allowFontScaling={false}>
            <Text style={styles.predictionLabel}>Prediction: </Text>
            <Text style={styles.predictionValue}>{data.tip1}</Text>
          </Text>
        )}
      </View>

      {/* ── Final Score Banner ── */}
      {finalScore && (
        <View
          style={[
            styles.finalScoreBox,
            { backgroundColor: isLost ? RED_BG : TEAL_BG },
          ]}
        >
          <Text style={styles.finalScoreText} allowFontScaling={false}>
            <Text style={styles.finalScoreLabel}>Final Score: </Text>
            <Text
              style={[
                styles.finalScoreValue,
                { color: isLost ? BORDER_RED : TEAL },
              ]}
            >
              {finalScore}
            </Text>
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export default OddHistoryContainer;

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  /* Card */
  container: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 14,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },

  /* ── Top Row ── */
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dateText: {
    fontSize: 13,
    fontWeight: "500",
    color: MUTED,
  },

  /* Status Badge */
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: WHITE,
    letterSpacing: 0.3,
  },

  /* Odds Badge */
  oddsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: GOLD_BG,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${GOLD}50`,
  },
  oddsText: {
    fontSize: 15,
    fontWeight: "800",
    color: GOLD,
  },

  /* ── League ── */
  leagueText: {
    fontSize: 12,
    color: MUTED,
    fontWeight: "400",
    marginBottom: 6,
  },

  /* ── Teams ── */
  teamsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  teamLeft: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: WHITE,
    textAlign: "left",
  },
  vs: {
    fontSize: 12,
    fontWeight: "600",
    color: MUTED,
    paddingHorizontal: 10,
  },
  teamRight: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: WHITE,
    textAlign: "right",
  },

  /* ── Prediction Box ── */
  predictionBox: {
    backgroundColor: INSET_BG,
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  predictionText: {
    textAlign: "center",
  },
  predictionLabel: {
    fontSize: 14,
    color: MUTED,
    fontWeight: "400",
  },
  predictionValue: {
    fontSize: 14,
    fontWeight: "700",
    color: PREDICTION_BLUE,
  },
  lockRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  lockText: {
    fontSize: 14,
    fontWeight: "600",
    color: GOLD,
  },

  /* ── Final Score Banner ── */
  finalScoreBox: {
    marginTop: 8,
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  finalScoreText: {
    textAlign: "center",
  },
  finalScoreLabel: {
    fontSize: 14,
    color: MUTED,
    fontWeight: "400",
  },
  finalScoreValue: {
    fontSize: 14,
    fontWeight: "800",
  },
});
