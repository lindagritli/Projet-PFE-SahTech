import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form, Badge, Card } from 'react-bootstrap';
import { getCurrentUserEmail } from './utils';
import { FaStar, FaEdit, FaSave, FaTimes, FaVideo, FaBan } from 'react-icons/fa';

function MedecinRendezVous() {
  const email = getCurrentUserEmail();
  const [rendezvous, setRendezvous] = useState([]);
  const [patientsNoms, setPatientsNoms] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [updates, setUpdates] = useState({});

  // Palette de couleurs basée sur le mélange de #C9E3CC et #226D68
  const colors = {
    lightGreen: '#C9E3CC',
    darkGreen: '#226D68',
    mediumGreen: '#75A89A',
    lightAccent: '#E0EFE2',
    darkAccent: '#184D49',
    headerBg: '#A7C9B8',
    tableBorder: '#8BBCAD',
    hoverBg: '#D8EAD9',
    buttonPrimary: '#226D68',
    buttonSuccess: '#3A8A7B',
    buttonDanger: '#B55B52',
    buttonInfo: '#5B9E99'
  };

  const MODES = ['présentiel', 'à distance'];
  const STATUTS = ['en attente', 'confirmé', 'annulé', 'terminé'];
  const TYPES = ['consultation', 'contrôle'];
  const labels = ['Mauvais', 'Passable', 'Bien', 'Très bien', 'Excellent'];
  const labelColors = ['#B55B52', '#D68F59', '#D6C559', '#75A89A', '#226D68'];

  useEffect(() => {
    fetchRendezvous();
  }, []);

  const fetchRendezvous = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/rendezvous/medecin/${email}/`);
      const rdvs = res.data;
      rdvs.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRendezvous(rdvs);

      const nomsTemp = {};
      for (let rdv of rdvs) {
        const id = rdv.patient;
        if (!nomsTemp[id]) {
          const nomRes = await axios.get(`http://localhost:8000/api/user-nom-prenom/${id}/`);
          const data = nomRes.data;
          nomsTemp[id] = `${data.nom.toUpperCase()} ${data.prenom.toLowerCase()}`;
        }
      }
      setPatientsNoms(nomsTemp);
    } catch (err) {
      console.error("Erreur chargement rendez-vous médecin", err);
    }
  };

  const startEdit = (rdv) => {
    setEditingId(rdv.id);
    setUpdates({
      date: rdv.date,
      heure: rdv.heure,
      type_consultation: rdv.type_consultation,
      mode: rdv.mode,
      statut: rdv.statut,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setUpdates({});
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/rendezvous/update/${id}/`, updates);
      setEditingId(null);
      setUpdates({});
      fetchRendezvous();
    } catch (err) {
      console.error("Erreur lors de la mise à jour du RDV", err);
    }
  };

  const handleChange = (field, value) => {
    setUpdates((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnnuler = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/rendezvous/${id}/annuler/`, {
        motif_annulation: "Annulé par le médecin"
      });
      fetchRendezvous();
    } catch (err) {
      console.error("Erreur annulation médecin :", err);
    }
  };

  const getTypeBadge = (type) => (
    <Badge 
      bg={type === 'consultation' ? 'primary' : 'info'} 
      style={{ 
        padding: '6px 10px', 
        borderRadius: '20px', 
        fontWeight: '500',
        fontSize: '0.85rem',
        backgroundColor: type === 'consultation' ? colors.darkGreen : colors.headerBg,
        color: 'white'
      }}
    >
      {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
    </Badge>
  );

  const getModeBadge = (mode) => (
    <Badge 
      bg={mode === 'à distance' ? 'info' : 'primary'} 
      style={{ 
        padding: '6px 10px', 
        borderRadius: '20px', 
        fontWeight: '500',
        fontSize: '0.85rem',
        backgroundColor: mode === 'à distance' ? colors.mediumGreen : colors.darkGreen,
        color: 'white'
      }}
    >
      {mode.charAt(0).toUpperCase() + mode.slice(1)}
    </Badge>
  );

  const getStatusBadge = (statut) => {
    let bgColor;
    switch(statut) {
      case 'en attente':
        bgColor = '#D6C559';
        break;
      case 'confirmé':
        bgColor = colors.buttonSuccess;
        break;
      case 'annulé':
        bgColor = colors.buttonDanger;
        break;
      default:
        bgColor = colors.mediumGreen;
    }
    
    return (
      <Badge 
        style={{ 
          padding: '8px 12px', 
          borderRadius: '20px', 
          fontWeight: '500',
          fontSize: '0.85rem',
          backgroundColor: bgColor,
          color: statut === 'en attente' ? '#333' : 'white'
        }}
      >
        {statut.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const cellStyle = {
    padding: '16px 12px',
    verticalAlign: 'middle',
    borderTop: 'none'
  };

  return (
    <div className="container mt-5">
      <Card style={{
        borderRadius: '12px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
        border: 'none',
        overflow: 'hidden',
        backgroundColor: colors.lightAccent
      }}>
        <Card.Body className="p-4">
          <h4 className="mb-4" style={{ fontWeight: '700', color: colors.darkGreen }}>
            <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>📅</span> 
            Rendez-vous de mes patients
          </h4>
          
          <div className="table-responsive">
            <Table hover style={{
              borderCollapse: 'separate',
              borderSpacing: '0 8px'
            }}>
              <thead>
                <tr>
                  <th style={{
                    backgroundColor: colors.headerBg,
                    color: colors.darkAccent,
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '16px 12px',
                    borderBottom: `2px solid ${colors.tableBorder}`
                  }}>Date</th>
                  <th style={{
                    backgroundColor: colors.headerBg,
                    color: colors.darkAccent,
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '16px 12px',
                    borderBottom: `2px solid ${colors.tableBorder}`
                  }}>Heure</th>
                  <th style={{
                    backgroundColor: colors.headerBg,
                    color: colors.darkAccent,
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '16px 12px',
                    borderBottom: `2px solid ${colors.tableBorder}`
                  }}>Patient</th>
                  <th style={{
                    backgroundColor: colors.headerBg,
                    color: colors.darkAccent,
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '16px 12px',
                    borderBottom: `2px solid ${colors.tableBorder}`
                  }}>Type</th>
                  <th style={{
                    backgroundColor: colors.headerBg,
                    color: colors.darkAccent,
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '16px 12px',
                    borderBottom: `2px solid ${colors.tableBorder}`
                  }}>Mode</th>
                  <th style={{
                    backgroundColor: colors.headerBg,
                    color: colors.darkAccent,
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '16px 12px',
                    borderBottom: `2px solid ${colors.tableBorder}`
                  }}>Statut</th>
                  <th style={{
                    backgroundColor: colors.headerBg,
                    color: colors.darkAccent,
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '16px 12px',
                    borderBottom: `2px solid ${colors.tableBorder}`
                  }}>Lien Visio</th>
                  <th style={{
                    backgroundColor: colors.headerBg,
                    color: colors.darkAccent,
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '16px 12px',
                    borderBottom: `2px solid ${colors.tableBorder}`
                  }}>Actions</th>
                  <th style={{
                    backgroundColor: colors.headerBg,
                    color: colors.darkAccent,
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '16px 12px',
                    borderBottom: `2px solid ${colors.tableBorder}`
                  }}>Retours d'expérience</th>
                </tr>
              </thead>
              <tbody>
                {rendezvous.map((rdv) => (
                  <tr key={rdv.id} style={{
                    transition: 'all 0.2s',
                    backgroundColor: colors.lightGreen,
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                  }}>
                    <td style={cellStyle}>
                      {editingId === rdv.id ? (
                        <Form.Control 
                          type="date" 
                          value={updates.date} 
                          onChange={(e) => handleChange('date', e.target.value)}
                          style={{ 
                            borderRadius: '8px', 
                            padding: '10px',
                            border: `1px solid ${colors.tableBorder}`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                          }}
                        />
                      ) : (
                        <div style={{ fontWeight: '500' }}>{rdv.date}</div>
                      )}
                    </td>
                    <td style={cellStyle}>
                      {editingId === rdv.id ? (
                        <Form.Control 
                          type="time" 
                          value={updates.heure} 
                          onChange={(e) => handleChange('heure', e.target.value)}
                          style={{ 
                            borderRadius: '8px', 
                            padding: '10px',
                            border: `1px solid ${colors.tableBorder}`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                          }}
                        />
                      ) : (
                        <div style={{ fontWeight: '500' }}>{rdv.heure}</div>
                      )}
                    </td>
                    <td style={cellStyle}>
                      <div style={{ fontWeight: '600', color: colors.darkAccent }}>{patientsNoms[rdv.patient] || '⏳'}</div>
                    </td>
                    <td style={cellStyle}>
                      {editingId === rdv.id ? (
                        <Form.Select 
                          value={updates.type_consultation} 
                          onChange={(e) => handleChange('type_consultation', e.target.value)}
                          className="border-0 shadow-sm"
                          style={{ 
                            borderRadius: '8px', 
                            padding: '10px',
                            border: `1px solid ${colors.tableBorder}`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                          }}
                        >
                          {TYPES.map((type) => (
                            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                          ))}
                        </Form.Select>
                      ) : (
                        getTypeBadge(rdv.type_consultation)
                      )}
                    </td>
                    <td style={cellStyle}>
                      {editingId === rdv.id ? (
                        <Form.Select 
                          value={updates.mode} 
                          onChange={(e) => handleChange('mode', e.target.value)}
                          className="border-0 shadow-sm"
                          style={{ 
                            borderRadius: '8px', 
                            padding: '10px',
                            border: `1px solid ${colors.tableBorder}`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                          }}
                        >
                          {MODES.map((mode) => (
                            <option key={mode} value={mode}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</option>
                          ))}
                        </Form.Select>
                      ) : (
                        getModeBadge(rdv.mode)
                      )}
                    </td>
                    <td style={cellStyle}>
                      {editingId === rdv.id ? (
                        <Form.Select 
                          value={updates.statut} 
                          onChange={(e) => handleChange('statut', e.target.value)}
                          className="border-0 shadow-sm"
                          style={{ 
                            borderRadius: '8px', 
                            padding: '10px',
                            border: `1px solid ${colors.tableBorder}`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                          }}
                        >
                          {STATUTS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </Form.Select>
                      ) : (
                        getStatusBadge(rdv.statut)
                      )}
                    </td>
                    <td style={cellStyle}>
                      {rdv.lien_visio && rdv.statut === 'confirmé' && rdv.mode === 'à distance' && (
                        <Button 
                          variant="outline-info" 
                          size="sm" 
                          onClick={() => window.open(rdv.lien_visio, '_blank')}
                          style={{ 
                            borderRadius: '50px', 
                            padding: '8px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            border: 'none',
                            backgroundColor: colors.buttonInfo,
                            color: 'white'
                          }}
                        >
                          <FaVideo /> Rejoindre
                        </Button>
                      )}
                    </td>
                    <td style={cellStyle}>
                      {editingId === rdv.id ? (
                        <div className="d-flex gap-2">
                          <Button 
                            variant="success" 
                            size="sm" 
                            onClick={() => handleUpdate(rdv.id)}
                            style={{ 
                              borderRadius: '50px', 
                              padding: '8px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                              border: 'none',
                              backgroundColor: colors.buttonSuccess
                            }}
                          >
                            <FaSave /> Enregistrer
                          </Button>
                          <Button 
                            variant="light" 
                            size="sm" 
                            onClick={cancelEdit}
                            style={{ 
                              borderRadius: '50px', 
                              padding: '8px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                              border: 'none',
                              backgroundColor: '#f8f9fa'
                            }}
                          >
                            <FaTimes /> Annuler
                          </Button>
                        </div>
                      ) : (
                        <div className="d-flex gap-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            onClick={() => startEdit(rdv)}
                            style={{ 
                              borderRadius: '50px', 
                              padding: '8px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                              border: 'none',
                              backgroundColor: colors.buttonPrimary,
                              color: 'white'
                            }}
                          >
                            <FaEdit /> Modifier
                          </Button>
                          {rdv.statut !== 'annulé' && (
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              onClick={() => handleAnnuler(rdv.id)}
                              style={{ 
                                borderRadius: '50px', 
                                padding: '8px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 2px 5px rgba(169, 41, 41, 0.1)',
                                border: 'none',
                                backgroundColor: colors.buttonDanger,
                                color: 'white'
                              }}
                            >
                              <FaBan /> Annuler
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                    <td style={cellStyle}>
                      {rdv.evaluation && (
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: 'column',
                          alignItems: 'center', 
                          gap: '4px'
                        }}>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                size={16}
                                color={rdv.evaluation >= star ? '#ffc107' : '#e4e5e9'}
                              />
                            ))}
                          </div>
                          <small style={{ 
                            color: labelColors[rdv.evaluation - 1], 
                            fontWeight: '600',
                            fontSize: '0.75rem'
                          }}>
                            {labels[rdv.evaluation - 1]}
                          </small>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default MedecinRendezVous;
