import { Card, Typography } from "antd";

export default function Tasks() {
  return (
    <Card>
      <Typography.Title level={3}>Tasks</Typography.Title>
      <Typography.Text type="secondary">
        Manage and assign tasks.
      </Typography.Text>
    </Card>
  );
}