import React, { useEffect, useState } from 'react';
import { getCurrentUserEmail } from './utils.js';

function ProfilMedecin() {
  const email = getCurrentUserEmail();

  const [data, setData] = useState({
    nom: "", prenom: "", numero_telephone: "", specialite: "",
    adresse: "", debut_carriere: "", prix_consultation: "",
    genre: "", ville: "", etablissement: "", titre_professionnel: "",
    photo: ""
  });

  const [editMode, setEditMode] = useState(false);
  const [nouveau, setNouveau] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [activeField, setActiveField] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  const [villes, setVilles] = useState([]);
  const [etablissements, setEtablissements] = useState([]);
  const [specialites, setSpecialites] = useState([]);

  // 🔁 Charger villes, établissements, spécialités
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/villes/")
      .then(res => res.json())
      .then(setVilles);

    fetch("http://127.0.0.1:8000/api/etablissements/")
      .then(res => res.json())
      .then(setEtablissements);

    fetch("http://127.0.0.1:8000/api/specialites/")
      .then(res => res.json())
      .then(setSpecialites);
  }, []);

  // 🔁 Charger profil
  useEffect(() => {
    if (!email) return;

    fetch(`http://127.0.0.1:8000/api/medecin/${email}/`)
      .then(res => {
        if (res.status === 404) {
          setEditMode(true);
          setNouveau(true);
        }
        return res.json();
      })
      .then(res => {
        if (res) {
          if (res.debut_carriere) {
            res.debut_carriere = formatDateForInput(res.debut_carriere);
          }
          setData(res);
          if (res.photo) {
            setPhotoPreview(res.photo);
          }
        }
      });
  }, [email]);

  const handleChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setData({ ...data, photo: base64String });
        setPhotoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    try {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (e) {
      console.error("Erreur de formatage de date:", e);
    }
    
    return '';
  };

  const handleSave = async () => {
    const method = nouveau ? "POST" : "PUT";
    const url = nouveau
      ? "http://127.0.0.1:8000/api/medecin/create/"
      : `http://127.0.0.1:8000/api/medecin/update/${email}/`;

    const dataToSend = {
      ...data,
      email,
      debut_carriere: data.debut_carriere ? formatDateForInput(data.debut_carriere) : null
    };

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend)
    });

    const result = await response.json();

    if (response.ok) {
      alert("✅ Données enregistrées");
      setEditMode(false);
      setNouveau(false);
      window.location.reload();
    } else {
      alert("❌ Erreur: " + (result.error || "Inconnue"));
    }
  };

  const fields = [
    "prenom", "nom", "titre_professionnel", "specialite",
    "genre", "ville", "etablissement", "adresse",
    "numero_telephone", "debut_carriere", "prix_consultation"
  ];

  // Labels pour chaque champ
  const fieldLabels = {
    prenom: "Prénom",
    nom: "Nom",
    titre_professionnel: "Titre professionnel",
    specialite: "Spécialité",
    genre: "Genre",
    ville: "Ville",
    etablissement: "Établissement",
    adresse: "Adresse",
    numero_telephone: "Téléphone",
    debut_carriere: "Début de carrière",
    prix_consultation: "Prix consultation"
  };

  // Styles modernes et professionnels avec taille réduite
   // Styles modernes et professionnels avec taille réduite
  const styles = {
    container: {
      width: '100%',
      maxWidth: '600px', // Réduit de 700px à 600px
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '0.9rem', // Ajout d'une taille de police plus petite
    },
    header: {
      background: 'linear-gradient(to right, #226D68, #2A8A85)',
      padding: '12px 16px', // Réduit de 16px 20px
      color: 'white',
    },
    headerTitle: {
      fontSize: '18px', // Réduit de 20px
      fontWeight: 'bold',
      margin: '0 0 2px 0',
    },
    headerSubtitle: {
      fontSize: '12px', // Réduit de 13px
      opacity: 0.8,
      margin: 0,
      color: '#C9E3CC',
    },
    content: {
      padding: '16px', // Réduit de 20px
    },
    photoSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '16px', // Réduit de 20px
      padding: '12px', // Réduit de 15px
      backgroundColor: 'rgba(201, 227, 204, 0.2)',
      borderRadius: '6px',
    },
    photoLabel: {
      fontSize: '13px', // Réduit de 14px
      fontWeight: '500',
      color: '#226D68',
      marginBottom: '10px', // Réduit de 12px
    },
    photoContainer: {
      position: 'relative',
      marginBottom: '12px', // Réduit de 15px
    },
    photoPreview: {
      width: '100px', // Réduit de 120px
      height: '100px', // Réduit de 120px
      objectFit: 'cover',
      borderRadius: '50%',
      border: '3px solid #226D68',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px', // Réduit de 16px
    },
    fieldContainer: {
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
    },
    fieldHeader: {
      padding: '6px 10px', // Réduit de 8px 12px
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #f0f0f0',
    },
    fieldLabel: {
      display: 'block',
      fontSize: '12px', // Réduit de 13px
      fontWeight: '500',
      color: '#4b5563',
    },
    fieldContent: {
      padding: '8px 10px', // Réduit de 10px 12px
    },
    input: {
      width: '100%',
      padding: '6px 8px', // Réduit de 8px 10px
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '13px', // Réduit de 14px
      transition: 'all 0.2s ease',
      outline: 'none',
    },
    select: {
      width: '100%',
      padding: '6px 8px', // Réduit de 8px 10px
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '13px', // Réduit de 14px
      transition: 'all 0.2s ease',
      outline: 'none',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 8px center', // Ajusté
      backgroundSize: '12px', // Réduit de 14px
    },
    value: {
      padding: '3px 0', // Réduit de 4px 0
      fontSize: '13px', // Réduit de 14px
      color: '#1f2937',
      fontWeight: '500',
    },
    buttonContainer: {
      marginTop: '20px', // Réduit de 24px
      display: 'flex',
      justifyContent: 'center',
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '8px 16px', // Réduit de 10px 20px
      backgroundColor: '#226D68',
      color: 'white',
      fontWeight: '500',
      borderRadius: '4px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '13px', // Réduit de 14px
    },
    icon: {
      marginRight: '5px', // Réduit de 6px
      display: 'inline-block',
      width: '14px', // Réduit de 16px
      height: '14px', // Réduit de 16px
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>Dossier Médecin</h2>
        <p style={styles.headerSubtitle}>Informations professionnelles et personnelles</p>
      </div>
      
      <div style={styles.content}>
        {/* Section Photo de profil */}
        <div style={styles.photoSection}>
          <div style={styles.photoLabel}>Photo de profil</div>
          
          <div style={styles.photoContainer}>
            <img 
              src={photoPreview || 'https://via.placeholder.com/150'} 
              alt="Photo de profil" 
              style={{
                ...styles.photoPreview,
                ...(activeField === 'photo' ? styles.photoPreviewHover : {})
              }}
              onMouseEnter={() => setActiveField('photo')}
              onMouseLeave={() => setActiveField(null)}
            />
          </div>
          
          {editMode && (
            <div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoChange} 
                style={{ display: 'none' }} 
                id="photo-upload" 
              />
              <label 
                htmlFor="photo-upload" 
                style={{
                  ...styles.photoUploadLabel,
                  ...(activeField === 'photo-upload' ? styles.photoUploadLabelHover : {})
                }}
                onMouseEnter={() => setActiveField('photo-upload')}
                onMouseLeave={() => setActiveField(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16" style={{marginRight: '6px'}}>
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                Choisir une photo
              </label>
            </div>
          )}
        </div>

        <div style={styles.grid}>
          {fields.map((field) => (
            <div 
              key={field}
              style={{
                ...styles.fieldContainer,
                ...(activeField === field ? styles.fieldContainerActive : {})
              }}
            >
              <div style={styles.fieldHeader}>
                <label 
                  htmlFor={field}
                  style={styles.fieldLabel}
                >
                  {fieldLabels[field]}
                </label>
              </div>
              
              <div style={styles.fieldContent}>
                {editMode ? (
                  field === "ville" ? (
                    <select 
                      id={field}
                      name="ville" 
                      value={data.ville || ""} 
                      onChange={handleChange}
                      onFocus={() => setActiveField(field)}
                      onBlur={() => setActiveField(null)}
                      style={{
                        ...styles.select,
                        ...(activeField === field ? styles.selectFocus : {})
                      }}
                    >
                      <option value="">-- Sélectionner --</option>
                      {villes.map(v => <option key={v.id} value={v.id}>{v.nom}</option>)}
                    </select>
                  ) : field === "etablissement" ? (
                    <select 
                      id={field}
                      name="etablissement" 
                      value={data.etablissement || ""} 
                      onChange={handleChange}
                      onFocus={() => setActiveField(field)}
                      onBlur={() => setActiveField(null)}
                      style={{
                        ...styles.select,
                        ...(activeField === field ? styles.selectFocus : {})
                      }}
                    >
                      <option value="">-- Sélectionner --</option>
                      {etablissements.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}
                    </select>
                  ) : field === "genre" ? (
                    <select 
                      id={field}
                      name="genre" 
                      value={data.genre || ""} 
                      onChange={handleChange}
                      onFocus={() => setActiveField(field)}
                      onBlur={() => setActiveField(null)}
                      style={{
                        ...styles.select,
                        ...(activeField === field ? styles.selectFocus : {})
                      }}
                    >
                      <option value="">-- Choisir --</option>
                      <option value="Homme">Homme</option>
                      <option value="Femme">Femme</option>
                    </select>
                  ) : field === "titre_professionnel" ? (
                    <select 
                      id={field}
                      name="titre_professionnel" 
                      value={data.titre_professionnel || ""} 
                      onChange={handleChange}
                      onFocus={() => setActiveField(field)}
                      onBlur={() => setActiveField(null)}
                      style={{
                        ...styles.select,
                        ...(activeField === field ? styles.selectFocus : {})
                      }}
                    >
                      <option value="">-- Sélectionner --</option>
                      <option value="Docteur">Docteur</option>
                      <option value="Assistant">Assistant</option>
                      <option value="Maître-assistant">Maître-assistant</option>
                      <option value="Maître de conférences">Maître de conférences</option>
                      <option value="Professeur">Professeur</option>
                      <option value="Chef de service">Chef de service</option>
                    </select>
                                   ) : field === "specialite" ? (
                    <select 
                      id={field}
                      name="specialite" 
                      value={data.specialite || ""} 
                      onChange={handleChange}
                      onFocus={() => setActiveField(field)}
                      onBlur={() => setActiveField(null)}
                      style={{
                        ...styles.select,
                        ...(activeField === field ? styles.selectFocus : {})
                      }}
                    >
                      <option value="">-- Sélectionner --</option>
                      {specialites.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                    </select>
                  ) : field === "debut_carriere" ? (
                    <input
                      id={field}
                      type="date"
                      name="debut_carriere"
                      value={data.debut_carriere || ""}
                      onChange={handleChange}
                      onFocus={() => setActiveField(field)}
                      onBlur={() => setActiveField(null)}
                      style={{
                        ...styles.input,
                        ...(activeField === field ? styles.inputFocus : {})
                      }}
                    />
                  ) : (
                    <input
                      id={field}
                      type={field === "prix_consultation" ? "number" : "text"}
                      name={field}
                      value={data[field] || ""}
                      onChange={handleChange}
                      onFocus={() => setActiveField(field)}
                      onBlur={() => setActiveField(null)}
                      style={{
                        ...styles.input,
                        ...(activeField === field ? styles.inputFocus : {})
                      }}
                    />
                  )
                ) : (
                  <div style={{
                    ...styles.value,
                    ...(data[field] ? {} : styles.emptyValue)
                  }}>
                    {field === "ville" 
                      ? (villes.find(v => v.id === data.ville)?.nom || "Non spécifié")
                      : field === "etablissement" 
                        ? (etablissements.find(e => e.id === data.etablissement)?.nom || "Non spécifié")
                        : field === "specialite"
                          ? (specialites.find(s => s.id === data.specialite)?.nom || "Non spécifié")
                          : data[field] || "Non spécifié"}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.buttonContainer}>
          {!editMode ? (
            <button 
              onClick={() => setEditMode(true)} 
              style={{
                ...styles.button,
                ...(hoveredButton === 'edit' ? styles.buttonHover : {})
              }}
              onMouseEnter={() => setHoveredButton('edit')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={styles.icon}>
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Modifier mon profil
            </button>
          ) : (
            <button 
              onClick={handleSave} 
              style={{
                ...styles.button,
                ...styles.saveButton,
                ...(hoveredButton === 'save' ? styles.saveButtonHover : {})
              }}
              onMouseEnter={() => setHoveredButton('save')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={styles.icon}>
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Enregistrer les modifications
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilMedecin;