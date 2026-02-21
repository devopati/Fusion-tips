import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useState } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
  darkblack,
  lightGreen,
  lightRed,
  PrimaryColor,
  whitecolor,
  yellowColor,
} from "@/src/constants/Colors";
import PrimaryButton from "../button/PrimaryButton";
import { NavigationPropType, OddsType } from "@/src/types/types";
import useFirebaseFirestore from "@/src/screens/hooks/useFirebaseFirestore";
import { useNavigation } from "@react-navigation/native";
import { AdminScreenNames } from "@/src/constants/screen-names";
import { TextInput } from "react-native-paper";

interface AdminBottomSheetProp {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  setDeleteVisible: (arg: boolean) => void;
  data: OddsType | null;
  refresh?: () => void;
}

const AdminBottomSheet = ({
  bottomSheetModalRef,
  setDeleteVisible,
  data,
  refresh,
}: AdminBottomSheetProp) => {
  const navigation = useNavigation<NavigationPropType>();

  const { loading, updateOddHandler } = useFirebaseFirestore();
  const [t1Score, setT1Score] = useState<string>("");
  const [t2Score, setT2Score] = useState<string>("");

  const updateOddStatusHandler = async (
    status: string = "won",
    tip?: string,
  ) => {
    if (data) {
      if (tip) {
        if (tip === "tip1") {
          data["tip1_status"] = status;
          // if (data.tip2_status)
          data["status"] = "closed";
        }
      } else {
        data["tip1_status"] = status;
        data["tip2_status"] = status;
        data["status"] = status;
      }
      data["team1_score"] = t1Score;
      data["team2_score"] = t2Score;

      await updateOddHandler(data);
    }
    bottomSheetModalRef.current?.close();
    refresh && refresh();
  };
  // callbacks
  const onDeletePress = () => {
    setDeleteVisible(true);
    bottomSheetModalRef.current?.close();
    refresh && refresh();
  };

  const onEditPress = () => {
    bottomSheetModalRef.current?.close();
    navigation.navigate(AdminScreenNames.EDIT_ODD, { odd: data });
    refresh && refresh();
  };
  const handleSheetChanges = useCallback((index: number) => {
    // console.log("handleSheetChanges", index);
  }, []);

  return (
    <View style={styles.container}>
      <BottomSheetModal
        snapPoints={["45%", "45%"]}
        index={1}
        enableDismissOnClose
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            onPress={() => {
              bottomSheetModalRef.current?.close();
            }}
          />
        )}
        backgroundStyle={{ backgroundColor: darkblack }}
        handleIndicatorStyle={{ backgroundColor: yellowColor }}
      >
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingBottom: 20,
            paddingHorizontal: 5,
            gap: 20,
            marginTop: 10,
          }}
        >
          <View style={styles.contentContainer}>
            <Text allowFontScaling={false} style={styles.title}>
              Tip 1 Actions:
            </Text>

            <View style={styles.scores}>
              <View>
                <TextInput
                  mode="outlined"
                  outlineStyle={styles.inputoutline}
                  style={styles.input}
                  placeholder="Team 1 Score"
                  // placeholderTextColor={"#D9D9D9"}
                  contentStyle={{ color: whitecolor, fontWeight: "bold" }}
                  autoCapitalize="sentences"
                  value={t1Score}
                  onChangeText={(text) => setT1Score(text)}
                />
              </View>
              <Text style={styles.title}>:</Text>
              <View>
                <TextInput
                  mode="outlined"
                  outlineStyle={styles.inputoutline}
                  style={styles.input}
                  placeholder="Team 2 Score"
                  // placeholderTextColor={"#D9D9D9"}
                  contentStyle={{ color: whitecolor, fontWeight: "bold" }}
                  autoCapitalize="sentences"
                  value={t2Score}
                  onChangeText={(text) => setT2Score(text)}
                />
              </View>
            </View>
            <View style={styles.btns}>
              <PrimaryButton
                btnStyle={styles.btn}
                title="Won"
                buttonColor={lightGreen}
                onPress={() => updateOddStatusHandler("won", "tip1")}
              />
              <PrimaryButton
                btnStyle={styles.btn}
                title="Canceled"
                buttonColor={yellowColor}
                onPress={() => updateOddStatusHandler("canceled")}
              />
              <PrimaryButton
                btnStyle={styles.btn}
                title="Lost"
                buttonColor={lightRed}
                onPress={() => updateOddStatusHandler("lost", "tip1")}
              />
            </View>
          </View>

          <View style={{ gap: 20, marginHorizontal: 0 }}>
            <PrimaryButton
              onPress={onEditPress}
              title="Edit Odd"
              buttonColor={yellowColor}
            />
            <PrimaryButton
              onPress={onDeletePress}
              title="Delete"
              buttonColor={lightRed}
            />
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
};

export default AdminBottomSheet;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "grey",
  },
  scores: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentContainer: {
    borderWidth: 0.8,
    borderColor: yellowColor,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 20,
  },
  title: {
    color: whitecolor,
    fontSize: 17,
    fontWeight: "bold",
  },
  btns: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  btn: {
    width: Dimensions.get("window").width / 3.6,
  },
  inputoutline: {
    borderWidth: 0.7,
    borderRadius: 7,
    borderColor: "#D9D9D9",
  },
  input: {
    color: darkblack,
    width: 140,
    fontWeight: "bold",
  },
});
