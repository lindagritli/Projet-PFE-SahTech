import React, { useEffect, useState } from 'react';
import { getCurrentUserEmail } from './utils.js';

function ProfilPatient() {
  const email = getCurrentUserEmail();

  const [data, setData] = useState({
    nom: "", prenom: "", numero_telephone: "",
    adresse: "", date_naissance: "", groupe_sanguin: "",
    ville: "", photo: ""
  });

  const [editMode, setEditMode] = useState(false);
  const [nouveau, setNouveau] = useState(false);
  const [villes, setVilles] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Charger les données patient
  useEffect(() => {
    if (!email) return;

    fetch(`http://127.0.0.1:8000/api/patient/${email}/`)
      .then(res => {
        if (res.status === 404) {
          setEditMode(true);
          setNouveau(true);
        }
        return res.json();
      })
      .then(res => {
        if (res) {
          setData(res);
          if (res.photo) {
            setPhotoPreview(res.photo);
          }
        }
      });
  }, [email]);

  // Charger les villes
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/villes/')
      .then(res => res.json())
      .then(setVilles)
      .catch(err => console.error("Erreur chargement des villes:", err));
  }, []);

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

  const handleSave = async () => {
    const method = nouveau ? "POST" : "PUT";
    const url = nouveau
      ? "http://127.0.0.1:8000/api/patient/create/"
      : `http://127.0.0.1:8000/api/patient/update/${email}/`;

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, email })
    });

    const result = await response.json();

    if (response.ok) {
      alert("✅ Données enregistrées");
      setEditMode(false);
      setNouveau(false);
    } else {
      alert("❌ Erreur: " + (result.error || "Inconnue"));
    }
  };

  const fields = [
    'prenom', 'nom', 'genre', 'ville', 
    'adresse', 'numero_telephone', 'date_naissance', 
    'groupe_sanguin'
  ];

  // Labels plus professionnels
  const fieldLabels = {
    prenom: "Prénom",
    nom: "Nom",
    genre: "Genre",
    ville: "Ville",
    adresse: "Adresse",
    numero_telephone: "Téléphone",
    date_naissance: "Date de naissance",
    groupe_sanguin: "Groupe sanguin"
  };

  // Styles modernes et professionnels avec taille réduite
  const styles = {
    container: {
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '0.9rem',
    },
    header: {
      background: 'linear-gradient(to right, #226D68, #2A8A85)',
      padding: '12px 16px',
      color: 'white',
    },
    headerTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      margin: '0 0 2px 0',
    },
    headerSubtitle: {
      fontSize: '12px',
      opacity: 0.8,
      margin: 0,
      color: '#C9E3CC',
    },
    content: {
      padding: '16px',
    },
    photoSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '16px',
      padding: '12px',
      backgroundColor: 'rgba(201, 227, 204, 0.2)',
      borderRadius: '6px',
    },
    photoLabel: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#226D68',
      marginBottom: '10px',
    },
    photoContainer: {
      position: 'relative',
      marginBottom: '12px',
    },
    photoPreview: {
      width: '100px',
      height: '100px',
      objectFit: 'cover',
      borderRadius: '50%',
      border: '3px solid #226D68',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    photoPreviewHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
    },
    photoUploadLabel: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px 16px',
      backgroundColor: '#226D68',
      color: 'white',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: '500',
      fontSize: '13px',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
    },
    photoUploadLabelHover: {
      backgroundColor: '#184D49',
      transform: 'translateY(-1px)',
      boxShadow: '0 3px 8px rgba(0, 0, 0, 0.15)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
    },
    fieldContainer: {
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
    },
    fieldContainerActive: {
      boxShadow: '0 2px 8px rgba(34, 109, 104, 0.12)',
      borderColor: '#226D68',
    },
    fieldHeader: {
      padding: '6px 10px',
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #f0f0f0',
    },
    fieldLabel: {
      display: 'block',
      fontSize: '12px',
      fontWeight: '500',
      color: '#4b5563',
    },
    fieldContent: {
      padding: '8px 10px',
    },
    input: {
      width: '100%',
      padding: '6px 8px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '13px',
      transition: 'all 0.2s ease',
      outline: 'none',
    },
    inputFocus: {
      borderColor: 'transparent',
      boxShadow: '0 0 0 2px #226D68',
    },
    select: {
      width: '100%',
      padding: '6px 8px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '13px',
      transition: 'all 0.2s ease',
      outline: 'none',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 8px center',
      backgroundSize: '12px',
    },
    selectFocus: {
      borderColor: 'transparent',
      boxShadow: '0 0 0 2px #226D68',
    },
    value: {
      padding: '3px 0',
      fontSize: '13px',
      color: '#1f2937',
      fontWeight: '500',
    },
    emptyValue: {
      color: '#9ca3af',
      fontStyle: 'italic',
    },
    buttonContainer: {
      marginTop: '20px',
      display: 'flex',
      justifyContent: 'center',
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '8px 16px',
      backgroundColor: '#226D68',
      color: 'white',
      fontWeight: '500',
      borderRadius: '4px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '13px',
    },
    buttonHover: {
      backgroundColor: '#184D49',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
    },
    saveButton: {
      backgroundColor: '#3A8A7B',
    },
    saveButtonHover: {
      backgroundColor: '#2D6D61',
    },
    icon: {
      marginRight: '5px',
      display: 'inline-block',
      width: '14px',
      height: '14px',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>Dossier Patient</h2>
        <p style={styles.headerSubtitle}>Informations personnelles et médicales</p>
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
                  ) : field === "date_naissance" ? (
                    <input
                      id={field}
                      type="date"
                      name="date_naissance"
                      value={data.date_naissance || ""}
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
                      type="text"
                      name={field}
                      value={data[field] || ""}
                      onChange={handleChange}
                      onFocus={() => setActiveField(field)}
                      onBlur={() => setActiveField(null)}
                      style={{
                        ...styles.input,
                        ...(activeField === field ? styles.inputFocus : {})
                      }}
                      placeholder={`Entrez ${fieldLabels[field].toLowerCase()}`}
                    />
                  )
                ) : (
                  <div style={data[field] ? styles.value : {...styles.value, ...styles.emptyValue}}>
                    {field === "ville"
                      ? villes.find(v => v.id === data.ville)?.nom || "-"
                      : data[field] || "-"}
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
                ...(hoveredButton ? styles.buttonHover : {})
              }}
              onMouseEnter={() => setHoveredButton(true)}
              onMouseLeave={() => setHoveredButton(false)}
            >
              <span style={styles.icon}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </span>
              Modifier mon profil
            </button>
          ) : (
            <button
              onClick={handleSave}
              style={{
                ...styles.button,
                ...styles.saveButton,
                ...(hoveredButton ? styles.saveButtonHover : {})
              }}
              onMouseEnter={() => setHoveredButton(true)}
              onMouseLeave={() => setHoveredButton(false)}
            >
              <span style={styles.icon}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              Enregistrer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilPatient;