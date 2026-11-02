
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
} from "antd";

import {
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import api from "../api/api";

const { Title, Text } = Typography;

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tasks");

      console.log("Tasks API Response:", response.data);

      const result = Array.isArray(response.data)
        ? response.data
        : response.data.tasks || response.data.data || [];

      setTasks(Array.isArray(result) ? result : []);

    } catch (err) {
      console.error("Tasks API Error:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load tasks"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) =>
    [
      task.title,
      task.priority,
      task.status,
      task.documentId?.title,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "Task",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Related Document",
      key: "document",
      render: (_, record) =>
        record.documentId?.title || "—",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (value) =>
        value
          ? new Date(value).toLocaleDateString("en-IN")
          : "—",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (value) => {
        const colors = {
          critical: "red",
          high: "orange",
          medium: "blue",
          low: "default",
        };

        return (
          <Tag color={colors[value] || "default"}>
            {value?.toUpperCase() || "NORMAL"}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value) => {
        const colors = {
          completed: "success",
          pending: "warning",
          in_progress: "processing",
          overdue: "error",
        };

        return (
          <Tag color={colors[value] || "default"}>
            {value?.replace(/_/g, " ").toUpperCase() || "PENDING"}
          </Tag>
        );
      },
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Renewals & Tasks
          </Title>

          <Text type="secondary">
            Track document renewals and compliance activities.
          </Text>
        </div>

        <Space>
          <Input
            placeholder="Search tasks..."
            prefix={<SearchOutlined />}
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220 }}
          />

          <Button
            icon={<ReloadOutlined />}
            onClick={fetchTasks}
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
          message="Failed to load tasks"
          description={error}
          style={{ marginBottom: 16 }}
        />
      )}

      <Card>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredTasks}
          loading={loading}
          scroll={{ x: 750 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} tasks`,
          }}
          locale={{
            emptyText: "No tasks found",
          }}
        />
      </Card>
    </>
  );
}
