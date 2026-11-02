
import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Typography,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Select,
  DatePicker,
  Row,
  Col,
  App,
  Popconfirm,
} from "antd";

import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../features/employees/employeeSlice";

import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function Employees() {
  const dispatch = useDispatch();
  const { message } = App.useApp();

  const {
    items = [],
    total = 0,
    loading = false,
    saving = false,
  } = useSelector((state) => state.employees);

  const [open, setOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [form] = Form.useForm();

  // Fetch employees whenever page or search changes
  const loadEmployees = async (currentPage = page, currentSearch = search) => {
    try {
      await dispatch(
        fetchEmployees({
          page: currentPage,
          limit: 10,
          search: currentSearch,
        })
      ).unwrap();
    } catch (error) {
      console.error("Fetch employees error:", error);
      message.error("Unable to load employees");
    }
  };

  useEffect(() => {
    loadEmployees(page, search);
  }, [page, search]);

  // Open Add Modal
  const handleAdd = () => {
    setEditingEmployee(null);
    form.resetFields();

    form.setFieldsValue({
      status: "active",
    });

    setOpen(true);
  };

  // Open Edit Modal
  const handleEdit = (employee) => {
    setEditingEmployee(employee);

    form.setFieldsValue({
      ...employee,
      joinDate: employee.joinDate
        ? dayjs(employee.joinDate)
        : null,
    });

    setOpen(true);
  };

  // Add / Update Employee
  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        joinDate: values.joinDate
          ? values.joinDate.toISOString()
          : null,
      };

      if (editingEmployee) {
        await dispatch(
          updateEmployee({
            id: editingEmployee._id,
            employeeData: payload,
          })
        ).unwrap();

        message.success("Employee updated successfully");
      } else {
        await dispatch(createEmployee(payload)).unwrap();

        message.success("Employee added successfully");
      }

      setOpen(false);
      form.resetFields();
      setEditingEmployee(null);

      // Always refresh the first page after adding/updating
      setPage(1);

      await loadEmployees(1, search);
    } catch (error) {
      console.error("Save employee error:", error);

      message.error(
        typeof error === "string"
          ? error
          : error?.message || "Something went wrong"
      );
    }
  };

  // Delete Employee
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteEmployee(id)).unwrap();

      message.success("Employee deleted successfully");

      await loadEmployees();
    } catch (error) {
      console.error("Delete employee error:", error);

      message.error(
        typeof error === "string"
          ? error
          : "Unable to delete employee"
      );
    }
  };

  // Table Columns
  const columns = [
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
    },
    {
      title: "Employee Name",
      dataIndex: "name",
      key: "name",
      render: (value) => <Text strong>{value}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
    },
    {
      title: "Job Title",
      dataIndex: "jobTitle",
      key: "jobTitle",
    },
    {
      title: "Nationality",
      dataIndex: "nationality",
      key: "nationality",
    },
    {
      title: "Joining Date",
      dataIndex: "joinDate",
      key: "joinDate",
      render: (value) =>
        value ? dayjs(value).format("DD-MM-YYYY") : "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value) => (
        <Tag
          color={
            value === "active"
              ? "success"
              : value === "inactive"
              ? "error"
              : "warning"
          }
        >
          {value?.replace(/_/g, " ").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />

          <Popconfirm
            title="Delete employee?"
            description="This will permanently delete this employee record."
            onConfirm={() => handleDelete(record._id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 15,
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Employees
          </Title>

          <Text type="secondary">
            Manage your company employees and their information.
          </Text>
        </div>

        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => loadEmployees()}
            loading={loading}
          >
            Refresh
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Add Employee
          </Button>
        </Space>
      </div>

      {/* Employee Table */}
      <Card>
        <div style={{ marginBottom: 20 }}>
          <Input
            placeholder="Search by employee ID, name, email..."
            prefix={<SearchOutlined />}
            allowClear
            style={{ maxWidth: 350 }}
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={items}
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            current: page,
            pageSize: 10,
            total,
            showSizeChanger: false,
            showTotal: (value) => `Total ${value} employees`,
            onChange: (current) => setPage(current),
          }}
        />
      </Card>

      {/* Add / Edit Employee Modal */}
      <Modal
        title={
          editingEmployee
            ? "Edit Employee"
            : "Add New Employee"
        }
        open={open}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
          setEditingEmployee(null);
        }}
        onOk={() => form.submit()}
        okText={
          editingEmployee
            ? "Update Employee"
            : "Save Employee"
        }
        confirmLoading={saving}
        width={750}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="employeeId"
                label="Employee ID"
                rules={[
                  {
                    required: true,
                    message: "Employee ID is required",
                  },
                ]}
              >
                <Input placeholder="EMP-1001" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[
                  {
                    required: true,
                    message: "Name is required",
                  },
                ]}
              >
                <Input placeholder="Enter employee name" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    type: "email",
                    message: "Enter valid email",
                  },
                ]}
              >
                <Input placeholder="employee@company.com" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
              >
                <Input placeholder="+966 5XXXXXXXX" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="department"
                label="Department"
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Select department"
                  options={[
                    { value: "HR", label: "Human Resources" },
                    { value: "IT", label: "Information Technology" },
                    { value: "Finance", label: "Finance" },
                    { value: "Operations", label: "Operations" },
                    { value: "Engineering", label: "Engineering" },
                    { value: "Maintenance", label: "Maintenance" },
                    { value: "Safety", label: "Safety" },
                    { value: "Administration", label: "Administration" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="branch"
                label="Branch / Location"
              >
                <Input placeholder="Riyadh" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="nationality"
                label="Nationality"
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Select nationality"
                  options={[
                    "Saudi Arabian",
                    "Indian",
                    "Pakistani",
                    "Bangladeshi",
                    "Filipino",
                    "Nepalese",
                    "Egyptian",
                    "Other",
                  ].map((value) => ({
                    value,
                    label: value,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="jobTitle"
                label="Job Title"
              >
                <Input placeholder="Software Engineer" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="joinDate"
                label="Joining Date"
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD-MM-YYYY"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="status"
                label="Employment Status"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                    { value: "on_leave", label: "On Leave" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
