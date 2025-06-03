import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Notification() {
  const [rappels, setRappels] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (currentUser?.email) {
      axios.get(`http://127.0.0.1:8000/api/rappels/${currentUser.email}/`)
        .then(res => {
          setRappels(res.data);
        })
        .catch(err => {
          console.error("Erreur lors de la récupération des notifications :", err);
        });
    }
  }, [currentUser]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>🔔 Notifications</h2>
      {rappels.length === 0 ? (
        <p style={{ color: '#888' }}>Aucune notification.</p>
      ) : (
        rappels.map((rappel, index) => (
          <div
            key={index}
            style={{
              marginBottom: '10px',
              padding: '10px',
              backgroundColor: '#e6f7ff',
              border: '1px solid #91d5ff',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          >
            {rappel.message}
          </div>
        ))
      )}
    </div>
  );
}

export default Notification;
