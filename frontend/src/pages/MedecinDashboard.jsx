import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '../components/ui/card';

const data = [
  { name: 'Jan', consultations: 10 },
  { name: 'Fév', consultations: 15 },
  { name: 'Mar', consultations: 7 },
  { name: 'Avr', consultations: 20 },
];

const MedecinDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Tableau de bord médecin</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Consultations totales', value: 87 },
          { label: 'Nombre de Patients', value: 34 },
          { label: 'Consultations à distance', value: 26 },
          { label: 'Consultations en présentiel', value: 50 },
        ].map((item, idx) => (
          <Card
            key={idx}
            className="bg-white text-gray-800 hover:bg-gradient-to-b hover:from-blue-400 hover:via-purple-300 hover:to-pink-200 hover:text-white transition duration-300 rounded-xl shadow-md"
          >
            <CardContent className="p-4">
              <p className="text-sm opacity-80">{item.label}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Consultations mensuelles</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="consultations" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MedecinDashboard;
