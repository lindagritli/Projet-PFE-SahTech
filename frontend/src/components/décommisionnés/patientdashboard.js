import React from 'react';
import HeaderBar from '../headerbar';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';

import {
  FaTachometerAlt,
  FaCalendarCheck,
  FaUser,
  FaHeartbeat,
  FaHistory,
  FaNotesMedical,
  FaCommentMedical,
  FaSearch, // 🔍 Icône pour recherche
} from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>👤 Rendez-Vous <br /> Patient</div>

      <Section title="ACCUEIL" items={[
        { icon: <FaTachometerAlt />, label: 'Dashboard', path: '/dashboard-patient' },
      ]} navigate={navigate} />

      <Section title="SANTÉ" items={[
        { icon: <FaCalendarCheck />, label: 'Mes rendez-vous', path: '/rendezvous-patient' },
        { icon: <FaUser />, label: 'Mon profil', path: '/profil-patient' },
        { icon: <FaHeartbeat />, label: 'Suivi médical', path: '/suivi-medical' },
        { icon: <FaNotesMedical />, label: 'Analyses & examens', path: '/analyses' },
        { icon: <FaHistory />, label: 'Historique', path: '/historique' },
        { icon: <FaSearch />, label: 'Rechercher un médecin', path: '/' }, // ✅ Ajout ici
        { icon: <FaEnvelope />, label: 'Messagerie', path: '/patient-messagerie' },

      ]} navigate={navigate} />

      <Section title="ASSISTANCE" items={[
        { icon: <FaCommentMedical />, label: 'Support médical', path: '/support' },
      ]} navigate={navigate} />
    </div>
  );
};

const Section = ({ title, items, navigate }) => (
  <div style={{ marginBottom: 30 }}>
    <div style={styles.sectionTitle}>{title}</div>
    {items.map((item, index) => (
      <div key={index} style={styles.item} onClick={() => navigate(item.path)}>
        <span style={styles.icon}>{item.icon}</span>
        {item.label}
      </div>
    ))}
  </div>
);

const PatientDashboard = () => {
  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>
        <HeaderBar />
        <h1 style={{ color: '#007bce' }}>Bienvenue sur votre espace santé 🩺</h1>
        <p style={{ color: '#333' }}>
          Vous pouvez consulter vos rendez-vous, vos analyses et suivre votre état de santé.
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
    backgroundColor: '#e6aa68',
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
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#d1e9ff',
    marginBottom: '10px',
    borderBottom: '1px solid #ffffff33',
    paddingBottom: '5px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 0',
    fontSize: '14px',
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
    backgroundColor: '#fff8f0',
  },
};

export default PatientDashboard;
