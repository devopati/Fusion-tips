import { lightRed, PrimaryColor, whitecolor } from "@/src/constants/Colors";
import * as React from "react";
import {
  Dimensions,
  StyleSheet,
  ToastAndroid,
  View,
  Modal,
  Text,
} from "react-native";
import PrimaryButton from "../button/PrimaryButton";
import { OddsType } from "@/src/types/types";
import useFirebaseFirestore from "@/src/screens/hooks/useFirebaseFirestore";

interface DeleteModalProps {
  visible: boolean;
  setVisible: (arg: boolean) => void;
  data?: OddsType | null;
  refresh?: () => void;
}

const DeleteModal = ({
  visible,
  setVisible,
  data,
  refresh,
}: DeleteModalProps) => {
  const hideModal = () => {
    setVisible(false);
    ToastAndroid.show("Action Canceled", ToastAndroid.SHORT);
  };

  const { deleteOddHandler, loading } = useFirebaseFirestore();

  return (
    <Modal
      visible={visible}
      onRequestClose={hideModal}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.innercontainer}>
          <Text style={styles.title}>Delete this Odd</Text>
          <Text allowFontScaling={false} style={styles.text}>
            Are you sure you want to delete this odd?
          </Text>
          <Text allowFontScaling={false} style={styles.text}>
            Note: This action cannot be undone.
          </Text>

          <View style={styles.btns}>
            <PrimaryButton title="Cancel" onPress={hideModal} />
            <PrimaryButton
              title={loading ? "Deleting..." : "Delete"}
              onPress={async () => {
                deleteOddHandler(data?.id ?? "");
                setVisible(false);
                refresh && refresh();
              }}
              buttonColor={lightRed}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;

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
    gap: 10,
  },
  text: {
    color: whitecolor,
    fontSize: 15,
    lineHeight: 24,
  },
  btns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginLeft: 70,
  },
});
