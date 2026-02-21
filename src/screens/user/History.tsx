import { StyleSheet, View } from "react-native";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import OddHistoryContainer from "@/src/components/containers/OddHistoryContainer";
import { darkblack } from "@/src/constants/Colors";
import useFirebaseFirestore from "../hooks/useFirebaseFirestore";
import { useEffect } from "react";
import { FreeTipsConstants } from "@/src/constants/subscriptions";
import { OddsType } from "@/src/types/types";
import OddContainer from "@/src/components/containers/OddContainer";

const HistoryHeader = ({ odds }: { odds: OddsType[] }) => {
  return (
    <View style={{ gap: 10 }}>
      {odds.slice(0, 3).map((o, i) => {
        return <OddContainer data={o} key={i} hide={true} />;
      })}
    </View>
  );
};

interface HistoryProps {
  route?:
    | {
        params: {
          type: string;
        };
      }
    | undefined;
}

const History = ({ route }: HistoryProps) => {
  const {
    loading,
    historyOddsData,
    getOddsHistoryHandler,
    getOddsHandler,
    freeOdds: oddsData,
  } = useFirebaseFirestore();

  useEffect(() => {
    getOddsHistoryHandler(route?.params?.type);
    // if (
    //   route?.params?.type === `free-${FreeTipsConstants.POSTED_CORRECT_SCORES}`
    // ) {
    //   getOddsHandler(`free-${FreeTipsConstants.POSTED_CORRECT_SCORES}`);
    // } else {
    //   if (route?.params?.type === `free-${FreeTipsConstants.POSTED_HT_FT}`) {
    //     getOddsHandler(`free-${FreeTipsConstants.POSTED_HT_FT}`);
    //   }
    // }
  }, []);

  return (
    <View style={styles.container}>
      {/* <UpgradePlanBanner /> */}
      {/* <SubNotify /> */}
      <FlatList
        data={historyOddsData}
        renderItem={({ item }) => <OddHistoryContainer data={item} />}
        ListHeaderComponent={() => HistoryHeader({ odds: oddsData })}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatlist}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => getOddsHistoryHandler(route?.params?.type)}
          />
        }
      />
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 1,
    backgroundColor: darkblack,
    paddingTop: 10,
    gap: 10,
  },
  flatlist: {
    gap: 10,
    paddingBottom: 100,
    paddingHorizontal: 10,
  },
});
