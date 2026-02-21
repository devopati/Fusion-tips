import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Provider } from "react-redux";
import { persistor, Store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import MainNavigation from "./src/navigation/MainNavigation";
import { PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import auth from "@react-native-firebase/auth";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import NotificationContainer from "./src/components/containers/NotificationContainer";

SystemUI.setBackgroundColorAsync("black");

const App = () => {
  useEffect(() => {
    // anonymously sign in the user
    auth()
      .signInAnonymously()
      .then((data) => {
        SecureStore.setItemAsync("user_id", data?.user.uid);
      })
      .catch((error) => {
        if (error.code === "auth/operation-not-allowed") {
          console.log("Enable anonymous in your firebase console.");
        }

        console.error(error);
      });

    auth().onAuthStateChanged((data) => {
      if (data) {
        SecureStore.setItemAsync("user_id", data.uid);
      }
      // console.log(data?.uid);
    });
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <PaperProvider>
        <NavigationContainer>
          <Provider store={Store}>
            <BottomSheetModalProvider>
              <PersistGate persistor={persistor} loading={null} />
              {/* <RevenueCatSdk /> */}
              <NotificationContainer />
              <MainNavigation />
            </BottomSheetModalProvider>
          </Provider>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({});
