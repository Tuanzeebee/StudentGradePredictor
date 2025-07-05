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

  useEffect(() => {
    fetch('http://localhost:3000/scores/chart-data')
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="courseCode" />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#8884d8"
            name="Thực tế"
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#82ca9d"
            name="Dự đoán"
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreChart;
