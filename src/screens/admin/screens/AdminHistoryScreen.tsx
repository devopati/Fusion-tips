import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { darkblack, PrimaryColor, whitecolor } from "@/src/constants/Colors";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import OddHistoryContainer from "@/src/components/containers/OddHistoryContainer";
import useFirebaseFirestore from "../../hooks/useFirebaseFirestore";
import NoOdds from "@/src/components/containers/NoOdds";
import { OddsType } from "@/src/types/types";
import DeleteModal from "@/src/components/modals/DeleteModal";
import AdminBottomSheet from "@/src/components/modals/AdminBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const AdminHistoryScreen = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { loading, historyOddsData, getOddsHistoryHandler } =
    useFirebaseFirestore();

  const [deleteActive, setDeleteActive] = useState<boolean>(false);
  const [currOdd, setCurrOdd] = useState<OddsType | null>(null);

  const handleDelete = (odd: OddsType) => {
    setDeleteActive(true);
    setCurrOdd(odd);
  };

  const presentModal = (data: OddsType) => {
    bottomSheetModalRef.current?.present();
    setCurrOdd(data);
  };

  useEffect(() => {
    getOddsHistoryHandler();
  }, []);

  if (historyOddsData.length === 0) {
    return <NoOdds />;
  }

  return (
    <View style={styles.container}>
      <AdminBottomSheet
        data={currOdd}
        bottomSheetModalRef={bottomSheetModalRef}
        setDeleteVisible={setDeleteActive}
      />
      <DeleteModal
        data={currOdd}
        visible={deleteActive}
        setVisible={setDeleteActive}
      />
      {/* <DeleteModal
        visible={deleteActive}
        setVisible={setDeleteActive}
        data={currOdd}
        refresh={getOddsHistoryHandler}
      /> */}
      <View style={styles.detailview}>
        <Text allowFontScaling={false} style={styles.text}>
          Odds History
        </Text>
      </View>
      <FlatList
        data={historyOddsData}
        renderItem={({ item }) => (
          <OddHistoryContainer
            onPress={() => presentModal(item)}
            //  onPress={() => handleDelete(item)}
            data={item}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatlist}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={getOddsHistoryHandler}
          />
        }
      />
    </View>
  );
};

export default AdminHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 1,
    backgroundColor: darkblack,
    paddingTop: 10,
  },
  detailview: {
    backgroundColor: PrimaryColor,
    marginVertical: 20,
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: whitecolor,
    fontWeight: "bold",
  },
  flatlist: {
    gap: 10,
    paddingBottom: 100,
  },
});
