import axios from "axios";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { IUser } from "../types";

interface State {
  authenticated: boolean;
  user: IUser | undefined;
  loading: boolean;
}

const StateContext = createContext<State>({
  authenticated: false,
  user: null,
  loading: true,
});
const DispatchContext = createContext(null);

interface Action {
  type: string;
  payload?: any;
}

const reducer = (state: State, { type, payload }: Action): State => {
  switch (type) {
    case "LOGIN":
      return { ...state, authenticated: true, user: payload };
    case "LOGOUT":
      return { ...state, authenticated: false, user: null };
    case "STOP_LOADING":
      return { ...state, loading: false };
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};

export const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer<typeof reducer, State>(
    reducer,
    {
      authenticated: false,
      user: null,
      loading: true,
    },
    undefined
  );

  useEffect(() => {
    axios
      .get("/auth/me")
      .then((res) => {
        dispatch({ type: "LOGIN", payload: res.data });
      })
      .catch(() => {})
      .finally(() => {
        dispatch({ type: "STOP_LOADING" });
      });
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
