import React from 'react';
import HeaderBar from '../headerbar';
import { FaEnvelope } from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaSearch,
  FaCalendarAlt,
  FaNotesMedical,
  FaVials,
  FaHeartbeat,
  FaUserMd,
  FaHistory,
  FaClock,
  FaClipboardList,
} from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: <FaTachometerAlt />, label: 'Dashboard', path: '/dashboard-medecin' },
    { icon: <FaSearch />, label: 'Recherche', path: '/recherche' },
    { icon: <FaCalendarAlt />, label: 'Rendez-vous', path: '/rendezvous' },
    { icon: <FaClock />, label: 'Mes Disponibilités', path: '/disponibilites' }, // ✅ Nouvelle interface
    { icon: <FaClipboardList />, label: 'Mes Congés', path: '/conges' },
    { icon: <FaClipboardList />, label: 'Mes Rendez-vous', path: '/rendezvous-medecin' }, // ✅ Nouvelle interface
    { icon: <FaUserMd />, label: 'Profil Médecin', path: '/profil-medecin' },
    { icon: <FaVials />, label: 'Analyses', path: '/analyses' },
    { icon: <FaHeartbeat />, label: 'Suivi santé', path: '/suivi-sante' },
    { icon: <FaHistory />, label: 'Historique', path: '/historique' },
    { icon: <FaNotesMedical />, label: 'Paramètres', path: '/parametres' },
    { icon: <FaEnvelope />, label: 'Messagerie', path: '/medecin-messagerie' },

  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>🩺 Rendez-Vous <br /> Médical</div>
      {menuItems.map((item, index) => (
        <div key={index} style={styles.item} onClick={() => navigate(item.path)}>
          <span style={styles.icon}>{item.icon}</span>
          {item.label}
        </div>
        
      ))}
    </div>
  );
};

const MedecinDashboard = () => {
  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>
      <div>
  <HeaderBar />
  <div className="container mt-4">
    <h2>Bienvenue Médecin</h2>
    {/* Le reste de ton contenu */}
  </div>
</div>

        <h1 style={{ color: '#007bce' }}>Bienvenue sur votre tableau de bord 👨‍⚕️</h1>
        <p style={{ color: '#333' }}>
          Vous pouvez gérer vos rendez-vous, vos disponibilités, votre profil, et plus encore depuis cette interface.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, sans-serif',
  },
  sidebar: {
    width: '260px',
    backgroundColor: '#4B61D1',
    color: '#fff',
    padding: '20px',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '30px',
    lineHeight: '1.4',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 0',
    fontSize: '15px',
    cursor: 'pointer',
    color: '#fff',
    transition: 'background 0.3s',
  },
  icon: {
    marginRight: '10px',
    fontSize: '16px',
  },
  content: {
    flex: 1,
    padding: '40px',
    backgroundColor: '#def3fa',
  },
};

export default MedecinDashboard;
