"use client";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import Cookies from "universal-cookie";

type Log = {
  cookie: boolean;
  setCookie: Dispatch<SetStateAction<boolean>>;
};

export const Logging = createContext<Log | null>({
  cookie: false,
  setCookie: function (value) {
    this.cookie = !value;
  },
});

const cookies = new Cookies();

export default function Context({ children }: { children: ReactNode }) {
  const data: any = {
    cookie: Boolean(cookies.get("token")),
    setCookie: function (value: boolean) {
      this.cookie = Boolean(cookies.get("token"));
    },
  };
  return <Logging.Provider value={data}>{children}</Logging.Provider>;
}
