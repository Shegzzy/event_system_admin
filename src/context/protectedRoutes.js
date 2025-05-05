// ProtectedRoute.js
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./authContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Box, CircularProgress } from "@mui/material";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!currentUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "admins", currentUser.uid);
        const docSnap = await getDoc(docRef);
        setIsAdmin(docSnap.exists());
      } catch (error) {
        console.error("Admin check failed:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [currentUser]);

  if (loading)
    return (
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
    );

  return isAdmin ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
