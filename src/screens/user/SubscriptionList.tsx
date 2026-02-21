import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PrimaryButton from "@/src/components/button/PrimaryButton";
import { ScrollView } from "react-native-gesture-handler";
import { darkblack, PrimaryColor, whitecolor } from "@/src/constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { NavigationPropType } from "@/src/types/types";
import { SubscriptionsConstants } from "@/src/constants/subscriptions";
import { UserScreenNames } from "@/src/constants/screen-names";

const SubscriptionList = () => {
  const navigation = useNavigation<NavigationPropType>();

  const navigateToUpgrading = (type: string) => {
    navigation.navigate(UserScreenNames.UPGRADE_PLAN, { type });
  };

  return (
    <View style={{ flex: 1, backgroundColor: darkblack }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.detailview, { marginVertical: 20 }]}>
          <Text allowFontScaling={false} style={styles.text}>
            Select Subscription type
          </Text>
        </View>

        <View style={{ paddingBottom: 10 }}>
          <Text style={styles.text1} allowFontScaling={false}>
            App subscriptions will renew automatically. You can turn this off
            any time. {"\n"}
            If you cancel your subscription, you can still use the subscription
            until the current billing period ends. {"\n\n"}
            If you have any questions or need help, please contact us at:{" "}
          </Text>
          <Text
            selectable
            dataDetectorType={"email"}
            allowFontScaling={false}
            style={[styles.text1, { fontWeight: "600", fontSize: 17 }]}
          >
            ultimatetips@gmail.com
          </Text>
        </View>

        <PrimaryButton
          onPress={() =>
            navigateToUpgrading(SubscriptionsConstants.CORRECT_SCORE)
          }
          btnStyle={styles.btn}
          titleStyle={styles.btntitle}
          title="Correct Score VIP"
        />

        <PrimaryButton
          onPress={() => navigateToUpgrading(SubscriptionsConstants.HT_FT)}
          btnStyle={styles.btn}
          titleStyle={styles.btntitle}
          title="Half-Time / Full-Time VIP"
        />

        <PrimaryButton
          onPress={() => navigateToUpgrading(SubscriptionsConstants.DAILY_ODDS)}
          btnStyle={styles.btn}
          titleStyle={styles.btntitle}
          title="Daily 10+ odds VIP"
        />

        <PrimaryButton
          onPress={() => navigateToUpgrading(SubscriptionsConstants.ELITE_VIP)}
          btnStyle={styles.btn}
          titleStyle={styles.btntitle}
          title="Elite VIP"
        />

        <PrimaryButton
          onPress={() =>
            navigateToUpgrading(SubscriptionsConstants.ELITE_VIP_JACKPOT)
          }
          btnStyle={styles.btn}
          titleStyle={styles.btntitle}
          title="Elite Jackpot VIP"
        />
      </ScrollView>
    </View>
  );
};

export default SubscriptionList;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 10,
    gap: 20,
    paddingBottom: 100,
  },
  btn: { paddingVertical: 10 },
  btntitle: { fontSize: 19, fontWeight: "bold" },
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
    fontWeight: "700",
    fontSize: 15,
    color: whitecolor,
  },
});
