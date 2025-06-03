import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminVilles() {
  const [villes, setVilles] = useState([]);
  const [nom, setNom] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchVilles = () => {
    setIsLoading(true);
    axios.get('http://127.0.0.1:8000/api/villes/')
      .then(res => {
        setVilles(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors du chargement :", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchVilles();
  }, []);

  const handleAddOrUpdate = () => {
    if (!nom.trim()) {
      alert("Le nom de la ville ne peut pas être vide");
      return;
    }
    
    if (editId) {
      axios.put(`http://127.0.0.1:8000/api/villes/update/${editId}/`, { nom })
        .then(() => {
          setEditId(null);
          setNom("");
          fetchVilles();
        })
        .catch(err => alert("Erreur lors de la modification"));
    } else {
      axios.post('http://127.0.0.1:8000/api/villes/create/', { nom })
        .then(() => {
          setNom("");
          fetchVilles();
        })
        .catch(err => alert("Erreur lors de l'ajout"));
    }
  };

  const handleEdit = (ville) => {
    setEditId(ville.id);
    setNom(ville.nom);
  };

  const handleDelete = (id) => {
    if (window.confirm("Confirmer suppression ?")) {
      axios.delete(`http://127.0.0.1:8000/api/villes/delete/${id}/`)
        .then(fetchVilles)
        .catch(err => alert("Erreur lors de la suppression"));
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setNom("");
  };

  const filteredVilles = villes.filter(ville => 
    ville.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 rounded-xl">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-2xl font-bold text-[#0E918C] flex items-center">
              <span className="mr-2">🏙️</span> Gestion des villes
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher une ville..."
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
        
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={nom}
              onChange={e => setNom(e.target.value)}
              placeholder="Nom de la ville"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E918C] focus:border-transparent"
            />
            <div className="flex gap-2">
              <button 
                className="bg-[#0E918C] hover:bg-[#0a7c78] text-white py-2 px-4 rounded-lg transition-colors flex items-center"
                onClick={handleAddOrUpdate}
              >
                {editId ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Modifier
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Ajouter
                  </>
                )}
              </button>
              {editId && (
                <button 
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                  onClick={handleCancel}
                >
                  Annuler
                </button>
              )}
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
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Nom</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredVilles.length > 0 ? (
                  filteredVilles.map(ville => (
                    <tr key={ville.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ville.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ville.nom}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEdit(ville)} 
                            className="bg-[#A3BBAE] hover:bg-[#8da99a] text-white py-1.5 px-3 rounded-md transition-colors flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Modifier
                          </button>
                          <button 
                            onClick={() => handleDelete(ville.id)} 
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
                    <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                      Aucune ville trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminVilles;