import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppSlice from "./slices/AppSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: [],
};

interface RootState {
  app: ReturnType<typeof AppSlice>;
}

const rootReducer = combineReducers({
  app: persistReducer(persistConfig, AppSlice),
});

const Store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(Store);

export { Store, persistor };
export type { RootState };
export type AppDispatch = typeof Store.dispatch;
