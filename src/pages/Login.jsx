import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Alert,
} from "antd";

import { loginUser } from "../features/auth/authSlice";

const { Title, Text } = Typography;

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async () => {
    try {
      await dispatch(loginUser(credentials)).unwrap();
      navigate("/", { replace: true });
    } catch {
      // Error is displayed from Redux state.
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#f3f5f9",
      padding: 20,
    }}>
      <Card style={{ width: "100%", maxWidth: 420 }}>
        <Title level={2}>DocuTrack Saudi</Title>
        <Text type="secondary">Sign in to your account</Text>

        {error && (
          <Alert
            style={{ marginTop: 20 }}
            type="error"
            message={error}
            showIcon
          />
        )}

        <Form layout="vertical" onFinish={handleLogin} style={{ marginTop: 25 }}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Enter email" }]}
          >
            <Input
              size="large"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  email: e.target.value,
                })
              }
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Enter password" }]}
          >
            <Input.Password
              size="large"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  password: e.target.value,
                })
              }
            />
          </Form.Item>

          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}