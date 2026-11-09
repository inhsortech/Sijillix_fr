
import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  message,
  Space,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Organizations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/organizations");
      setItems(data.organizations || []);
    } catch (error) {
      message.error(
        error.response?.data?.message || "Unable to load organizations"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreateModal = () => {
    setEditingOrganization(null);
    form.resetFields();
    setOpen(true);
  };

  const openEditModal = (record) => {
    setEditingOrganization(record);
    form.setFieldsValue({
      name: record.name,
      code: record.code,
      email: record.email,
      phone: record.phone,
      address: record.address,
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingOrganization(null);
    form.resetFields();
  };

  const saveOrganization = async (values) => {
    setSaving(true);

    try {
      if (editingOrganization) {
        await api.patch(`/organizations/${editingOrganization._id}`, values);
        message.success("Organization updated");
      } else {
        await api.post("/organizations", values);
        message.success("Organization created");
      }

      closeModal();
      await load();
    } catch (error) {
      message.error(
        error.response?.data?.message || "Unable to save organization"
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (record, active) => {
    try {
      await api.patch(`/organizations/${record._id}/status`, { active });
      message.success("Organization updated");
      load();
    } catch (error) {
      message.error(error.response?.data?.message || "Update failed");
    }
  };

  const selectOrganization = (record) => {
    if (!record.active) {
      message.warning("This organization is inactive");
      return;
    }

    localStorage.setItem("selectedOrganizationId", record._id);
    localStorage.setItem("selectedOrganizationName", record.name);

    message.success(`${record.name} selected`);
    navigate("/");
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Code", dataIndex: "code" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Active",
      dataIndex: "active",
      render: (active, record) => (
        <Switch
          checked={active}
          onChange={(value) => toggleStatus(record, value)}
        />
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            disabled={!record.active}
            onClick={() => selectOrganization(record)}
          >
            View Dashboard
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Organizations"
      extra={
        <Button type="primary" onClick={openCreateModal}>
          Add Organization
        </Button>
      }
    > 
      <Table
        rowKey="_id"
        loading={loading}
        dataSource={items}
        columns={columns}
      />

      <Modal
        title={editingOrganization ? "Edit Organization" : "Create Organization"}
        open={open}
        onCancel={closeModal}
        onOk={() => form.submit()}
        confirmLoading={saving}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={saveOrganization}>
          <Form.Item
            name="name"
            label="Organization Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="code"
            label="Organization Code"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
