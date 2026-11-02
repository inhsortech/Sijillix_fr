
import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Typography,
  Alert,
  Input,
  Button,
  Space,
  App,
} from "antd";

import {
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import api from "../api/api";

const { Title, Text } = Typography;

export default function Documents() {
  const { message } = App.useApp();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/documents");

      console.log("Documents API Response:", response.data);

      // Supports both array and object API responses
      const result = Array.isArray(response.data)
        ? response.data
        : response.data.documents || response.data.data || [];

      setDocuments(Array.isArray(result) ? result : []);

    } catch (err) {
      console.error("Documents API Error:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Unable to load documents";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter((doc) =>
    [
      doc.title,
      doc.type,
      doc.employeeId?.name,
      doc.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "Document",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (value) => (
        <Tag color="blue">
          {value?.replace(/_/g, " ").toUpperCase() || "OTHER"}
        </Tag>
      ),
    },
    {
      title: "Employee",
      key: "employee",
      render: (_, record) =>
        record.employeeId?.name || "Company",
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (value) =>
        value
          ? new Date(value).toLocaleDateString("en-IN")
          : "—",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value) => (
        <Tag
          color={
            value === "verified"
              ? "success"
              : value === "rejected"
              ? "error"
              : "warning"
          }
        >
          {value?.toUpperCase() || "PENDING"}
        </Tag>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Documents & Licences
          </Title>

          <Text type="secondary">
            Manage employee documents and company licences.
          </Text>
        </div>

        <Space>
          <Input
            placeholder="Search documents..."
            prefix={<SearchOutlined />}
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220 }}
          />

          <Button
            icon={<ReloadOutlined />}
            onClick={fetchDocuments}
            loading={loading}
          >
            Refresh
          </Button>
        </Space>
      </div>

      {error && (
        <Alert
          type="error"
          showIcon
          message="Failed to load documents"
          description={error}
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      <Card>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredDocuments}
          loading={loading}
          scroll={{ x: 750 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} documents`,
          }}
          locale={{
            emptyText: "No documents found",
          }}
        />
      </Card>
    </>
  );
}
