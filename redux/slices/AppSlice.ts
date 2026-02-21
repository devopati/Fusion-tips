import { createSlice } from "@reduxjs/toolkit";
import { PurchasesPackage } from "react-native-purchases";

interface InitialStateTypes {
  plans: PurchasesPackage[];
  activePlans: string[];
}

const initialState: InitialStateTypes = {
  plans: [],
  activePlans: [],
};

const AppSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAvailablePlans: (state, action) => {
      state.plans = action.payload;
    },
    setActivePlans: (state, action) => {
      state.activePlans = action.payload;
    },
  },
});

export const { setAvailablePlans, setActivePlans } = AppSlice.actions;

export default AppSlice.reducer;
