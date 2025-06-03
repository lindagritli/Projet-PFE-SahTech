import React, { useEffect, useState } from "react";
import { getCurrentUserEmail, getCurrentUserRole } from '../components/utils.js';

function Facture() {
  const email = getCurrentUserEmail();
  const role = getCurrentUserRole();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const dateDuJour = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const numeroFacture = Math.floor(Math.random() * 100000) + 1;
  const montantHT = 50.43;
  const tva = 9.57;
  const montantTTC = montantHT + tva;

  useEffect(() => {
    if (!email || !role) return;

    const endpoint = role === 'patient' ? 'patient' : 'medecin';
    fetch(`http://127.0.0.1:8000/api/${endpoint}/${email}/`)
      .then(res => {
        if (!res.ok) throw new Error('Utilisateur non trouvé');
        return res.json();
      })
      .then(data => {
        setNom(data.nom);
        setPrenom(data.prenom);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [email, role]);

  if (isLoading) {
    return <div className="text-center mt-20 text-gray-600">Chargement...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-xl font-bold text-center mb-6 text-green-700">
        Merci pour votre paiement – rendez-vous médical en ligne
      </h1>

      <ul className="text-sm text-gray-700 mb-4">
        <li className="font-semibold">{prenom} {nom}</li>
        <li className="text-gray-600">Facture n°{numeroFacture}</li>
        <li className="text-gray-600">{dateDuJour}</li>
      </ul>

      <hr className="my-4 border-gray-300" />

      <div className="flex justify-between mb-2">
        <span>Consultation médicale (HT)</span>
        <span className="font-medium text-gray-800">{montantHT.toFixed(2)} TND</span>
      </div>

      <div className="flex justify-between mb-2">
        <span>TVA (19%)</span>
        <span className="font-medium text-gray-800">{tva.toFixed(2)} TND</span>
      </div>

      <hr className="my-4 border-black" />

      <div className="flex justify-end text-lg font-bold text-black">
        Total TTC : {montantTTC.toFixed(2)} TND
      </div>

      <hr className="my-4 border-black" />

      <div className="text-center mt-12 text-sm text-gray-600">
        <p className="mt-2">Ceci est une facture générée automatiquement. Merci pour votre confiance.</p>
      </div>
    </div>
  );
}

export default Facture;
