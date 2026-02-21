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
} from "react-native";
import { whitecolor, yellowColor, PrimaryColor } from "@/src/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

/* -------------------------------------------------------------------------- */
/*                                   Colors                                   */
/* -------------------------------------------------------------------------- */

const CARD_BG_FREE = "#152035"; // dark navy for free cards
const CARD_BG_VIP = "#0F1A2B"; // slightly deeper navy for VIP cards
const ICON_BG_FREE = "#1E3A6E"; // blue circle bg for free icons
const ICON_BG_VIP = yellowColor; // gold circle bg for VIP icons
const FREE_BADGE_BG = "#2563EB"; // blue pill for FREE badge
const VIP_BADGE_BG = "#2A2000"; // dark gold pill for VIP badge
const GOLD_BORDER = yellowColor;

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

interface OddsGroupCardProps {
  title: string;
  onPress?: (e: GestureResponderEvent) => void;
  btnStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  buttonColor?: string;
  loading?: boolean;
  selected?: boolean;
  icon?: string;
  count?: number;
  subscribed?: boolean;
  vip?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

const OddsGroupCard = ({
  title,
  onPress,
  btnStyle,
  titleStyle,
  loading,
  selected = false,
  icon,
  count,
  subscribed,
  vip = false,
}: OddsGroupCardProps) => {
  const isVip = vip;

  const getIconName = (): string => {
    if (icon) return icon;
    const t = title.toLowerCase();
    if (t.includes("daily") || t.includes("today")) return "today";
    if (t.includes("over") || t.includes("under")) return "trending-up";
    if (t.includes("vip") || t.includes("premium")) return "star";
    if (t.includes("live")) return "timer";
    if (t.includes("winner") || t.includes("champion")) return "trophy";
    if (t.includes("btts")) return "trophy";
    return "sports-soccer";
  };

  const iconName = getIconName();
  const iconColor = isVip ? PrimaryColor : whitecolor;
  const iconSize = 32;

  const renderIcon = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={isVip ? PrimaryColor : whitecolor}
        />
      );
    }
    if (isVip) {
      // VIP cards show lock icon
      return (
        <Ionicons name="lock-closed" size={iconSize} color={PrimaryColor} />
      );
    }
    switch (iconName) {
      case "today":
        return (
          <MaterialIcons name="adjust" size={iconSize} color={iconColor} />
        );
      case "trending-up":
        return (
          <MaterialIcons name="trending-up" size={iconSize} color={iconColor} />
        );
      case "star":
        return <Ionicons name="star" size={iconSize} color={iconColor} />;
      case "timer":
        return <MaterialIcons name="timer" size={iconSize} color={iconColor} />;
      case "trophy":
        return (
          <Ionicons name="trophy-outline" size={iconSize} color={iconColor} />
        );
      case "sports-soccer":
        return (
          <MaterialIcons
            name="sports-soccer"
            size={iconSize}
            color={iconColor}
          />
        );
      default:
        return (
          <Ionicons name="trophy-outline" size={iconSize} color={iconColor} />
        );
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        isVip ? styles.vipContainer : styles.freeContainer,
        btnStyle,
      ]}
      android_ripple={{
        color: isVip ? yellowColor : `${whitecolor}20`,
        borderless: false,
      }}
    >
      {/* Badge: FREE or VIP — top right */}
      <View style={[styles.badge, isVip ? styles.vipBadge : styles.freeBadge]}>
        {isVip && (
          <Ionicons
            name="star"
            size={10}
            color={yellowColor}
            style={{ marginRight: 3 }}
          />
        )}
        <Text style={[styles.badgeText, isVip && styles.vipBadgeText]}>
          {isVip ? "VIP" : "FREE"}
        </Text>
      </View>

      {/* Icon Circle */}
      <View
        style={[
          styles.iconCircle,
          isVip ? styles.iconCircleVip : styles.iconCircleFree,
        ]}
      >
        {renderIcon()}
      </View>

      {/* VIP watermark text */}
      {isVip && (
        <Text style={styles.watermark} numberOfLines={1}>
          VIP Odds
        </Text>
      )}

      {/* Title */}
      <Text
        allowFontScaling={false}
        style={[styles.title, isVip && styles.titleVip, titleStyle]}
        numberOfLines={2}
      >
        {title}
      </Text>

      {/* Count (optional) */}
      {count !== undefined && !isVip && (
        <Text style={styles.countText}>{count} odds</Text>
      )}
    </Pressable>
  );
};

export default OddsGroupCard;

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginVertical: 5,
    overflow: "hidden",
    width: "48%",
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 18,
    minHeight: 170,
    position: "relative",
    // shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  freeContainer: {
    backgroundColor: CARD_BG_FREE,
    borderWidth: 0,
  },
  vipContainer: {
    backgroundColor: CARD_BG_VIP,
    borderWidth: 1.5,
    borderColor: GOLD_BORDER,
  },

  /* Badge */
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  freeBadge: {
    backgroundColor: FREE_BADGE_BG,
  },
  vipBadge: {
    backgroundColor: VIP_BADGE_BG,
    borderWidth: 1,
    borderColor: `${yellowColor}60`,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: whitecolor,
    letterSpacing: 0.3,
  },
  vipBadgeText: {
    color: yellowColor,
  },

  /* Icon Circle */
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    marginTop: 4,
  },
  iconCircleFree: {
    backgroundColor: ICON_BG_FREE,
  },
  iconCircleVip: {
    backgroundColor: yellowColor,
  },

  /* Watermark */
  watermark: {
    position: "absolute",
    bottom: 44,
    left: 14,
    right: 14,
    fontSize: 22,
    fontWeight: "800",
    color: `${yellowColor}25`,
    letterSpacing: 1,
  },

  /* Title */
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: whitecolor,
    lineHeight: 22,
    marginTop: 2,
  },
  titleVip: {
    color: `${yellowColor}99`, // muted gold when VIP / locked
  },

  /* Count */
  countText: {
    fontSize: 12,
    fontWeight: "500",
    color: `${whitecolor}60`,
    marginTop: 2,
  },
});
