import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Card, Badge } from 'react-bootstrap';
import { FaStar, FaCalendarAlt, FaClock, FaUserMd, FaVideo, FaTimes } from 'react-icons/fa';

function PatientRendezVous() {
  const email = JSON.parse(localStorage.getItem('currentUser'))?.email;
  const [rendezvous, setRendezvous] = useState([]);
  const [medecinsNoms, setMedecinsNoms] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [motif, setMotif] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    fetchRendezvous();
  }, []);

  const fetchRendezvous = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/rendezvous/patient/${email}/`);
      const rdvs = res.data;
      rdvs.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRendezvous(rdvs);

      // Injecter les évaluations existantes
      const initialRatings = {};
      rdvs.forEach(rdv => {
        if (rdv.evaluation) {
          initialRatings[rdv.id] = rdv.evaluation;
        }
      });
      setRatings(initialRatings);

      const nomsTemp = {};
      for (let rdv of rdvs) {
        const id = rdv.medecin;
        if (!nomsTemp[id]) {
          const nomRes = await axios.get(`http://127.0.0.1:8000/api/user-nom-prenom/${id}/`);
          const data = nomRes.data;
          nomsTemp[id] = `${data.prenom} ${data.nom}`;
        }
      }
      setMedecinsNoms(nomsTemp);
    } catch (error) {
      console.error("Erreur chargement RDV ou noms :", error);
    }
  };

  const openModal = (id) => {
    setSelectedId(id);
    setMotif('');
    setShowModal(true);
  };

  const handleAnnuler = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/rendezvous/${selectedId}/annuler/`, {
        motif_annulation: motif
      });
      setShowModal(false);
      fetchRendezvous();
    } catch (error) {
      console.error("Erreur annulation :", error);
    }
  };

  const handleRating = async (rdvId, starIndex) => {
    setRatings({ ...ratings, [rdvId]: starIndex });
    try {
      await axios.post(`http://127.0.0.1:8000/api/rendezvous/${rdvId}/noter/`, {
        evaluation: starIndex
      });
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de l'évaluation :", err);
    }
  };

  const labels = ['Mauvais', 'Passable', 'Bien', 'Très bien', 'Excellent'];
  const labelColors = ['#dc3545', '#fd7e14', '#ffc107', '#0d6efd', '#198754'];

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmé': return '#28a745';
      case 'en attente': return '#ffc107';
      case 'annulé': return '#dc3545';
      case 'terminé': return '#6c757d';
      default: return '#6c757d';
    }
  };

  return (
    <div className="container mt-5" style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Body>
          <div style={styles.headerContent}>
            <FaCalendarAlt size={30} style={styles.headerIcon} />
            <h4 style={styles.headerTitle}>Mes rendez-vous</h4>
          </div>
        </Card.Body>
      </Card>

      {rendezvous.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Body style={styles.emptyCardBody}>
            <div style={styles.emptyIcon}>🔍</div>
            <p style={styles.emptyText}>Aucun rendez-vous trouvé.</p>
          </Card.Body>
        </Card>
      ) : (
        <Card style={styles.tableCard}>
          <Card.Body style={styles.tableCardBody}>
            <Table hover responsive style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.tableHeaderCell}>Date</th>
                  <th style={styles.tableHeaderCell}>Heure</th>
                  <th style={styles.tableHeaderCell}>Médecin</th>
                  <th style={styles.tableHeaderCell}>Type</th>
                  <th style={styles.tableHeaderCell}>Mode</th>
                  <th style={styles.tableHeaderCell}>Statut</th>
                  <th style={styles.tableHeaderCell}>Lien Visio</th>
                  <th style={styles.tableHeaderCell}>Actions</th>
                  <th style={styles.tableHeaderCell}>Retours d'expérience</th>
                </tr>
              </thead>
              <tbody>
                {rendezvous.map((rdv) => (
                  <tr key={rdv.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div style={styles.dateCell}>
                        <FaCalendarAlt style={styles.cellIcon} />
                        {rdv.date}
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.timeCell}>
                        <FaClock style={styles.cellIcon} />
                        {rdv.heure}
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.doctorCell}>
                        <FaUserMd style={styles.cellIcon} />
                        {medecinsNoms[rdv.medecin] || '⏳'}
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <Badge style={{
                        ...styles.typeBadge,
                        backgroundColor: rdv.type_consultation === 'consultation' ? '#4361ee' : '#3a0ca3'
                      }}>
                        {rdv.type_consultation?.charAt(0).toUpperCase() + rdv.type_consultation.slice(1)}
                      </Badge>
                    </td>
                    <td style={styles.tableCell}>
                      <Badge style={{
                        ...styles.modeBadge,
                        backgroundColor: rdv.mode === 'présentiel' ? '#4cc9f0' : '#f72585'
                      }}>
                        {rdv.mode?.charAt(0).toUpperCase() + rdv.mode.slice(1)}
                      </Badge>
                    </td>
                    <td style={styles.tableCell}>
                      <Badge style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(rdv.statut)
                      }}>
                        {rdv.statut?.toUpperCase()}
                      </Badge>
                    </td>
                    <td style={styles.tableCell}>
                      {rdv.lien_visio && rdv.statut === 'confirmé' && rdv.mode === 'à distance' && (
                        <Button 
                          variant="info" 
                          size="sm" 
                          style={styles.videoButton}
                          onClick={() => window.open(rdv.lien_visio, "_blank")}
                        >
                          <FaVideo style={styles.buttonIcon} /> Rejoindre
                        </Button>
                      )}
                    </td>
                    <td style={styles.tableCell}>
                      {rdv.statut !== 'terminé' && rdv.statut !== 'annulé' && (
                        <Button 
                          variant="danger" 
                          size="sm" 
                          style={styles.cancelButton}
                          onClick={() => openModal(rdv.id)}
                        >
                          <FaTimes style={styles.buttonIcon} /> Annuler
                        </Button>
                      )}
                    </td>
                    <td style={styles.tableCell}>
                      {rdv.statut === 'terminé' && (
                        <div style={styles.ratingContainer}>
                          <small style={styles.ratingLabel}>Évaluez votre expérience :</small>
                          <div style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                size={22}
                                title={labels[star - 1]}
                                style={{
                                  ...styles.star,
                                  color: ratings[rdv.id] >= star ? '#ffc107' : '#e4e5e9'
                                }}
                                onClick={() => handleRating(rdv.id, star)}
                              />
                            ))}
                          </div>
                          {ratings[rdv.id] && (
                            <div style={{
                              ...styles.ratingText,
                              color: labelColors[ratings[rdv.id] - 1]
                            }}>
                              {labels[ratings[rdv.id] - 1]}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
        style={styles.modal}
      >
        <Modal.Header closeButton style={styles.modalHeader}>
          <Modal.Title style={styles.modalTitle}>Annulation du rendez-vous</Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          <Form.Group>
            <Form.Label style={styles.modalLabel}>Motif d'annulation</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              style={styles.modalTextarea}
              placeholder="Veuillez indiquer la raison de l'annulation..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer style={styles.modalFooter}>
          <Button 
            variant="secondary" 
            onClick={() => setShowModal(false)}
            style={styles.closeButton}
          >
            Fermer
          </Button>
          <Button 
            variant="danger" 
            onClick={handleAnnuler}
            style={styles.confirmButton}
          >
            Confirmer l'annulation
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
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

const labelColors = ['#B55B52', '#D68F59', '#D6C559', '#75A89A', '#226D68'];

const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    maxWidth: '1200px',
  },
  headerCard: {
    marginBottom: '25px',
    borderRadius: '15px',
    border: 'none',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
    backgroundColor: colors.darkGreen,
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
  },
  headerIcon: {
    color: 'white',
    marginRight: '15px',
  },
  headerTitle: {
    color: 'white',
    margin: 0,
    fontWeight: '600',
    fontSize: '24px',
  },
  emptyCard: {
    borderRadius: '15px',
    border: 'none',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
  },
  emptyCardBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px 20px',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  emptyText: {
    color: '#6c757d',
    fontSize: '18px',
  },
  tableCard: {
    borderRadius: '15px',
    border: 'none',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    backgroundColor: colors.lightAccent,
  },
  tableCardBody: {
    padding: '0',
  },
  table: {
    marginBottom: '0',
  },
  tableHeader: {
    backgroundColor: colors.headerBg,
  },
  tableHeaderCell: {
    padding: '15px',
    fontSize: '14px',
    fontWeight: '600',
    color: colors.darkAccent,
    borderBottom: `2px solid ${colors.tableBorder}`,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableRow: {
    backgroundColor: colors.lightGreen,
    transition: 'all 0.2s',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
  tableCell: {
    padding: '15px',
    verticalAlign: 'middle',
    textAlign: 'center',
    borderColor: 'transparent',
  },
  dateCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellIcon: {
    marginRight: '8px',
    color: colors.darkAccent,
  },
  typeBadge: {
    padding: '8px 12px',
    borderRadius: '20px',
    fontWeight: '500',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    backgroundColor: colors.darkGreen,
    color: 'white',
  },
  modeBadge: {
    padding: '8px 12px',
    borderRadius: '20px',
    fontWeight: '500',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    backgroundColor: colors.mediumGreen,
    color: 'white',
  },
  statusBadge: {
    padding: '8px 12px',
    borderRadius: '20px',
    fontWeight: '500',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'white',
  },
  videoButton: {
    borderRadius: '20px',
    padding: '8px 15px',
    backgroundColor: colors.buttonInfo,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    color: 'white',
  },
  cancelButton: {
    borderRadius: '20px',
    padding: '8px 15px',
    backgroundColor: colors.buttonDanger,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    color: 'white',
  },
  buttonIcon: {
    marginRight: '5px',
  },
  ratingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  ratingLabel: {
    color: '#6c757d',
    marginBottom: '8px',
  },
  starsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    marginBottom: '5px',
  },
  star: {
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  ratingText: {
    fontWeight: 'bold',
    fontSize: '14px',
    marginTop: '5px',
  },
  modal: {
    fontFamily: "'Poppins', sans-serif",
  },
  modalHeader: {
    borderBottom: '1px solid #f1f1f1',
    padding: '20px 25px',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: colors.buttonDanger,
  },
  modalBody: {
    padding: '25px',
  },
  modalLabel: {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '10px',
    color: '#495057',
  },
  modalTextarea: {
    borderRadius: '10px',
    border: `1px solid ${colors.tableBorder}`,
    padding: '12px',
    fontSize: '15px',
  },
  modalFooter: {
    borderTop: '1px solid #f1f1f1',
    padding: '20px 25px',
  },
  closeButton: {
    borderRadius: '20px',
    padding: '8px 20px',
    backgroundColor: colors.mediumGreen,
    border: 'none',
    color: 'white',
  },
  confirmButton: {
    borderRadius: '20px',
    padding: '8px 20px',
    backgroundColor: colors.buttonDanger,
    border: 'none',
    color: 'white',
  },
};

export default PatientRendezVous;