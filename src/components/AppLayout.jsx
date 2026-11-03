import { Layout, Menu, Button, Typography, Space } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  CheckSquareOutlined,
  UserOutlined,
  ApartmentOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../features/auth/authSlice";
import { hasPermission } from "../utils/permissions";

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: "/",
    label: "Dashboard",
    icon: <DashboardOutlined />,
    permission: "dashboard:read",
  },
  {
    key: "/organizations",
    label: "Organizations",
    icon: <ApartmentOutlined />,
    permission: "organizations:manage",
  },
  {
    key: "/users",
    label: "Users",
    icon: <UserOutlined />,
    permission: "users:read",
  },
  {
    key: "/employees",
    label: "Employees",
    icon: <TeamOutlined />,
    permission: "employees:read",
  },
  {
    key: "/documents",
    label: "Documents",
    icon: <FileTextOutlined />,
    permission: "documents:read",
  },
  {
    key: "/tasks",
    label: "Tasks",
    icon: <CheckSquareOutlined />,
    permission: "tasks:read",
  },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const visibleItems = menuItems
    .filter((item) => hasPermission(user?.role, item.permission))
    .map(({ permission, ...item }) => item);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="light" breakpoint="lg" collapsedWidth="0">
        <div style={{
          padding: 20,
          fontWeight: 700,
          fontSize: 18,
        }}>
          DocuTrack
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={visibleItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header style={{
          background: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 24px",
        }}>
          <Typography.Text strong>
            {user?.name}
          </Typography.Text>

          <Space>
            <Typography.Text type="secondary">
              {user?.role?.replace("_", " ")}
            </Typography.Text>

            <Button
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Space>
        </Header>

        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}