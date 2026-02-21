import { useEffect, useState } from "react";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { OddsType } from "@/src/types/types";
import { ToastAndroid } from "react-native";
import {
  FreeTipsConstants,
  SubscriptionsConstants,
} from "@/src/constants/subscriptions";
import { sendPushNotification } from "@/src/components/containers/NotificationContainer";

/**
 * This is a custom hook that handles all firebase docs/odds operations
 * @returns functions,  states and state updaters to handle and manipulate docs/odds
 */
const useFirebaseFirestore = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [oddsData, setOddsData] = useState<OddsType[]>([]);
  const [freeOdds, setFreeOdds] = useState<OddsType[]>([]);
  const [adminVipOdds, setAdminVipOdds] = useState<OddsType[]>([]);
  const [adminFreeOdds, setAdminFreeOdds] = useState<OddsType[]>([]);

  const [historyOddsData, setHistoryOddsData] = useState<OddsType[]>([]);
  const [success, setSuccess] = useState<boolean>(false);

  const vipOddTypes = [
    `vip-${SubscriptionsConstants.CORRECT_SCORE}`,
    `vip-${SubscriptionsConstants.ELITE_VIP}`,
    `vip-${SubscriptionsConstants.ELITE_VIP_JACKPOT}`,
    `vip-${SubscriptionsConstants.DAILY_ODDS}`,
    `vip-${SubscriptionsConstants.HT_FT}`,
    `vip-${SubscriptionsConstants.FIFTY_PLUS_DAILY_ODDS}`,
  ];
  const freeOddTypes = [
    `free-${FreeTipsConstants.TICKET_OF_THE_DAY}`,
    `free-${FreeTipsConstants.BASKET_BALL_TIPS}`,
    `free-${FreeTipsConstants.TENNIS_TIPS}`,
    `free-${FreeTipsConstants.OVER_UNDER}`,
    `free-${FreeTipsConstants.POSTED_CORRECT_SCORES}`,
    `free-${FreeTipsConstants.POSTED_HT_FT}`,
  ];

  /**
   * This function is used to create a doc/odd
   * @param data data object of the document/odd to be created
   */
  const createOddHandler = async (data: OddsType) => {
    setSuccess(false);
    setLoading(true);
    try {
      await firestore().collection("Odds").add(data);

      // added
      const allTokens = await fetchAllNotificationTokens(
        data.odd_type.includes("vip") ? true : false
      );
      const tokens = allTokens.map((token) => token.token);
      //notification for a new odd whenever it is added
      await sendPushNotification({
        title: `${data.team1_name} VS ${data.team2_name}  Odds Just Dropped!`,
        body: "Your next big win could be here. Check out the latest odds now!",
        tokens,
      });

      setSuccess(true);
      ToastAndroid.show("Odd Added", ToastAndroid.SHORT);
      getAdminOddsHandler(
        data.odd_type.includes("free") ? false : true,
        data.odd_type
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   *  This function is used to get all odds data and sort by the date created
   * @param odd_type recieves the type of odd to be get
   */
  const getOddsHandler = async (odd_type = "free") => {
    try {
      setLoading(true);
      const snapshot = await firestore()
        .collection("Odds")
        .where("odd_type", "==", odd_type) // Filter by odd_type
        .where("status", "in", ["pending", "active"])
        .orderBy("posted_at", "desc")
        .get();
      const oddsArray: OddsType[] = snapshot.docs.map((doc) => {
        const data = doc.data() as OddsType;
        return { isHistory: false, ...data, id: doc.id }; // Include the document ID id: doc.id,
      });
      if (odd_type.includes("free")) {
        setFreeOdds(oddsArray);
      } else setOddsData(oddsArray);
      // return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.log(error);
      return []; // Ensure it always returns an array
    } finally {
      setLoading(false);
    }
  };

  const getAdminOddsHandler = async (isVip: boolean, type?: string) => {
    try {
      setLoading(true);
      const snapshot = await firestore()
        .collection("Odds")
        .where("status", "in", ["pending", "active"])
        .where(
          "odd_type",
          "in",
          type ? [type] : isVip ? vipOddTypes : freeOddTypes
        )
        .orderBy("posted_at", "desc")
        .get();
      const oddsArray: OddsType[] = snapshot.docs.map((doc) => {
        const data = doc.data() as OddsType; // Ensure TypeScript recognizes it
        return { isHistory: false, ...data, id: doc.id }; // Include the document ID id: doc.id,
      });

      isVip ? setAdminVipOdds(oddsArray) : setAdminFreeOdds(oddsArray);
    } catch (error) {
      console.log(error);
      return []; // Ensure it always returns an array
    } finally {
      setLoading(false);
    }
  };

  /**
   *  This function is used to get all odds data and sort by the date created
   * @param odd_type recieves the type of odd to be get
   */
  const getOddsHistoryHandler = async (odd_type?: string) => {
    try {
      setLoading(true);
      const snapshot = await firestore()
        .collection("Odds")
        .where(
          "odd_type",
          "in",
          odd_type ? [odd_type] : freeOddTypes.concat(vipOddTypes)
        )
        .where("status", "in", ["canceled", "closed"])
        .orderBy("posted_at", "desc")
        .get();
      const oddsArray: OddsType[] = snapshot.docs.map((doc) => {
        const data = doc.data() as OddsType;
        return { isHistory: true, ...data, id: doc.id }; // Include the document ID id: doc.id,
      });
      setHistoryOddsData(oddsArray);
    } catch (error) {
      console.log(error);
      return []; // Ensure it always returns an array
    } finally {
      setLoading(false);
    }
  };

  /**
   * This function is used to update doc/odd data
   * @param data document/odd data to be updated with an id
   */
  const updateOddHandler = async (data: OddsType) => {
    try {
      setSuccess(false);
      setLoading(true);
      const docRef = await firestore().collection("Odds").doc(data.id);
      await docRef.update(data);
      setSuccess(true);
      ToastAndroid.show("Odd Updated", ToastAndroid.SHORT);
      getAdminOddsHandler(data.odd_type.includes("free") ? false : true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * This function is used to delete a doc/odd
   * @param id document/odd id to be deleted
   */
  const deleteOddHandler = async (id: string) => {
    try {
      setLoading(true);
      const docRef = firestore().collection("Odds").doc(id);
      await docRef.delete();
      ToastAndroid.show("Odd Deleted, Reload", ToastAndroid.SHORT);
      getAdminOddsHandler(true);
      getAdminOddsHandler(false);
      getOddsHistoryHandler();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * This function is used to update the expo notification token
   * @param token expo notification token to be updated
   * @param isVip boolean to check if the user is a vip
   * @returns void
   * @description this function is used to update the expo notification token
   * in the firestore database
   */
  const updateExpoNotificationToken = async (data: {
    token: string;
    isVip: boolean;
  }) => {
    try {
      const docRef = firestore()
        .collection("notification-tokens")
        .doc(data.token);

      const docSnap = await docRef.get();

      if (docSnap.exists) {
        await docRef.update(data);
      } else {
        await docRef.set(data); // set with custom ID (token)
      }
    } catch (error) {
      console.log("Failed to update notification token:", error);
    }
  };

  type NotificationToken = {
    token: string;
    isVip: boolean;
  };
  /**
   * This function is used to fetch all notification tokens from the firestore
   * @param isVip boolean to check if the notification is for vip users
   * @returns array of notification tokens
   */
  const fetchAllNotificationTokens = async (
    isVip?: boolean
  ): Promise<NotificationToken[]> => {
    const allTokens: NotificationToken[] = [];
    const batchSize = 1000;

    let lastDoc: FirebaseFirestoreTypes.DocumentSnapshot | null = null;
    let hasMore = true;

    while (hasMore) {
      let query = firestore()
        .collection("notification-tokens")
        .where("isVip", "in", isVip ? [isVip] : [true, false])
        // .orderBy("__name__")
        .limit(batchSize);

      if (lastDoc) {
        query = query.startAfter(lastDoc);
      }

      const snapshot = await query.get();

      snapshot.forEach((doc) => {
        allTokens.push({
          ...doc.data(),
          token: doc.id,
        } as NotificationToken);
      });

      if (snapshot.size < batchSize) {
        hasMore = false;
      } else {
        lastDoc = snapshot.docs[snapshot.docs.length - 1];
      }
    }

    return allTokens;
  };

  return {
    createOddHandler,
    getOddsHandler,
    loading,
    setLoading,
    updateOddHandler,
    deleteOddHandler,
    oddsData,
    setSuccess,
    success,
    freeOdds,
    getOddsHistoryHandler,
    historyOddsData,
    adminVipOdds,
    getAdminOddsHandler,
    adminFreeOdds,
    updateExpoNotificationToken,
    fetchAllNotificationTokens,
  };
};

export default useFirebaseFirestore;
