import { StyleSheet, View } from "react-native";
import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import OddContainer from "@/src/components/containers/OddContainer";
import { darkblack } from "@/src/constants/Colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AdminBottomSheet from "@/src/components/modals/AdminBottomSheet";
import DeleteModal from "@/src/components/modals/DeleteModal";
import useFirebaseFirestore from "../../hooks/useFirebaseFirestore";
import OddHistoryContainer from "@/src/components/containers/OddHistoryContainer";
import { NavigationPropType, OddsType } from "@/src/types/types";
import NoOdds from "@/src/components/containers/NoOdds";
import { useNavigation } from "@react-navigation/native";

const AdminVipOdds = ({
  route,
}: {
  route: { params: { type: string; title: string } };
}) => {
  const navigation = useNavigation<NavigationPropType>();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);

  const [currOdd, setCurrOdd] = useState<OddsType | null>(null);

  const presentModal = (data: OddsType) => {
    bottomSheetModalRef.current?.present();
    setCurrOdd(data);
  };

  const {
    loading,
    setLoading,
    getAdminOddsHandler,
    adminVipOdds: oddsData,
  } = useFirebaseFirestore();

  useEffect(() => {
    getAdminOddsHandler(true, `vip-${route.params.type}`);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.title,
    });
  });

  if (oddsData.length === 0) {
    return <NoOdds />;
  }
  return (
    <View style={styles.container}>
      <AdminBottomSheet
        data={currOdd}
        bottomSheetModalRef={bottomSheetModalRef}
        setDeleteVisible={setDeleteVisible}
        refresh={() => getAdminOddsHandler(true, `vip-${route.params.type}`)}
      />
      <DeleteModal
        data={currOdd}
        visible={deleteVisible}
        setVisible={setDeleteVisible}
      />
      <FlatList
        data={oddsData}
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
          <RefreshControl
            refreshing={loading}
            onRefresh={() =>
              getAdminOddsHandler(true, `vip-${route.params.type}`)
            }
          />
        }
      />
    </View>
  );
};

export default memo(AdminVipOdds);

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
