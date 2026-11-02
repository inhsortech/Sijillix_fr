
import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  Alert,
} from "antd";

import {
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";

import { loginUser, clearAuthError } from "../features/auth/authSlice";

import {
  Navigate,
  useNavigate,
} from "react-router-dom";

const { Title, Text } = Typography;

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    error,
    isAuthenticated,
  } = useSelector((state) => state.auth);

  const [form] = Form.useForm();

  // Already logged in
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Login submit
  const submit = async (values) => {
    try {
      await dispatch(loginUser(values)).unwrap();

      form.resetFields();

      navigate("/", { replace: true });

    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card">

        <div className="login-logo">
          DT
        </div>

        <Title level={2}>
          DocuTrack Saudi
        </Title>

        <Text type="secondary">
          Sign in to manage documents and compliance.
        </Text>

        {error && (
          <Alert
            style={{ marginTop: 20 }}
            type="error"
            message={error}
            showIcon
            closable
            onClose={() => dispatch(clearAuthError())}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={submit}
          onValuesChange={() => {
            if (error) {
              dispatch(clearAuthError());
            }
          }}
          style={{ marginTop: 28 }}
        >

          {/* EMAIL */}
          <Form.Item
            name="email"
            label="Email address"
            rules={[
              {
                required: true,
                message: "Please enter your email",
              },
              {
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="you@company.com"
              size="large"
              autoComplete="username"
            />
          </Form.Item>

          {/* PASSWORD */}
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>

          {/* LOGIN BUTTON */}
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
          >
            Sign in
          </Button>

        </Form>
      </Card>
    </div>
  );
}
