import { createContext, useEffect, useReducer, useState } from "react";
import AuthReducer from "./authReducer";
import { auth } from "../firebaseConfig";
import { Box, CircularProgress } from "@mui/material";
import { AppProvider } from "@toolpad/core";

const INITIAL_STATE = {
  currentUser: null
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      dispatch({ type: "LOGIN", payload: user });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [state.currentUser]);

  const logout = async () => {
    try {
      await auth.signOut();
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.log(error.message);
    }
  };

  //   if (loading) return <AppProvider branding={{ logo: <CircularProgress /> }} />;

  return (
    <AuthContext.Provider
      value={{ currentUser: state.currentUser, dispatch, logout }}
    >
      {loading ? (
        <Box
          flex={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
          width={"100vw"}
          height={"100vh"}
        >
          <CircularProgress></CircularProgress>
        </Box>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
