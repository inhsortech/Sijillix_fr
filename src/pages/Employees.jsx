import { Card, Typography } from "antd";

export default function Employees() {
  return (
    <Card>
      <Typography.Title level={3}>Employees</Typography.Title>
      <Typography.Text type="secondary">
        Manage employees belonging to your organization.
      </Typography.Text>
    </Card>
  );
}