import React, { useState, useEffect } from 'react';
import { getCurrentUser, getCurrentUserEmail, getCurrentUserRole } from './utils.js';

function DisponibilitesMedecin() {
  const [horaires, setHoraires] = useState({
    lundi: { matin: { active: false, debut: '', fin: '' }, apresMidi: { active: false, debut: '', fin: '' } },
    mardi: { matin: { active: false, debut: '', fin: '' }, apresMidi: { active: false, debut: '', fin: '' } },
    mercredi: { matin: { active: false, debut: '', fin: '' }, apresMidi: { active: false, debut: '', fin: '' } },
    jeudi: { matin: { active: false, debut: '', fin: '' }, apresMidi: { active: false, debut: '', fin: '' } },
    vendredi: { matin: { active: false, debut: '', fin: '' }, apresMidi: { active: false, debut: '', fin: '' } },
    samedi: { matin: { active: false, debut: '', fin: '' }, apresMidi: { active: false, debut: '', fin: '' } },
    dimanche: { matin: { active: false, debut: '', fin: '' }, apresMidi: { active: false, debut: '', fin: '' } },
  });

  const jours = Object.keys(horaires);

  // Charger disponibilités existantes au montage
  useEffect(() => {
    const email = getCurrentUserEmail();

    fetch(`http://localhost:8000/api/disponibilites/${email}/`)
      .then(res => res.json())
      .then(data => {
        if (data && data.disponibilite && data.disponibilite.length > 0) {
          const newHoraires = { ...horaires };
          data.disponibilite.forEach(dispo => {
            const jour = dispo.jour.toLowerCase();
            if (newHoraires[jour]) {
              newHoraires[jour].matin = {
                active: dispo.matin_debut && dispo.matin_fin ? true : false,
                debut: dispo.matin_debut || '',
                fin: dispo.matin_fin || ''
              };
              newHoraires[jour].apresMidi = {
                active: dispo.apresmidi_debut && dispo.apresmidi_fin ? true : false,
                debut: dispo.apresmidi_debut || '',
                fin: dispo.apresmidi_fin || ''
              };
            }
          });
          setHoraires(newHoraires);
        }
      })
      .catch(err => console.error("Erreur chargement disponibilités :", err));
  }, []);

  // Mise à jour en temps réel
  const handleHoraireChange = (jour, type, field, value) => {
    setHoraires(prev => ({
      ...prev,
      [jour]: {
        ...prev[jour],
        [type]: {
          ...prev[jour][type],
          [field]: value
        }
      }
    }));
  };

  // Enregistrer les modifications
  const handleSubmit = async () => {
    const email = getCurrentUserEmail();

    try {
      const response = await fetch(`http://localhost:8000/api/update/disponibilites/${email}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ horaires })
      });

      const result = await response.json();
      alert(result.message || "✅ Disponibilités enregistrées avec succès !");
    } catch (error) {
      console.error("Erreur API :", error);
      alert("❌ Erreur lors de l'enregistrement des disponibilités");
    }
  };

  // Styles améliorés
  const styles = {
    container: {
      padding: '30px',
      maxWidth: '900px',
      margin: '0 auto',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    header: {
      color: '#226D68',
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '25px',
      borderBottom: '2px solid #C9E3CC',
      paddingBottom: '15px',
    },
    jourContainer: {
      marginBottom: '25px',
      backgroundColor: 'white',
      padding: '15px 20px',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e0e0e0',
    },
    jourTitle: {
      color: '#226D68',
      fontWeight: 'bold',
      fontSize: '18px',
      marginBottom: '12px',
      display: 'block',
    },
    periodBlock: {
      marginLeft: '20px',
      marginBottom: '12px',
      padding: '10px',
      borderLeft: '3px solid #C9E3CC',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      fontWeight: '500',
      color: '#444',
      marginBottom: '10px',
    },
    checkbox: {
      marginRight: '10px',
      width: '18px',
      height: '18px',
      accentColor: '#226D68',
    },
    timeContainer: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: '28px',
      backgroundColor: '#f0f7f1',
      padding: '10px 15px',
      borderRadius: '6px',
    },
    timeLabel: {
      marginRight: '10px',
      fontWeight: '500',
      color: '#555',
    },
    timeInput: {
      padding: '8px 12px',
      borderRadius: '4px',
      border: '1px solid #C9E3CC',
      marginLeft: '5px',
      marginRight: '10px',
      color: '#333',
    },
    button: {
      marginTop: '25px',
      padding: '12px 25px',
      fontWeight: 'bold',
      backgroundColor: '#226D68',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      boxShadow: '0 4px 8px rgba(34, 109, 104, 0.2)',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
    },
    periodTitle: {
      fontWeight: '600',
      color: '#226D68',
      marginBottom: '8px',
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>🗓️ Configurer mes horaires hebdomadaires</h3>

      {jours.map((jour, index) => (
        <div key={index} style={styles.jourContainer}>
          <strong style={styles.jourTitle}>{jour.charAt(0).toUpperCase() + jour.slice(1)}</strong>
          {['matin', 'apresMidi'].map((type) => (
            <div key={type} style={styles.periodBlock}>
              <div style={styles.periodTitle}>
                {type === 'matin' ? '☀️ Matin' : '🌇 Après-midi'}
              </div>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={horaires[jour][type].active}
                  onChange={(e) => handleHoraireChange(jour, type, 'active', e.target.checked)}
                  style={styles.checkbox}
                /> 
                {type === 'matin' ? 'Disponible le matin' : 'Disponible l\'après-midi'}
              </label>
              {horaires[jour][type].active && (
                <div style={styles.timeContainer}>
                  <span style={styles.timeLabel}>De</span>
                  <input
                    type="time"
                    value={horaires[jour][type].debut}
                    onChange={(e) => handleHoraireChange(jour, type, 'debut', e.target.value)}
                    style={styles.timeInput}
                  />
                  <span style={styles.timeLabel}>à</span>
                  <input
                    type="time"
                    value={horaires[jour][type].fin}
                    onChange={(e) => handleHoraireChange(jour, type, 'fin', e.target.value)}
                    style={styles.timeInput}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      <button 
        onClick={handleSubmit} 
        style={styles.button}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#184D49'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#226D68'}
      >
        💾 Enregistrer Disponibilités
      </button>
    </div>
  );
}

export default DisponibilitesMedecin;