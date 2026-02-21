import { StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import {
  darkblack,
  darkGreen,
  lightGreen,
  whitecolor,
} from "@/src/constants/Colors";
import useRevenueCatSDKHook from "../hooks/useRevenueCatSDKHook";
import { PurchasesPackage } from "react-native-purchases";
import { useAppSelector } from "@/redux/hooks/reduxHooks";
import { useNavigation } from "@react-navigation/native";
import { NavigationPropType } from "@/src/types/types";
import { getObjectData } from "@/src/utils/async-storage";

const { width } = Dimensions.get("window");

const UpgradePlan = ({ route }: { route: { params: { type: string } } }) => {
  const navigation = useNavigation<NavigationPropType>();

  const {
    purchasePlanAsync,
    setSuccess,
    success,
    getAvailableSubscriptionPlans,
  } = useRevenueCatSDKHook();

  const { plans: availablePlans } = useAppSelector((state) => state.app);

  const [plans, setPlans] = useState<PurchasesPackage[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    if (availablePlans) {
      const filteredPlans = availablePlans.filter((p) =>
        p.identifier.includes(route.params.type),
      );
      setPlans(filteredPlans);
      // Auto-select the first plan (usually the better value one)
      if (filteredPlans.length > 0) {
        setSelectedPlan(filteredPlans[0].identifier);
      }
    }
  }, [availablePlans]);

  useEffect(() => {
    const loadStoredPlans = async () => {
      const stored = await getObjectData("available-plans");
      if (Array.isArray(stored)) {
        const filteredPlans = stored.filter((p) =>
          p.identifier.includes(route.params.type),
        );
        setPlans(filteredPlans);
        if (filteredPlans.length > 0) {
          setSelectedPlan(filteredPlans[0].identifier);
        }
      }
    };

    if (!availablePlans || availablePlans.length === 0) {
      loadStoredPlans();
    }
    getAvailableSubscriptionPlans();
  }, []);

  useEffect(() => {
    if (success) {
      setSuccess(false);
      navigation.goBack();
    }
  }, [success]);

  const handlePurchase = () => {
    const plan = plans.find((p) => p.identifier === selectedPlan);
    if (plan) {
      purchasePlanAsync(plan);
    }
  };

  const calculateSavings = (monthlyPrice: string, quarterlyPrice: string) => {
    const monthly = parseFloat(monthlyPrice.replace(/[^0-9.]/g, ""));
    const quarterly = parseFloat(quarterlyPrice.replace(/[^0-9.]/g, ""));
    const monthlyCost = monthly * 3;
    const savings = (((monthlyCost - quarterly) / monthlyCost) * 100).toFixed(
      0,
    );
    return savings;
  };

  const monthlyPlan = plans.find((p) => p.identifier.includes("monthly"));

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Pricing Plans */}
        <View style={styles.plansContainer}>
          <Text style={styles.plansSectionTitle} allowFontScaling={false}>
            Choose Your Plan
          </Text>

          {plans.map((plan, index) => {
            const isMonthly = plan.identifier.includes("monthly");
            const isSelected = selectedPlan === plan.identifier;
            const isRecommended = !isMonthly;

            return (
              <Pressable
                key={plan.identifier}
                style={[styles.planCard, isSelected && styles.planCardSelected]}
                onPress={() => setSelectedPlan(plan.identifier)}
              >
                <View style={styles.planHeader}>
                  <Text style={styles.planTitle} allowFontScaling={false}>
                    {isMonthly ? "Monthly" : "Weekly"} VIP
                  </Text>
                  <Text style={styles.planPrice} allowFontScaling={false}>
                    {plan.product.priceString}
                  </Text>
                </View>

                <Text style={styles.planBilling} allowFontScaling={false}>
                  {isMonthly ? "Billed monthly" : "Billed every week"}
                </Text>

                {/* {!isMonthly && monthlyPlan && (
                  <View style={styles.savingsContainer}>
                    <Text style={styles.savingsText} allowFontScaling={false}>
                      Save{" "}
                      {calculateSavings(
                        monthlyPlan.product.priceString,
                        plan.product.priceString
                      )}
                      % vs monthly
                    </Text>
                  </View>
                )} */}
              </Pressable>
            );
          })}
        </View>

        {/* Purchase Button */}
        <Pressable
          style={[
            styles.purchaseButton,
            !selectedPlan && styles.purchaseButtonDisabled,
          ]}
          onPress={handlePurchase}
          disabled={!selectedPlan}
        >
          <Text style={styles.purchaseButtonText} allowFontScaling={false}>
            Start Your VIP Access
          </Text>
        </Pressable>

        {/* Trial Info */}
        <Text style={styles.trialInfo} allowFontScaling={false}>
          Start your premium journey today
        </Text>

        {/* Footer Info */}
        <View style={styles.footerInfo}>
          <Text style={styles.footerText} allowFontScaling={false}>
            App subscriptions will renew automatically. You can turn this off
            any time. {"\n"}
            If you cancel your subscription, you can still use the subscription
            until the current billing period ends. {"\n\n"}
            If you have any questions or need help, please contact us at:{" "}
          </Text>
          <Text style={styles.supportText} allowFontScaling={false}>
            Need help? Contact us at:{" "}
            <Text style={styles.emailText} selectable dataDetectorType="email">
              info@supremescores.com
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default UpgradePlan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkblack,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: whitecolor,
    textAlign: "center",
    marginBottom: 8,
    textTransform: "capitalize",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#B0B0B0",
    textAlign: "center",
    lineHeight: 22,
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
    paddingHorizontal: 10,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: whitecolor,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    fontWeight: "400",
    color: "#B0B0B0",
    lineHeight: 18,
  },
  plansContainer: {
    paddingHorizontal: 20,
    marginVertical: 30,
  },
  plansSectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: whitecolor,
    textAlign: "center",
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  planCardSelected: {
    borderColor: lightGreen,
    backgroundColor: "#0F2A1A",
  },
  planCardRecommended: {
    borderColor: darkGreen,
  },
  recommendedBadge: {
    position: "absolute",
    top: -8,
    right: 20,
    backgroundColor: darkGreen,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    fontSize: 11,
    fontWeight: "700",
    color: whitecolor,
    letterSpacing: 0.5,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: whitecolor,
  },
  planPrice: {
    fontSize: 22,
    fontWeight: "800",
    color: lightGreen,
  },
  planBilling: {
    fontSize: 14,
    fontWeight: "500",
    color: "#B0B0B0",
    marginBottom: 8,
  },
  savingsContainer: {
    backgroundColor: darkGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: "600",
    color: whitecolor,
  },
  selectionIndicator: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#666",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    borderColor: lightGreen,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: lightGreen,
  },
  purchaseButton: {
    backgroundColor: darkGreen,
    marginHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: darkGreen,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  purchaseButtonDisabled: {
    backgroundColor: "#333",
    shadowOpacity: 0,
  },
  purchaseButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: whitecolor,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  trialInfo: {
    fontSize: 14,
    fontWeight: "500",
    color: "#B0B0B0",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 30,
  },
  footerInfo: {
    paddingHorizontal: 20,
    gap: 15,
  },
  footerText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#808080",
    lineHeight: 16,
    textAlign: "center",
  },
  supportText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#B0B0B0",
    textAlign: "center",
    lineHeight: 18,
  },
  emailText: {
    fontWeight: "600",
    color: lightGreen,
  },
});
