import React from 'react';

export function Card({ className = '', children }) {
  return (
    <div className={`rounded-2xl bg-white shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return <div className="mb-2 font-semibold text-lg">{children}</div>;
}

export function CardTitle({ children }) {
  return <h2 className="text-xl font-bold">{children}</h2>;
}

export function CardContent({ children }) {
  return <div className="text-gray-700">{children}</div>;
}
