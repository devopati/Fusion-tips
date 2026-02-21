import { StyleSheet, View, Alert } from "react-native";
import React from "react";
import { darkblack } from "@/src/constants/Colors";
import { ScrollView } from "react-native-gesture-handler";
import SettingsItemContainer from "@/src/components/containers/SettingsItemContainer";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { NavigationPropType } from "@/src/types/types";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

const Settings = () => {
  const navigation = useNavigation<NavigationPropType>();

  const _handlePressButtonAsync = async (isTerms: boolean) => {
    await WebBrowser.openBrowserAsync(
      isTerms
        ? "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
        : "https://www.freeprivacypolicy.com/live/97466a54-bc2b-4dc9-b925-9c7b38b62a20"
    );
  };

  const handleEmailPress = () => {
    const emailUrl = `mailto:tradevibetv@gmail.com`;
    Linking.openURL(emailUrl);
  };
  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollview}>
        {/* <SettingsItemContainer
          icon={<FontAwesome5 name="credit-card" size={20} color="black" />}
          title="Manage Subscriptions"
          onPress={() => alert("You do not have active subscriptions")}
        /> */}

        <SettingsItemContainer
          icon={<Ionicons name="shield-checkmark-outline" size={20} />}
          title="Privacy and Policy"
          onPress={() => _handlePressButtonAsync(false)}
        />

        {/* <SettingsItemContainer
          icon={<MaterialIcons name="speaker-notes" size={20} color="black" />}
          title="Terms of Service"
          onPress={() => _handlePressButtonAsync(true)}
        /> */}

        <SettingsItemContainer
          icon={
            <MaterialIcons name="contact-support" size={20} color="black" />
          }
          title="Contact"
          onPress={handleEmailPress}
        />
      </ScrollView>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkblack,
    padding: 8,
    paddingTop: 18,
  },
  scrollview: {
    gap: 28,
  },
});
