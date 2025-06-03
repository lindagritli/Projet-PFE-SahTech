import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 📦 Composants
import Accueil from '../accueil';
import ChatIA from '../chatIA';
import Login from '../Login';
import Signup from '../signup';
import MedecinDashboard from './components/medecindashboard';
import PatientDashboard from './components/patientdashboard';
import ProfilMedecin from '../profilmedecin';
import DisponibilitesMedecin from '../disponibilitesmedecin';
import MedecinRendezVous from '../medecinrendezvous';
import CongeMedecin from '../congeMedecin';
import ProfilPatient from '../profilpatient';
import PatientRendezVous from '../patientrendezvous';
import RendezVous from '../rendezvous';
import PrivateRoute from '../privateroute';
import AdminDashboard from './components/admindashboard';
import AdminUtilisateurs from '../adminutilisateurs';
import AdminEtablissements from '../adminetablissements';
import EmailComposer from '../emailcomposer';  
import MessageriePatient from '../messageriepatient';
import MessagerieMedecin from '../messageriemedecin';
import DashboardLayout from '../layout/DashboardLayout';
import DashboardHome from './pages/DashboardHome';


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

        {/* 👩‍⚕️ Routes protégées : Médecin */}
        <Route path="/dashboard-medecin" element={
          <PrivateRoute role="medecin">
            <MedecinDashboard />
          </PrivateRoute>
        } />

        <Route path="/profil-medecin" element={
          <PrivateRoute role="medecin">
            <ProfilMedecin />
          </PrivateRoute>
        } />

        <Route path="/disponibilites" element={
          <PrivateRoute role="medecin">
            <DisponibilitesMedecin />
          </PrivateRoute>
        } />

        <Route path="/conges" element={
          <PrivateRoute role="medecin">
            <CongeMedecin />
          </PrivateRoute>
        } />

        <Route path="/rendezvous-medecin" element={
          <PrivateRoute role="medecin">
            <MedecinRendezVous />
          </PrivateRoute>
        } />

        {/* 🧑‍⚕️ Routes protégées : Patient */}
        <Route path="/dashboard-patient" element={
          <PrivateRoute role="patient">
            <PatientDashboard />
          </PrivateRoute>
        } />

        <Route path="/profil-patient" element={
          <PrivateRoute role="patient">
            <ProfilPatient />
          </PrivateRoute>
        } />

        <Route path="/rendezvous-patient" element={
          <PrivateRoute role="patient">
            <PatientRendezVous />
          </PrivateRoute>
        } />

        <Route path="/dashboard-admin" element={
          <PrivateRoute role="admin">
          <AdminDashboard /> 
          </PrivateRoute>
        } />
        <Route path="/admin-utilisateurs" element={<AdminUtilisateurs />} />
        <Route path="/admin-etablissements" element={<AdminEtablissements />} />
        <Route path="/email" element={<EmailComposer />} />
        <Route path="/patient-messagerie" element={<MessageriePatient />} />
<Route path="/medecin-messagerie" element={<MessagerieMedecin />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} /> {/* /dashboard */}
        </Route>
      
      </Routes>
      
    </Router>
  );
}

export default App;
