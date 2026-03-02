import React, { useRef } from "react";
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
  Pressable,
  View,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

// ─── Tokens ──────────────────────────────────────────────────────────────────
const T = {
  paper: "#080D17",
  gridLine: "#111E30",
  grid: "#0B1220",
  ink: "#C8D8EE",
  dim: "#2E4560",
  softDim: "#3A5070",
  accent: "#F59E0B", // amber — free
  accentDim: "#140C00",
  vipGold: "#FFD166", // brighter gold for VIP
  vipDim: "#1A1100",
  cyan: "#38BDF8",
  cyanDim: "#051520",
};

interface OddsGroupCardProps {
  title: string;
  onPress?: (e: GestureResponderEvent) => void;
  btnStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  loading?: boolean;
  selected?: boolean;
  icon?: string;
  count?: number;
  subscribed?: boolean;
  vip?: boolean;
}

const OddsGroupCard = ({
  title,
  onPress,
  btnStyle,
  titleStyle,
  loading,
  icon,
  count,
  vip = false,
}: OddsGroupCardProps) => {
  const scale = useRef(new Animated.Value(1)).current;
  const onIn = () =>
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 60,
    }).start();
  const onOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 60,
    }).start();

  const resolveIcon = () => {
    const k = icon ?? "";
    const t = title.toLowerCase();
    if (vip)
      return <Ionicons name="lock-closed-sharp" size={20} color={T.vipGold} />;
    if (k === "today" || t.includes("daily"))
      return <MaterialIcons name="adjust" size={20} color={T.cyan} />;
    if (k === "trending-up" || t.includes("over"))
      return <MaterialIcons name="trending-up" size={20} color={T.cyan} />;
    if (k === "star" || t.includes("vip"))
      return <Ionicons name="star" size={20} color={T.cyan} />;
    if (k === "timer" || t.includes("live"))
      return <MaterialIcons name="timer" size={20} color={T.cyan} />;
    if (k === "trophy" || t.includes("winner"))
      return <Ionicons name="trophy-outline" size={20} color={T.cyan} />;
    return <MaterialIcons name="sports-soccer" size={20} color={T.cyan} />;
  };

  const accentColor = vip ? T.vipGold : T.cyan;
  const accentDim = vip ? T.vipDim : T.cyanDim;
  const badgeLabel = vip ? "VIP" : "FREE";

  return (
    <Pressable onPress={onPress} onPressIn={onIn} onPressOut={onOut}>
      <Animated.View
        style={[
          styles.card,
          { borderColor: accentColor + "30" },
          btnStyle,
          { transform: [{ scale }] },
        ]}
      >
        {/* Top bar — colored accent line */}
        <View style={[styles.topBar, { backgroundColor: accentColor }]} />

        <View style={styles.inner}>
          {/* Icon */}
          <View style={[styles.iconBox, { backgroundColor: accentDim }]}>
            {loading ? (
              <ActivityIndicator size="small" color={accentColor} />
            ) : (
              resolveIcon()
            )}
          </View>

          {/* Title */}
          <Text
            style={[
              styles.title,
              { color: vip ? T.vipGold + "CC" : T.ink },
              titleStyle,
            ]}
            numberOfLines={2}
          >
            {title.toUpperCase()}
          </Text>

          {/* Footer row */}
          <View style={styles.cardFooter}>
            {count !== undefined && !vip && (
              <Text style={styles.countText}>{count} PICKS</Text>
            )}
            <View
              style={[
                styles.badge,
                { backgroundColor: accentDim, borderColor: accentColor + "40" },
              ]}
            >
              {vip && (
                <Ionicons
                  name="star"
                  size={8}
                  color={T.vipGold}
                  style={{ marginRight: 3 }}
                />
              )}
              <Text style={[styles.badgeText, { color: accentColor }]}>
                {badgeLabel}
              </Text>
            </View>
          </View>
        </View>

        {/* Corner arrow */}
        <View style={styles.corner}>
          <Ionicons
            name="chevron-forward"
            size={12}
            color={accentColor + "80"}
          />
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default OddsGroupCard;

const styles = StyleSheet.create({
  card: {
    width: Dimensions.get("window").width / 2 - 20,
    backgroundColor: T.paper,
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
    minHeight: 155,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  topBar: {
    height: 2,
    width: "100%",
  },
  inner: {
    padding: 14,
    flex: 1,
    gap: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    lineHeight: 18,
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  countText: {
    fontSize: 9,
    fontWeight: "700",
    color: T.dim,
    letterSpacing: 1.5,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  corner: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});
