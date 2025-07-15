import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type DataPoint = {
  courseCode: string;
  semester: string;
  actual?: number;
  predicted?: number;
};

const ScoreChart: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/scores/chart-data', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch chart data');
        return res.json();
      })
      .then(setData)
      .catch((err) => {
        console.error('Error fetching data:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || error || data.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          height: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: error ? '#fff3e0' : '#f8f9fa',
          borderRadius: '8px',
          border: error ? '1px solid #ff9800' : undefined,
        }}
      >
        <p style={{ color: error ? '#e65100' : '#333' }}>
          {error ? `Lỗi: ${error}` : loading ? 'Đang tải dữ liệu...' : 'Không có dữ liệu để hiển thị'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="courseCode" />
          <YAxis domain={[0, 10]} />
          <Tooltip formatter={(value: number, name: string) => [value.toFixed(2), name]} />
          <Legend />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#1976d2"
            strokeWidth={2.5}
            name="Điểm thực tế"
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#43a047"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Điểm dự đoán"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreChart;
