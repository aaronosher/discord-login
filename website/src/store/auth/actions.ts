import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { FullProfile, Profile } from "../../types/Profile";
import store from "../index";
import { AuthState } from "./reducer";
import { auth, db } from "../../firebase";

export const authError = createAction<string>("auth/error");
export const updateProfile = createAction<Partial<FullProfile>>(
  "auth/updateProfile"
);

export const logoutUser = createAsyncThunk<
  void,
  void,
  { state: { auth: AuthState } }
>("auth/logout", async (_, thunkAPI) => {
  const { snapshotListener } = thunkAPI.getState().auth;
  if (snapshotListener) {
    snapshotListener();
  }
  return;
});

export const loginUser = createAsyncThunk<() => void, Profile>(
  "auth/login",
  async (profile) => {
    try {
      const documentReference = db.doc(`users/${profile.uid}`);
      const unsubscribe = documentReference.onSnapshot((snapshot) => {
        store.dispatch(updateProfile(snapshot.data() as Partial<FullProfile>));
      });
      return unsubscribe;
    } catch (e) {
      throw e;
    }
  }
);

export const loginWithCustomToken = createAsyncThunk(
  "auth/loginWithCustomToken",
  async (token: string) => {
    try {
      console.log("token", token);
      const res = await auth.signInWithCustomToken(token);
      console.log("res", res);
      return;
    } catch (e) {
      if (e.code === "auth/custom-token-mismatch") {
        throw new Error(
          'An authentication error occurred, the server appears to be misconfigured. Please notify the developer, citing error code "auth/custom-token-mismatch".'
        );
      }

      if (e.code === "auth/invalid-custom-token") {
        throw new Error(
          'An authentication error occurred, the server appears to be misconfigured. Please notify the developer, citing error code "auth/invalid-custom-token".'
        );
      }

      console.error(e);

      throw new Error("An unknown authentication error has occurred.");
    }
  }
);