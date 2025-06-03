import React, { useEffect, useState } from 'react';
import { getCurrentUser, getCurrentUserEmail, getCurrentUserRole } from './utils.js';

function CongeMedecin() {
  const [conges, setConges] = useState([]);
  const [nouveauConge, setNouveauConge] = useState({
    start_date: '',
    start_period: 'matin',
    end_date: '',
    end_period: 'apres-midi',
    motif: ''
  });
  const [loading, setLoading] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  const chargerConges = async () => {
    setLoading(true);
    const email = getCurrentUserEmail();
    try {
      const res = await fetch(`http://localhost:8000/api/conges/${email}/`);
      const data = await res.json();
      setConges(data);
      console.log("✅ Congés chargés :", data);
    } catch (error) {
      console.error('❌ Erreur chargement congés:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    chargerConges();
  }, []);

  const handleAdd = async () => {
    const email = getCurrentUserEmail();
    try {
      const res = await fetch(`http://localhost:8000/api/conge/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...nouveauConge })
      });
      if (res.ok) {
        setNouveauConge({
          start_date: '',
          start_period: 'matin',
          end_date: '',
          end_period: 'apres-midi',
          motif: ''
        });
        await chargerConges();
        alert("✅ Congé ajouté !");
      }
    } catch (error) {
      console.error('❌ Erreur ajout congé:', error);
    }
  };

  const handleSave = async (id_conge, updatedConge) => {
    try {
      const res = await fetch(`http://localhost:8000/api/conge/update/${id_conge}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedConge)
      });
      if (res.ok) {
        await chargerConges();
        alert("✅ Congé modifié !");
      }
    } catch (error) {
      console.error('❌ Erreur modification congé:', error);
    }
  };

  const handleDelete = async (id_conge) => {
    if (!window.confirm("❗Confirmer la suppression du congé ?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/conge/delete/${id_conge}/`, {
        method: "DELETE"
      });
      if (res.ok) {
        await chargerConges();
        alert("✅ Congé supprimé !");
      }
    } catch (error) {
      console.error('❌ Erreur suppression congé:', error);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedConges = [...conges];
    updatedConges[index][field] = value;
    setConges(updatedConges);
  };

  // Styles modernes
  const styles = {
    container: {
      padding: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    header: {
      color: '#1E3A8A',
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '30px',
      borderBottom: '2px solid #E5EDFF',
      paddingBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    loadingIndicator: {
      padding: '15px',
      backgroundColor: '#EFF6FF',
      borderRadius: '8px',
      color: '#3B82F6',
      fontWeight: '500',
      display: 'inline-block',
      marginBottom: '20px',
    },
    formContainer: {
      marginBottom: '40px',
      padding: '24px',
      backgroundColor: '#F9FAFC',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      border: '1px solid #EDF2F7',
    },
    formTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1E3A8A',
      marginBottom: '20px',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '16px',
      alignItems: 'center',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#4B5563',
    },
    input: {
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #E5E7EB',
      fontSize: '15px',
      width: '100%',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      outline: 'none',
    },
    inputFocus: {
      borderColor: '#3B82F6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
    },
    select: {
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #E5E7EB',
      fontSize: '15px',
      width: '100%',
      backgroundColor: 'white',
      cursor: 'pointer',
      outline: 'none',
    },
    arrow: {
      fontSize: '20px',
      color: '#3B82F6',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButton: {
      backgroundColor: '#10B981',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '15px',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
      justifySelf: 'end',
    },
    addButtonHover: {
      backgroundColor: '#059669',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 16px rgba(16, 185, 129, 0.3)',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0',
      overflow: 'hidden',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    },
    thead: {
      backgroundColor: '#F3F4F6',
    },
    th: {
      padding: '16px',
      textAlign: 'left',
      fontWeight: '600',
      color: '#4B5563',
      borderBottom: '2px solid #E5E7EB',
      fontSize: '14px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    tr: {
      backgroundColor: 'white',
      transition: 'background-color 0.2s ease',
    },
    trHover: {
      backgroundColor: '#F9FAFB',
    },
    td: {
      padding: '16px',
      borderBottom: '1px solid #E5E7EB',
      fontSize: '15px',
    },
    actionCell: {
      display: 'flex',
      gap: '8px',
    },
    saveButton: {
      backgroundColor: '#3B82F6',
      color: 'white',
      padding: '8px 12px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)',
    },
    saveButtonHover: {
      backgroundColor: '#2563EB',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    },
    deleteButton: {
      backgroundColor: '#EF4444',
      color: 'white',
      padding: '8px 12px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)',
    },
    deleteButtonHover: {
      backgroundColor: '#DC2626',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
    },
    tableInput: {
      padding: '10px 14px',
      borderRadius: '6px',
      border: '1px solid #E5E7EB',
      fontSize: '14px',
      width: '100%',
      outline: 'none',
    },
    tableSelect: {
      padding: '10px 14px',
      borderRadius: '6px',
      border: '1px solid #E5E7EB',
      fontSize: '14px',
      width: '100%',
      backgroundColor: 'white',
      cursor: 'pointer',
      outline: 'none',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: '#6B7280',
      backgroundColor: '#F9FAFB',
      borderRadius: '12px',
      border: '1px dashed #D1D5DB',
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>
        <span>🗓️</span> Gestion des Congés
      </h2>

      {loading && <div style={styles.loadingIndicator}>⏳ Chargement des données...</div>}

      {/* Formulaire Ajout */}
      <div style={styles.formContainer}>
        <h3 style={styles.formTitle}>Ajouter un nouveau congé</h3>
        <div style={styles.formGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Date de début</label>
            <input
              type="date"
              value={nouveauConge.start_date}
              onChange={(e) => setNouveauConge({ ...nouveauConge, start_date: e.target.value })}
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Période</label>
            <select
              value={nouveauConge.start_period}
              onChange={(e) => setNouveauConge({ ...nouveauConge, start_period: e.target.value })}
              style={styles.select}
            >
              <option value="matin">Matin</option>
              <option value="apres-midi">Après-midi</option>
            </select>
          </div>
          
          <div style={styles.arrow}>➔</div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Date de fin</label>
            <input
              type="date"
              value={nouveauConge.end_date}
              onChange={(e) => setNouveauConge({ ...nouveauConge, end_date: e.target.value })}
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Période</label>
            <select
              value={nouveauConge.end_period}
              onChange={(e) => setNouveauConge({ ...nouveauConge, end_period: e.target.value })}
              style={styles.select}
            >
              <option value="matin">Matin</option>
              <option value="apres-midi">Après-midi</option>
            </select>
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Motif</label>
            <input
              type="text"
              placeholder="Motif du congé"
              value={nouveauConge.motif}
              onChange={(e) => setNouveauConge({ ...nouveauConge, motif: e.target.value })}
              style={styles.input}
            />
          </div>
          
          <button 
            onClick={handleAdd} 
            style={{
              ...styles.addButton,
              ...(hoveredButton === 'add' ? styles.addButtonHover : {})
            }}
            onMouseEnter={() => setHoveredButton('add')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <span>➕</span> Ajouter
          </button>
        </div>
      </div>

      {/* Liste des Congés */}
      {conges.length > 0 ? (
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>Début</th>
              <th style={styles.th}>Période Début</th>
              <th style={styles.th}>Fin</th>
              <th style={styles.th}>Période Fin</th>
              <th style={styles.th}>Motif</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {conges.map((conge, index) => (
              <tr 
                key={conge.id_conge}
                style={{
                  ...styles.tr,
                  ...(hoveredRow === index ? styles.trHover : {})
                }}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={styles.td}>
                  <input
                    type="date"
                    value={conge.start_date || ''}
                    onChange={(e) => handleInputChange(index, 'start_date', e.target.value)}
                    style={styles.tableInput}
                  />
                </td>
                <td style={styles.td}>
                  <select
                    value={conge.start_period}
                    onChange={(e) => handleInputChange(index, 'start_period', e.target.value)}
                    style={styles.tableSelect}
                  >
                    <option value="matin">Matin</option>
                    <option value="apres-midi">Après-midi</option>
                  </select>
                </td>
                <td style={styles.td}>
                  <input
                    type="date"
                    value={conge.end_date || ''}
                    onChange={(e) => handleInputChange(index, 'end_date', e.target.value)}
                    style={styles.tableInput}
                  />
                </td>
                <td style={styles.td}>
                  <select
                    value={conge.end_period}
                    onChange={(e) => handleInputChange(index, 'end_period', e.target.value)}
                    style={styles.tableSelect}
                  >
                    <option value="matin">Matin</option>
                    <option value="apres-midi">Après-midi</option>
                  </select>
                </td>
                <td style={styles.td}>
                  <input
                    type="text"
                    value={conge.motif || ''}
                    onChange={(e) => handleInputChange(index, 'motif', e.target.value)}
                    style={styles.tableInput}
                  />
                </td>
                <td style={{...styles.td, ...styles.actionCell}}>
                  <button
                    onClick={() => handleSave(conge.id_conge, conges[index])}
                    style={{
                      ...styles.saveButton,
                      ...(hoveredButton === `save-${index}` ? styles.saveButtonHover : {})
                    }}
                    onMouseEnter={() => setHoveredButton(`save-${index}`)}
                    onMouseLeave={() => setHoveredButton(null)}
                    title="Enregistrer les modifications"
                  >
                    💾
                  </button>
                  <button
                    onClick={() => handleDelete(conge.id_conge)}
                    style={{
                      ...styles.deleteButton,
                      ...(hoveredButton === `delete-${index}` ? styles.deleteButtonHover : {})
                    }}
                    onMouseEnter={() => setHoveredButton(`delete-${index}`)}
                    onMouseLeave={() => setHoveredButton(null)}
                    title="Supprimer ce congé"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : !loading && (
        <div style={styles.emptyState}>
          <p>Aucun congé enregistré. Utilisez le formulaire ci-dessus pour ajouter votre premier congé.</p>
        </div>
      )}
    </div>
  );
}

export default CongeMedecin;