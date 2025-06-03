import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Mail,
  Bell,
  LogOut,
  User,
  Clock,
  ListTodo,
  CalendarClock,
  UserSearch,
  Building,
  MapPin
} from 'lucide-react';

import '../../index1.css';
import { getCurrentUserRole, getCurrentUsername, getCurrentUserEmail } from '../utils.js';

const sidebarColorClassMap = {
  // 🍃 PATIENT — couleur #B0B9A8 avec dégradation
  patient: 'bg-gradient-to-br from-[#d8e0d0] via-[#c4cdbf] to-[#B0B9A8] text-[#1b4332]',

  // 🩺 MEDECIN — couleur #66B7AD
  medecin: 'bg-gradient-to-br from-[#a8d7d1] via-[#87c7bf] to-[#66B7AD] text-[#1f363d]',

  // 👨‍💼 ADMIN — couleur #0E918C
  admin: 'bg-gradient-to-br from-[#5cbbb7] via-[#2fa6a1] to-[#0E918C] text-[#f0f9f8]',
};

const SidebarItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-[#A3BBAE] text-white font-semibold shadow'
          : 'text-gray-700 hover:bg-[#d3e0d9] hover:text-[#4a6b5d]'
      }`
    }
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </NavLink>
);

const DashboardLayout = () => {
  const [currentUserRole, setCurrentUserRole] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentUserRole(getCurrentUserRole());
    setCurrentUsername(getCurrentUsername());
    
    // Récupérer l'email de l'utilisateur connecté
    const email = getCurrentUserEmail();
    
    if (email) {
      // Déterminer l'API endpoint en fonction du rôle
      const role = getCurrentUserRole();
      const endpoint = role === 'medecin' 
        ? `http://127.0.0.1:8000/api/medecin/${email}/`
        : role === 'patient'
          ? `http://127.0.0.1:8000/api/patient/${email}/`
          : role === 'admin'
            ? `http://127.0.0.1:8000/api/admin/${email}/`
            : null;
      
      if (endpoint) {
        // Récupérer les données de l'utilisateur, y compris la photo
        fetch(endpoint)
          .then(res => res.json())
          .then(data => {
            if (data && data.photo) {
              setUserPhoto(data.photo);
            }
            setLoading(false);
          })
          .catch(err => {
            console.error("Erreur lors de la récupération de la photo:", err);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const sidebarColorClass = sidebarColorClassMap[currentUserRole] || 'bg-gray-100 text-gray-800';

  return (
  <div className="flex h-screen bg-gray-100 font-sans">
  <aside className={`h-full w-64 flex flex-col justify-between ${sidebarColorClass}`}>
    <div>
      <div className="flex items-center gap-2 px-6 py-6 text-[#0E3843] text-2xl font-bold border-b">
        <span className="bg-blue-100 p-2 rounded-full">
          <LayoutDashboard className="w-6 h-6" />
        </span>
        SahTech 🩺 صحّـتكـ
      </div>

          <nav className="flex flex-col gap-1 px-4 py-4">
            {currentUserRole === 'admin' && (
              
              <>
                <span className="text-xs font-semibold text-gray-500 uppercase mt-4 mb-2">Général</span>
                <SidebarItem to="/dashboard-admin" icon={LayoutDashboard} label="Tableau de bord" />
                <span className="text-xs font-semibold text-gray-500 uppercase mt-4 mb-2">Gestion</span>
                <SidebarItem to="/admin-utilisateurs" icon={User} label="Utilisateurs" />
                <SidebarItem to="/admin-etablissements" icon={Building} label="Établissements" />
                <SidebarItem to="/admin-villes" icon={MapPin} label="Villes" />
                <span className="text-xs font-semibold text-gray-500 uppercase mt-4 mb-2">Communication</span>
                <SidebarItem to="/" icon={Mail} label="Messages" />
                <SidebarItem to="/notifications" icon={Bell} label="Notifications" />
              </>
            )}
            {currentUserRole === 'patient' && (
              <>
                <span className="text-xs font-semibold text-gray-500 uppercase mt-4 mb-2">Général</span>
                <SidebarItem to="/dashboard-patient" icon={LayoutDashboard} label="Tableau de bord" />
                <SidebarItem to="/profil-patient" icon={User} label="Profil" />
                <span className="text-xs font-semibold text-gray-500 uppercase mt-4 mb-2">Consultation</span>
                <SidebarItem to="/rendezvous-patient" icon={CalendarDays} label="Mes Rendez-vous" />
                <SidebarItem to="/" icon={UserSearch} label="Chercher médecin" />
                <span className="text-xs font-semibold text-gray-500 uppercase mt-4 mb-2">Communication</span>
                <SidebarItem to="/patient-messagerie" icon={Mail} label="Messages" />
                <SidebarItem to="/notifications" icon={Bell} label="Notifications" />
              </>
            )}
            {currentUserRole === 'medecin' && (
              <>
                <span className="text-xs font-semibold text-gray-500 uppercase mt-4 mb-2">Général</span>
                <SidebarItem to="/dashboard-medecin" icon={LayoutDashboard} label="Tableau de bord" />
                <SidebarItem to="/profil-medecin" icon={User} label="Profil" />
                <span className="text-xs font-semibold text-gray-500 uppercase mt-4 mb-2">Consultation</span>
                <SidebarItem to="/rendezvous-medecin" icon={CalendarClock} label="Mes Rendez-vous" />
                <SidebarItem to="/disponibilites-medecin" icon={Clock} label="Horaires de travail" />
                <SidebarItem to="/conges-medecin" icon={ListTodo} label="Congés" />
                <SidebarItem to="/" icon={UserSearch} label="Page d'accueil" />
                <span className="text-xs font-semibold text-gray-500 uppercase mt-4 mb-2">Communication</span>
                <SidebarItem to="/medecin-messagerie" icon={Mail} label="Messages" />
                <SidebarItem to="/notifications" icon={Bell} label="Notifications" />
              </>
            )}
          </nav>
        </div>

        <div className="px-4 py-4">
          <div
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
            className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer text-red-600 hover:bg-red-100 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
     <div className="flex-1 flex flex-col">
  <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
    <div className="text-xl font-bold text-[#0E3843]">Bienvenue sur ton espace {currentUserRole}</div>
    <div className="flex items-center gap-6 text-gray-700">
      <NavLink to={`/${currentUserRole}-messagerie`} className="flex items-center gap-2 hover:text-blue-600">
        <Mail className="w-5 h-5" />
              <span className="text-sm font-medium">Messages</span>
            </NavLink>
            <NavLink to="/notifications" className="flex items-center gap-2 hover:text-blue-600">
              <Bell className="w-5 h-5" />
              <span className="text-sm font-medium">Notifications</span>
            </NavLink>

            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                {loading ? (
                  <div className="w-full h-full rounded-full bg-gray-200 animate-pulse"></div>
                ) : (
                  <img
                    src={userPhoto || "https://i.pravatar.cc/30"}
                    alt="profile"
                    className="rounded-full w-full h-full object-cover border border-white shadow"
                  />
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-gray-800">{currentUsername}</span>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full w-fit mt-0.5 ${
                    sidebarColorClassMap[currentUserRole] || 'bg-gray-200 text-gray-800'
                  }`}
                >
                  Espace {currentUserRole.charAt(0).toUpperCase() + currentUserRole.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;