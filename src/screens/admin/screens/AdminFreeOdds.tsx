import { StyleSheet, View } from "react-native";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import OddContainer from "@/src/components/containers/OddContainer";
import { darkblack } from "@/src/constants/Colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AdminBottomSheet from "@/src/components/modals/AdminBottomSheet";
import DeleteModal from "@/src/components/modals/DeleteModal";
import useFirebaseFirestore from "../../hooks/useFirebaseFirestore";
import { NavigationPropType, OddsType } from "@/src/types/types";
import OddHistoryContainer from "@/src/components/containers/OddHistoryContainer";
import NoOdds from "@/src/components/containers/NoOdds";
import { useNavigation } from "@react-navigation/native";

const AdminFreeOdds = ({
  route,
}: {
  route: { params: { type: string; title: string } };
}) => {
  const navigation = useNavigation<NavigationPropType>();
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [currOdd, setCurrOdd] = useState<OddsType | null>(null);

  const presentModal = (data: OddsType) => {
    bottomSheetModalRef.current?.present();
    setCurrOdd(data);
  };

  const {
    loading,
    getAdminOddsHandler,
    adminFreeOdds: freeOdds,
  } = useFirebaseFirestore();

  const getAllData = async () => {
    await getAdminOddsHandler(false, `free-${route.params.type}`);
  };

  useEffect(() => {
    getAllData();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.title,
    });
  }, []);

  if (freeOdds.length === 0) {
    return <NoOdds />;
  }
  return (
    <View style={styles.container}>
      <AdminBottomSheet
        bottomSheetModalRef={bottomSheetModalRef}
        setDeleteVisible={setDeleteVisible}
        data={currOdd}
        refresh={getAllData}
      />
      <DeleteModal
        visible={deleteVisible}
        setVisible={setDeleteVisible}
        data={currOdd}
      />
      <FlatList
        data={freeOdds}
        renderItem={({ item }) => (
          <>
            {item.tip1_status && item.tip2_status ? (
              <OddHistoryContainer
                data={item}
                onPress={() => presentModal(item)}
              />
            ) : (
              <OddContainer data={item} onPress={() => presentModal(item)} />
            )}
          </>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatlist}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getAllData} />
        }
      />
    </View>
  );
};

export default AdminFreeOdds;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 1,
    backgroundColor: darkblack,
    paddingTop: 10,
  },
  flatlist: {
    gap: 10,
    paddingBottom: 100,
  },
});
