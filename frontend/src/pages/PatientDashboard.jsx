import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '../components/ui/card';

const data = [
  { name: 'Jan', consultations: 2 },
  { name: 'Fév', consultations: 3 },
  { name: 'Mar', consultations: 5 },
  { name: 'Avr', consultations: 2 },
];

const PatientDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Tableau de bord patient</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Consultations totales', value: 12 },
          { label: 'Nombre de médecins', value: 5 },
          { label: 'Consultations à distance', value: 2 },
          { label: 'Consultations en présentiel', value: 4 },
        ].map((item, idx) => (
          <Card
            key={idx}
            className="bg-white text-gray-800 hover:bg-gradient-to-br hover:from-blue-200 hover:via-sky-300 hover:to-cyan-100 hover:text-gray-800 transition duration-300 rounded-xl shadow-md"

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

export default PatientDashboard;
