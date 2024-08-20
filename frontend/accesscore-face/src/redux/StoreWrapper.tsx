"use client";

import { Provider } from "react-redux";
import { store } from "./store";

interface StoreWrapperProps {
  children: React.ReactNode
}

export function StoreWrapper({ children }: StoreWrapperProps) {
  return <Provider store={store}>{children}</Provider>
}