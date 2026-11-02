
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  restoreSession,
  sessionAbsent,
} from "../features/auth/authSlice";
import { Spin } from "antd";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  const initialized = useSelector(
    (state) => state.auth.initialized
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(restoreSession());
    } else {
      dispatch(sessionAbsent());
    }
  }, [dispatch]);

  if (!initialized) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" tip="Restoring session..." />
      </div>
    );
  }

  return children;
};

export default AuthInitializer;
