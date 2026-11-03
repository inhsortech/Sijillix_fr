import { Card, Typography } from "antd";

export default function Documents() {
  return (
    <Card>
      <Typography.Title level={3}>Documents</Typography.Title>
      <Typography.Text type="secondary">
        Manage organization documents.
      </Typography.Text>
    </Card>
  );
}