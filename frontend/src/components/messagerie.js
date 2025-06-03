// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Messagerie = ({ role }) => {
//   const currentUserEmail = localStorage.getItem('email');
//   const [reception, setReception] = useState([]);
//   const [envoyes, setEnvoyes] = useState([]);
//   const [formData, setFormData] = useState({
//     destinataire: '',
//     objet: '',
//     contenu: '',
//   });

//   useEffect(() => {
//     if (currentUserEmail) {
//       axios.get(`http://127.0.0.1:8000/api/messages/reception/${currentUserEmail}/`)
//         .then(res => setReception(res.data))
//         .catch(console.error);

//       axios.get(`http://127.0.0.1:8000/api/messages/envoyes/${currentUserEmail}/`)
//         .then(res => setEnvoyes(res.data))
//         .catch(console.error);
//     }
//   }, [currentUserEmail]);

//   const envoyerMessage = (e) => {
//     e.preventDefault();
//     axios.post('http://127.0.0.1:8000/api/messages/envoyer/', {
//       ...formData,
//       expediteur: currentUserEmail,
//     })
//     .then(() => {
//       alert('✉️ Message envoyé !');
//       setFormData({ destinataire: '', objet: '', contenu: '' });
//     })
//     .catch(console.error);
//   };

//   return (
//     <div className="p-4 max-w-3xl mx-auto">
//       <h2 className="text-xl font-bold mb-4">Messagerie {role}</h2>

//       <form onSubmit={envoyerMessage} className="space-y-2 mb-6">
//         <input
//           type="email"
//           placeholder="Destinataire"
//           value={formData.destinataire}
//           onChange={(e) => setFormData({ ...formData, destinataire: e.target.value })}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="text"
//           placeholder="Objet"
//           value={formData.objet}
//           onChange={(e) => setFormData({ ...formData, objet: e.target.value })}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <textarea
//           placeholder="Contenu"
//           value={formData.contenu}
//           onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
//           className="w-full p-2 border rounded"
//           required
//         ></textarea>
//         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//           Envoyer
//         </button>
//       </form>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <h3 className="font-semibold text-gray-700 mb-2">📥 Réception</h3>
//           {reception.map(msg => (
//             <div key={msg.id} className="p-3 border rounded bg-gray-50 mb-2">
//               <p className="text-sm font-medium">De : {msg.expediteur}</p>
//               <p className="text-sm">Objet : {msg.objet}</p>
//               <p className="text-sm text-gray-700">{msg.contenu}</p>
//               <p className="text-xs text-gray-500">{new Date(msg.date_envoi).toLocaleString()}</p>
//             </div>
//           ))}
//         </div>
//         <div>
//           <h3 className="font-semibold text-gray-700 mb-2">📤 Envoyés</h3>
//           {envoyes.map(msg => (
//             <div key={msg.id} className="p-3 border rounded bg-white mb-2">
//               <p className="text-sm font-medium">À : {msg.destinataire}</p>
//               <p className="text-sm">Objet : {msg.objet}</p>
//               <p className="text-sm text-gray-700">{msg.contenu}</p>
//               <p className="text-xs text-gray-500">{new Date(msg.date_envoi).toLocaleString()}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Messagerie;
