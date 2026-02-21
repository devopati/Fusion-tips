import { darkGreen, PrimaryColor, whitecolor } from "@/src/constants/Colors";
import * as React from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  ToastAndroid,
  View,
  Modal,
  Text,
  TextInput,
} from "react-native";
import PrimaryButton from "../button/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { NavigationPropType } from "@/src/types/types";
import { AdminScreenNames } from "@/src/constants/screen-names";
import auth from "@react-native-firebase/auth";
import * as SecureStore from "expo-secure-store";

interface AdminLoginModalProps {
  visible: boolean;
  setVisible: (arg: boolean) => void;
}

const AdminLoginModal = ({ visible, setVisible }: AdminLoginModalProps) => {
  const navigation = useNavigation<NavigationPropType>();

  const hideModal = () => setVisible(false);

  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const submitHandler = async () => {
    try {
      if (!username || !password) {
        ToastAndroid.show("Please fill all fields", ToastAndroid.SHORT);
        Alert.alert("Error", "Please fill all fields");
        return;
      }
      setLoading(true);
      const user = await auth().signInWithEmailAndPassword(username, password);
      SecureStore.setItem("admin-id", user.user.uid);

      navigation.navigate(AdminScreenNames.ADMIN);
      ToastAndroid.show("Login Success", ToastAndroid.SHORT);
      setVisible(false);
    } catch (error: any) {
      ToastAndroid.show("Failed to login", ToastAndroid.SHORT);
      console.log(error);
      if (error.code === "auth/email-already-in-use") {
        console.log("That email address is already in use!");
      }
      if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "That email address is invalid!");
        console.log("That email address is invalid!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={hideModal}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.innercontainer}>
          <Text style={styles.title}>Enter Credentials</Text>

          <View>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#D9D9D9"
              autoCapitalize="sentences"
              value={username}
              onChangeText={(text) => setUsername(text)}
            />
          </View>

          <View>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#D9D9D9"
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </View>

          <View style={styles.btns}>
            <PrimaryButton title="Cancel" onPress={hideModal} />
            <PrimaryButton
              title={loading ? "Submiting..." : "Submit"}
              btnStyle={{ width: "45%" }}
              buttonColor={darkGreen}
              loading={loading}
              onPress={submitHandler}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AdminLoginModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: whitecolor,
    fontSize: 17,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  innercontainer: {
    backgroundColor: PrimaryColor,
    padding: 20,
    width: Dimensions.get("window").width - 30,
    gap: 20,
  },
  input: {
    backgroundColor: PrimaryColor,
    color: whitecolor,
    fontWeight: "bold",
    borderWidth: 0.7,
    borderRadius: 7,
    borderColor: "#D9D9D9",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  btns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginLeft: 70,
  },
});
