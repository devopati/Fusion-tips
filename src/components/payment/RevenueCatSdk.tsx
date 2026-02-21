import useRevenueCatSDKHook from "@/src/screens/hooks/useRevenueCatSDKHook";
import { useEffect } from "react";
import { Platform } from "react-native";
import Purchases from "react-native-purchases";

const RevenueCatSdk = () => {
  /**
   *  Initialize the RevenueCat SDK
   *  @returns {void}
   */
  const setupRevenueCatAsync = async () => {
    try {
      //configure the sdk
      Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

      // if (Platform.OS === "ios") {
      //   await Purchases.configure({
      //     apiKey: "",
      //   });
      // } else
      if (Platform.OS === "android") {
        await Purchases.configure({
          apiKey: "goog_TmwKQRsYFlBPVovWMyMgdoCxaRx",
        });
      }

      // get subscription status | customer info
      const customerInfo = await Purchases.getCustomerInfo();
      console.log(customerInfo.activeSubscriptions); //check for the users active subscriptions
    } catch (error) {
      console.log(error);
    }
  };

  const { getCurrentCustomerActiveSubs, getAvailableSubscriptionPlans } =
    useRevenueCatSDKHook();

  useEffect(() => {
    setupRevenueCatAsync();
    getAvailableSubscriptionPlans();
    getCurrentCustomerActiveSubs();
  }, []);

  return null;
};

export default RevenueCatSdk;
