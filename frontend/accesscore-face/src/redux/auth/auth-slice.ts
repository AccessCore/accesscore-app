import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean,
  token: string | null,
  id: number | null,
  username: string,
  email: string
}

const initialState: AuthState = {
  isLoggedIn: !!localStorage.getItem("token"),
  token: localStorage.getItem("token"),
  id: null,
  username: 'Unknown',
  email: 'empty@email.com'
}

function LogIn(state: AuthState, action: PayloadAction<AuthState>) {
  localStorage.setItem("token", action.payload.token as string);
  return { ...action.payload };
}

function LogOut() {
  localStorage.removeItem("token");
  return initialState;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    LogIn,
    LogOut
  }
})

export const { reducer: authReducer, actions } = authSlice;