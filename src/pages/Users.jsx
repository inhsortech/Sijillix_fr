
import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Tag,
  Space,
  message,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import api from "../api/api";

export default function Users() {
  const currentUser = useSelector((state) => state.auth.user);
  const isSuperAdmin = currentUser?.role === "super_admin";

  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [form] = Form.useForm();

  // LOAD USERS
  const loadUsers = async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/users");
      setUsers(data.users || []);
    } catch (error) {
      message.error(
        error.response?.data?.message || "Unable to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  // LOAD ORGANIZATIONS
  const loadOrganizations = async () => {
    try {
      const { data } = await api.get("/organizations");

      setOrganizations(
        (data.organizations || []).filter((org) => org.active)
      );
    } catch (error) {
      message.error(
        error.response?.data?.message || "Unable to load organizations"
      );
    }
  };

  useEffect(() => {
    loadUsers();

    if (isSuperAdmin) {
      loadOrganizations();
    }
  }, [isSuperAdmin]);

  // OPEN CREATE MODAL
  const openCreateModal = () => {
    setEditingUser(null);
    form.resetFields();

    form.setFieldsValue({
      role: "viewer",
      active: true,
    });

    setOpen(true);
  };

  // OPEN EDIT MODAL
  const openEditModal = (record) => {
    setEditingUser(record);

    form.resetFields();

    form.setFieldsValue({
      name: record.name,
      email: record.email,
      role: record.role,
      active: record.active,
      organizationId: record.organizationId || undefined,
      password: "",
    });

    setOpen(true);
  };

  // CLOSE MODAL
  const closeModal = () => {
    setOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  // CREATE OR UPDATE USER
  const saveUser = async (values) => {
    setSaving(true);

    try {
      const payload = { ...values };

      // Don't send empty password during editing
      if (!payload.password) {
        delete payload.password;
      }

      if (editingUser) {
        await api.patch(`/users/${editingUser._id}`, payload);
        message.success("User updated successfully");
      } else {
        await api.post("/users", payload);
        message.success("User created successfully");
      }

      closeModal();
      await loadUsers();
    } catch (error) {
      message.error(
        error.response?.data?.message || "Unable to save user"
      );
    } finally {
      setSaving(false);
    }
  };

  // QUICK UPDATE ROLE / STATUS
  const updateUser = async (record, values) => {
    try {
      await api.patch(`/users/${record._id}`, values);

      message.success("User updated successfully");
      await loadUsers();
    } catch (error) {
      message.error(
        error.response?.data?.message || "Update failed"
      );
    }
  };

  // TABLE COLUMNS
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    ...(isSuperAdmin
      ? [
          {
            title: "Organization",
            dataIndex: "organizationName",
            render: (name) => name || "No organization",
          },
        ]
      : []),
    {
      title: "Role",
      dataIndex: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "blue" : "default"}>
          {role.replace("_", " ").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Active",
      dataIndex: "active",
      render: (active, record) => (
        <Switch
          checked={active}
          disabled={record.role === "super_admin"}
          onChange={(value) =>
            updateUser(record, { active: value })
          }
        />
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            disabled={record.role === "super_admin"}
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="User Management"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
        >
          Add User
        </Button>
      }
    >
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
      />

      <Modal
        title={editingUser ? "Edit User" : "Create User"}
        open={open}
        onCancel={closeModal}
        onOk={() => form.submit()}
        confirmLoading={saving}
        destroyOnHidden
        width={550}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={saveUser}
        >
          {/* ORGANIZATION */}
          {isSuperAdmin && (
            <Form.Item
              name="organizationId"
              label="Select Organization"
              rules={[
                {
                  required: true,
                  message: "Please select an organization",
                },
              ]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="Choose organization"
                options={organizations.map((org) => ({
                  value: org._id,
                  label: `${org.name} (${org.code})`,
                }))}
              />
            </Form.Item>
          )}

          {/* NAME */}
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: "Name is required" },
            ]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          {/* EMAIL */}
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter valid email" },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          {/* PASSWORD */}
          <Form.Item
            name="password"
            label={
              editingUser
                ? "New Password (Leave blank to keep current)"
                : "Temporary Password"
            }
            rules={
              editingUser
                ? [
                    {
                      min: 8,
                      message: "Minimum 8 characters",
                    },
                  ]
                : [
                    {
                      required: true,
                      message: "Password is required",
                    },
                    {
                      min: 8,
                      message: "Minimum 8 characters",
                    },
                  ]
            }
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          {/* ROLE */}
          <Form.Item
            name="role"
            label="Role"
            rules={[
              { required: true, message: "Please select role" },
            ]}
          >
            <Select
              options={[
                { value: "admin", label: "Organization Admin" },
                { value: "manager", label: "Manager" },
                { value: "viewer", label: "Viewer" },
              ]}
            />
          </Form.Item>

          {/* STATUS */}
          {editingUser && (
            <Form.Item
              name="active"
              label="Account Status"
              valuePropName="checked"
            >
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </Card>
  );
}
