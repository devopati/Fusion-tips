import { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import useFirebaseFirestore from "@/src/screens/hooks/useFirebaseFirestore";
import { useAppSelector } from "@/redux/hooks/reduxHooks";
import { chunkArray } from "@/src/utils/chunk-array";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function sendPushNotification(data: {
  title: string;
  body: string;
  tokens: string[];
}) {
  const { title, body, tokens } = data;

  const messages = tokens.map((token) => ({
    to: token,
    sound: "default",
    title,
    body,
    data: { someData: "goes here" },
  }));

  const chunks = chunkArray(messages, 100); // Max 100 per batch
  const results: any[] = [];

  for (const chunk of chunks) {
    try {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chunk),
      });

      const result = await response.json();
      console.log("Expo response:", result);
      results.push(result);
    } catch (error) {
      console.error("Error sending push batch:", error);
      results.push({ error });
    }
  }

  return results; // Optional: return to inspect later
}

function handleRegistrationError(errorMessage: string) {
  //   alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

const NotificationContainer = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.EventSubscription>(null);
  const responseListener = useRef<Notifications.EventSubscription>(null);

  const { updateExpoNotificationToken } = useFirebaseFirestore();
  const { activePlans } = useAppSelector((state) => state.app);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log(token);
        setExpoPushToken(token ?? "");
        updateExpoNotificationToken({
          token: token ?? "",
          isVip: activePlans.length !== 0,
        });
      })
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);
  return null;
};

export default NotificationContainer;
