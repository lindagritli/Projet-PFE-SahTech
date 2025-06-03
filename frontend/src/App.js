import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 📦 Composants
import Accueil from './components/accueil';
import ChatIA from './components/chatIA';
import Login from './components/Login';
import Signup from './components/signup';
import ProfilMedecin from './components/profilmedecin';
import DisponibilitesMedecin from './components/disponibilitesmedecin';
import MedecinRendezVous from './components/medecinrendezvous';
import CongeMedecin from './components/congeMedecin';
import ProfilPatient from './components/profilpatient';
import PatientRendezVous from './components/patientrendezvous';
import RendezVous from './components/rendezvous';
import PrivateRoute from './components/privateroute';
import AdminUtilisateurs from './components/adminutilisateurs';
import AdminEtablissements from './components/adminetablissements';
import EmailComposer from './components/emailcomposer';  
import MessageriePatient from './components/messageriepatient';
import MessagerieMedecin from './components/messageriemedecin';
import DashboardLayout from './components/layout/DashboardLayout';
import PatientDashboard from './pages/PatientDashboard';
import MedecinDashboard from './pages/MedecinDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ChatBox from './components/chat/ChatBox';
import Notification from './components/notification';
import ExpandedBilling from './pages/Paiement';
import Facture from './pages/Facture';
import ChatbotPopup from './pages/ChatbotPopUp';
import AdminVilles from './components/adminvilles';
function App() {
  return (

    <Router>
      <Routes>
        {/* 🌐 Public */}
        <Route path="/" element={<Accueil />} />
        <Route path="/chat" element={<ChatIA />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/rendezvous" element={<RendezVous />} /> 
        
        <Route path="/medical-chat" element={<ChatbotPopup />} />
        {/* Protected routes inside Dashboard layout */}
        <Route
          path="/"
          element={<PrivateRoute><DashboardLayout /></PrivateRoute>}
        >
          {/* Routes accessible inside layout */}
          
          <Route path="dashboard-medecin" element={<PrivateRoute role="medecin"><MedecinDashboard /></PrivateRoute>} />
          <Route path="dashboard-patient" element={<PrivateRoute role="patient"><PatientDashboard /></PrivateRoute>} />
          <Route path="rendezvous-patient" element={<PrivateRoute role="patient"><PatientRendezVous /></PrivateRoute>} />
          <Route path="rendezvous-medecin" element={<PrivateRoute role="medecin"><MedecinRendezVous /></PrivateRoute>} />
          <Route path="profil-patient" element={<PrivateRoute role="patient"><ProfilPatient /></PrivateRoute>} />
          <Route path="profil-medecin" element={<PrivateRoute role="medecin"><ProfilMedecin /></PrivateRoute>} />
          <Route path="disponibilites-medecin" element={<PrivateRoute role="medecin"><DisponibilitesMedecin /></PrivateRoute>} />
          <Route path="conges-medecin" element={<PrivateRoute role="medecin"><CongeMedecin /></PrivateRoute>} />
          <Route path="patient-messagerie" element={<PrivateRoute role="patient"><MessageriePatient /></PrivateRoute>} />
          <Route path="medecin-messagerie" element={<PrivateRoute role="medecin"><MessagerieMedecin /></PrivateRoute>} />
          <Route path="chat-ia" element={<PrivateRoute><ChatIA /></PrivateRoute>} />
          <Route path="email" element={<PrivateRoute><EmailComposer /></PrivateRoute>} />
          <Route path="/notifications" element={<Notification />} /> {/* 🟢 Nouvelle page */}
          <Route path="paiement" element={<PrivateRoute role="patient"><ExpandedBilling /></PrivateRoute>} />
          <Route path="facture" element={<PrivateRoute role="patient"><Facture /></PrivateRoute>} />
          <Route
            path="/msg"
            element={
              <ChatBox
                currentUser={{ email: 'patient@example.com', username: 'Patient' }}
                receiver={{ email: 'medecin@example.com', username: 'Dr. Medecin' }}
              />
            }
          />

          {/* <Route path="/medecin-messagerie" element={<MessagerieMedecin />} />
          <Route path="/patient-messagerie" element={<MessageriePatient />} /> */}

          {/* Admin routes */}
          <Route path="dashboard-admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
          <Route path="admin-utilisateurs" element={<PrivateRoute role="admin"><AdminUtilisateurs /></PrivateRoute>} />
          <Route path="admin-etablissements" element={<PrivateRoute role="admin"><AdminEtablissements /></PrivateRoute>} />
          <Route path="admin-villes" element={<PrivateRoute role="admin"><AdminVilles /></PrivateRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

