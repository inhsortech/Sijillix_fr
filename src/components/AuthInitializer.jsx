import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";

import { restoreSession } from "../features/auth/authSlice";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const initialized = useSelector(
    (state) => state.auth.initialized
  );

  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;

    started.current = true;

    if (localStorage.getItem("token")) {
      dispatch(restoreSession());
    } else {
      // No token: initialization is complete.
      dispatch({
        type: "auth/noSession",
      });
    }
  }, [dispatch]);

  if (!initialized) {
    return (
      <div style={{
        height: "100vh",
        display: "grid",
        placeItems: "center",
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return children;
}