// src/components/AdminDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaUser, FaCalendarAlt, FaHome, FaSignOutAlt, FaBuilding } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>🛠️ Admin Panel</h2>
        <nav>
          <ul style={styles.menu}>
            <li onClick={() => navigate('/admin-home')}><FaHome style={styles.icon}/> Accueil</li>
            <li onClick={() => navigate('/admin-utilisateurs')}> <FaUser style={styles.icon}/> Utilisateurs</li>
            <li onClick={() => navigate('/admin-etablissements')}><FaBuilding style={styles.icon}/> Établissements</li>

            <li onClick={() => navigate('/admin-medecins')}><FaUserMd style={styles.icon}/> Médecins</li>
            <li onClick={() => navigate('/admin-patients')}><FaUser style={styles.icon}/> Patients</li>
            <li onClick={() => navigate('/admin-rendezvous')}><FaCalendarAlt style={styles.icon}/> Rendez-vous</li>
            <li onClick={handleLogout}><FaSignOutAlt style={styles.icon}/> Déconnexion</li>
          </ul>
        </nav>
      </aside>

      <main style={styles.content}>
        <h1>Bienvenue Administrateur 🧑‍💼</h1>
        <p>Utilisez le menu à gauche pour naviguer.</p>
      </main>
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
    width: '250px',
    background: '#005b96',
    color: 'white',
    padding: '20px',
  },
  logo: {
    fontSize: '22px',
    marginBottom: '30px',
    fontWeight: 'bold',
  },
  menu: {
    listStyleType: 'none',
    padding: 0,
  },
  icon: {
    marginRight: '10px',
  },
  content: {
    flex: 1,
    padding: '40px',
    backgroundColor: '#f4f8fb',
  }
};

export default AdminDashboard;
