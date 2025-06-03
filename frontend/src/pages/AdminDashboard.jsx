import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '../components/ui/card';

const data = [
  { name: 'Jan', utilisateurs: 10 },
  { name: 'Fév', utilisateurs: 15 },
  { name: 'Mar', utilisateurs: 7 },
  { name: 'Avr', utilisateurs: 20 },
];

const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Tableau de bord admin</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total utilisateurs", value: 46 },
          { label: 'Total patients', value: 34 },
          { label: 'Total médecins', value: 12 },
          { label: 'Total établissements', value: 20 },
        ].map((item, idx) => (
          <Card
            key={idx}
            className="bg-white text-gray-800 hover:bg-gradient-to-br hover:from-yellow-200 hover:via-orange-100 hover:to-stone-100 hover:text-gray-900 transition duration-300 rounded-xl shadow-md"
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
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Utilisateurs </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="utilisateurs" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
