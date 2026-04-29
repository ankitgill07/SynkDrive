"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const sharingTrendData = [
  { date: "Mon", shares: 12, views: 45 },
  { date: "Tue", shares: 19, views: 67 },
  { date: "Wed", shares: 15, views: 52 },
  { date: "Thu", shares: 25, views: 88 },
  { date: "Fri", shares: 22, views: 75 },
  { date: "Sat", shares: 18, views: 61 },
  { date: "Sun", shares: 14, views: 48 },
];

const permissionDistributionData = [
  { name: "View Only", value: 34 },
  { name: "Can Edit", value: 45 },
  { name: "Admin", value: 21 },
];

const COLORS = ["#94a3b8", "#3b82f6", "#8b5cf6"];

export function ShareAnalytics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-0 shadow-sm p-6">
        <h3 className="font-bold text-lg mb-4">Sharing Activity Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sharingTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: `1px solid var(--color-border)`,
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="shares"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ fill: "var(--color-primary)", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke="var(--color-accent)"
              strokeWidth={2}
              dot={{ fill: "var(--color-accent)", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="border-0 shadow-sm p-6">
        <h3 className="font-bold text-lg mb-4">Permission Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={permissionDistributionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {permissionDistributionData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: `1px solid var(--color-border)`,
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card className="border-0 shadow-sm p-6 lg:col-span-2">
        <h3 className="font-bold text-lg mb-4">
          Weekly File Sharing Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sharingTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: `1px solid var(--color-border)`,
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar
              dataKey="shares"
              fill="var(--color-primary)"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="views"
              fill="var(--color-accent)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
