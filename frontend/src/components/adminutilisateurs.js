import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminUtilisateurs() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const chargerUtilisateurs = () => {
    setIsLoading(true);
    axios.get("http://127.0.0.1:8000/api/utilisateurs/")
      .then(res => {
        setUsers(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors du chargement :", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    chargerUtilisateurs();
  }, []);

  const supprimerUtilisateur = (id) => {
    if (window.confirm("Confirmer la suppression ?")) {
      axios.delete(`http://127.0.0.1:8000/api/utilisateurs/delete/${id}/`)
        .then(() => chargerUtilisateurs())
        .catch(err => alert("Erreur suppression"));
    }
  };

  const handleUpdate = () => {
    axios.put(`http://127.0.0.1:8000/api/utilisateurs/update/${editUser.id}/`, editUser)
      .then(() => {
        setEditUser(null);
        chargerUtilisateurs();
      })
      .catch(err => alert("Erreur modification"));
  };

  const toggleUserStatus = (user) => {
    const updatedUser = { ...user, is_active: !user.is_active };
    axios.put(`http://127.0.0.1:8000/api/utilisateurs/update/${user.id}/`, updatedUser)
      .then(() => {
        chargerUtilisateurs();
      })
      .catch(err => alert("Erreur lors du changement de statut"));
  };

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'admin':
        return 'bg-gradient-to-r from-[#0E918C] to-[#2fa6a1] text-white';
      case 'medecin':
        return 'bg-gradient-to-r from-[#66B7AD] to-[#87c7bf] text-white';
      case 'patient':
        return 'bg-gradient-to-r from-[#B0B9A8] to-[#c4cdbf] text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const getStatusBadgeClass = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border border-green-200' 
      : 'bg-red-100 text-red-800 border border-red-200';
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 rounded-xl">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-2xl font-bold text-[#0E918C] flex items-center">
              <span className="mr-2">👥</span> Gestion des utilisateurs
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-64 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E918C] focus:border-transparent"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0E918C]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-[#0E918C] to-[#2fa6a1] text-white">
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Nom utilisateur</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Rôle</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Statut</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{u.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => toggleUserStatus(u)}
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-md cursor-pointer ${getStatusBadgeClass(u.is_active)}`}
                        >
                          {u.is_active ? 'Activé' : 'Désactivé'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setEditUser({ ...u })} 
                            className="bg-[#A3BBAE] hover:bg-[#8da99a] text-white py-1.5 px-3 rounded-md transition-colors flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Modifier
                          </button>
                          <button 
                            onClick={() => supprimerUtilisateur(u.id)} 
                            className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 rounded-md transition-colors flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Formulaire de modification */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-fadeIn">
            <div className="bg-gradient-to-r from-[#0E918C] to-[#2fa6a1] px-6 py-4 flex justify-between items-center">
              <h4 className="text-xl font-bold text-white flex items-center">
                <span className="mr-2">✏️</span> Modifier l'utilisateur
              </h4>
              <button 
                onClick={() => setEditUser(null)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom utilisateur</label>
                <input
                  type="text"
                  placeholder="Nom utilisateur"
                  value={editUser.username}
                  onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E918C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E918C] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E918C] focus:border-transparent"
                >
                  <option value="patient">Patient</option>
                  <option value="medecin">Médecin</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={editUser.is_active ? "true" : "false"}
                  onChange={(e) => setEditUser({ ...editUser, is_active: e.target.value === "true" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E918C] focus:border-transparent"
                >
                  <option value="true">Activé</option>
                  <option value="false">Désactivé</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  className="flex-1 bg-[#0E918C] hover:bg-[#0a7c78] text-white py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
                  onClick={handleUpdate}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Enregistrer
                </button>
                <button 
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 px-4 rounded-lg transition-colors"
                  onClick={() => setEditUser(null)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUtilisateurs;