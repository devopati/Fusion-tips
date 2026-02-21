import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import OddContainer from "@/src/components/containers/OddContainer";
import useFirebaseFirestore from "../../hooks/useFirebaseFirestore";
import { useEffect } from "react";
import { darkblack, darkGreen } from "@/src/constants/Colors";
import NoOdds from "@/src/components/containers/NoOdds";
import { useNavigation } from "@react-navigation/native";
import { NavigationPropType } from "@/src/types/types";
import { UserScreenNames } from "@/src/constants/screen-names";
import { FreeTipsConstants } from "@/src/constants/subscriptions";
import { SafeAreaView } from "react-native-safe-area-context";

const FreeOddsDisplay = ({
  route,
}: {
  route: { params: { type: string } };
}) => {
  const navigation = useNavigation<NavigationPropType>();

  const {
    loading,
    getOddsHandler,
    freeOdds: oddsData,
  } = useFirebaseFirestore();

  useEffect(() => {
    getOddsHandler(`free-${route.params.type}`);
  }, []);

  // if (oddsData.length === 0) {
  //   return <NoOdds />;
  // }

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={{ backgroundColor: darkblack, flex: 1, paddingVertical: 10 }}
    >
      {oddsData.length === 0 ? (
        <NoOdds />
      ) : (
        <FlatList
          data={oddsData}
          renderItem={({ item }) => <OddContainer data={item} />}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.flatlist}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => getOddsHandler(`free-${route.params.type}`)}
            />
          }
        />
      )}

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(UserScreenNames.HISTORY, {
              type: `free-${route.params.type}`,
            })
          }
          style={styles.bottomBtn}
        >
          <Text style={{ color: "white", fontSize: 15 }}>History</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FreeOddsDisplay;

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
    paddingHorizontal: 10,
  },
  bottomBtn: {
    backgroundColor: darkGreen,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
});
