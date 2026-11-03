
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Row,
  Col,
  Card,
  Statistic,
  Spin,
  Alert,
  Select,
  Empty,
  message,
} from "antd";
import api from "../api/api";

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const isSuperAdmin = user?.role === "super_admin";

  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(
    localStorage.getItem("selectedOrganizationId") || undefined
  );

  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load organizations for Super Admin
  useEffect(() => {
    if (!isSuperAdmin) return;

    const loadOrganizations = async () => {
      try {
        const { data } = await api.get("/organizations");
        const activeOrganizations = (data.organizations || []).filter(
          (org) => org.active
        );

        setOrganizations(activeOrganizations);

        const savedId = localStorage.getItem("selectedOrganizationId");

        if (savedId && activeOrganizations.some((org) => org._id === savedId)) {
          setSelectedOrg(savedId);
        } else {
          setSelectedOrg(undefined);
          localStorage.removeItem("selectedOrganizationId");
          localStorage.removeItem("selectedOrganizationName");
        }
      } catch (error) {
        message.error(
          error.response?.data?.message || "Unable to load organizations"
        );
      }
    };

    loadOrganizations();
  }, [isSuperAdmin]);

  // Load dashboard statistics
  useEffect(() => {
    if (isSuperAdmin && !selectedOrg) {
      setStatistics(null);
      setLoading(false);
      return;
    }

    let active = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const url = isSuperAdmin
          ? `/dashboard?organizationId=${encodeURIComponent(selectedOrg)}`
          : "/dashboard";

        const { data } = await api.get(url);

        if (active) {
          setStatistics(data.statistics);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message || "Dashboard failed to load"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, [isSuperAdmin, selectedOrg]);

  const handleOrganizationChange = (organizationId) => {
    setSelectedOrg(organizationId);

    const org = organizations.find((item) => item._id === organizationId);

    localStorage.setItem("selectedOrganizationId", organizationId);
    localStorage.setItem("selectedOrganizationName", org?.name || "");
  };

  if (isSuperAdmin && !organizations.length) {
    return <Empty description="No active organizations found" />;
  }

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <h2>Dashboard</h2>
        </Col>

        {isSuperAdmin && (
          <Col>
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Select Organization"
              style={{ width: 280 }}
              value={selectedOrg}
              onChange={handleOrganizationChange}
              options={organizations.map((org) => ({
                value: org._id,
                label: `${org.name} (${org.code})`,
              }))}
            />
          </Col>
        )}
      </Row>

      {isSuperAdmin && !selectedOrg && (
        <Alert
          type="info"
          showIcon
          message="Select an organization to view its dashboard"
        />
      )}

      {loading && <Spin size="large" />}

      {error && <Alert type="error" message={error} />}

      {!loading && statistics && (
        <Row gutter={[16, 16]}>
          {[
            ["Employees", statistics.employees],
            ["Documents", statistics.documents],
            ["Total Tasks", statistics.tasks],
            ["Pending Tasks", statistics.pendingTasks],
            ["Completed Tasks", statistics.completedTasks],
          ].map(([title, value]) => (
            <Col xs={24} sm={12} lg={8} key={title}>
              <Card>
                <Statistic title={title} value={value ?? 0} />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
}
