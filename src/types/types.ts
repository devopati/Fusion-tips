import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { NavigationProp } from "@react-navigation/native";

export type NavigationPropType = NavigationProp<
  Record<string, object | undefined>
>;

export interface OddsType {
  id?: string | undefined;
  date_of_play?: string | number;
  expires_at: string | null;
  league_name: string;
  odd_type: string; //"free" | "vip";
  posted_at: string;
  status: string; //"closed" | "canceled";
  tip1_status: string; // | "won" | "lost" | "canceled";
  tip2_status: string; // | "won" | "lost" | "canceled";
  team1_name: string;
  team2_name: string;
  team1_score?: number | string;
  team2_score?: number | string;
  odds?: number | string;
  time_of_play?: string | number;
  tip1: string;
  tip2: string;
  // isHistory: boolean; //generate in mboile
}
