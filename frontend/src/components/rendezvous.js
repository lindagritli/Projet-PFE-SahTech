// import React, { useEffect, useState } from 'react';
// import { Button, Container, Row, Col, Card } from 'react-bootstrap';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';

// function RendezVous() {
//   const emailMedecinRdv = localStorage.getItem('email_medecin_rdv');
//   const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//   const emailCurrentUser = currentUser?.email;

//   const [disponibilites, setDisponibilites] = useState([]);
//   const [startDate, setStartDate] = useState(new Date());
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [typeConsultation, setTypeConsultation] = useState("consultation");
//   const [mode, setMode] = useState("présentiel");

//   useEffect(() => {
//     if (emailMedecinRdv) {
//       axios.get(`http://127.0.0.1:8000/api/disponibilites/${emailMedecinRdv}/`)
//         .then(res => setDisponibilites(res.data.disponibilite || []))
//         .catch(err => console.error("Erreur lors du chargement des disponibilités", err));
//       // Optionnel : Nettoyage une fois utilisé
//       localStorage.removeItem('email_medecin');
//     }
//   }, [emailMedecinRdv]);

//   const getWeekDays = () => {
//     const days = [];
//     const current = new Date(startDate);
//     for (let i = 0; i < 6; i++) {
//       const d = new Date(current);
//       d.setDate(current.getDate() + i);
//       days.push(d);
//     }
//     return days;
//   };

//   const handlePrevWeek = () => {
//     const newStart = new Date(startDate);
//     newStart.setDate(startDate.getDate() - 6);
//     setStartDate(newStart);
//   };

//   const handleNextWeek = () => {
//     const newStart = new Date(startDate);
//     newStart.setDate(startDate.getDate() + 6);
//     setStartDate(newStart);
//   };

//   const generateCreneaux = (debut, fin) => {
//     const result = [];
//     const [h1, m1] = debut.split(':').map(Number);
//     const [h2, m2] = fin.split(':').map(Number);
//     let d = new Date();
//     d.setHours(h1, m1, 0);
//     const end = new Date();
//     end.setHours(h2, m2, 0);
//     while (d < end) {
//       result.push(d.toTimeString().slice(0, 5));
//       d = new Date(d.getTime() + 15 * 60000);
//     }
//     return result;
//   };

//   const getCreneauxForDay = (day) => {
//     const jourNom = day.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase();
//     const dispo = disponibilites.find(d => d.jour === jourNom);
//     if (!dispo) return [];
//     const slots = [];
//     if (dispo.matin_debut && dispo.matin_fin)
//       slots.push(...generateCreneaux(dispo.matin_debut, dispo.matin_fin));
//     if (dispo.apresmidi_debut && dispo.apresmidi_fin)
//       slots.push(...generateCreneaux(dispo.apresmidi_debut, dispo.apresmidi_fin));
//     return slots;
//   };

//   const handleConfirmation = async () => {
//     if (!selectedSlot) return;

//     const [dayString, time] = selectedSlot.split('_');
//     const date = new Date(dayString);
//     const formattedDate = date.toISOString().split('T')[0];
//     const payload = {
//       patient_email: emailCurrentUser,
//       medecin_email: emailMedecinRdv,
//       date: formattedDate,
//       heure: time,
//       type_consultation: typeConsultation,
//       mode: mode
//     };

//     try {
//       console.log(Date(dayString));
//       const res = await axios.post("http://127.0.0.1:8000/api/rendezvous/create/", payload);
//       const mode = res.data?.mode?.toLowerCase() || 'vide';
//       if (res.data?.mode === 'à distance') {
//         alert("✅ Rendez-vous à distance confirmé !"); //✅ Rendez-vous confirmé !\n🔗 Lien Jitsi : ${res.data.lien_visio}
//         // Optionnel : ouvrir la salle automatiquement
//         // window.open(res.data.lien_visio, "_blank");
//       } else {
//         alert("✅ Rendez-vous présentiel confirmé");
//       }
//     } catch (error) {
//       alert("❌ Erreur lors de la prise de rendez-vous");
//       console.error(error);
//     }
//   };

//   const weekDays = getWeekDays();

//   return (
//     <Container className="my-5">
//       <Card className="p-4 shadow-lg border-0 rounded-4">
//         <Row>
//           <Col md={3} className="text-center border-end">
//             <img src="https://via.placeholder.com/130" alt="Docteur" className="img-fluid rounded-circle shadow" />
//             <h5 className="text-primary mt-3">Docteur</h5>
//             <p className="text-muted">{emailMedecinRdv}</p>
//           </Col>

//           <Col md={9}>
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <Button variant="light" onClick={handlePrevWeek}>←</Button>
//               <h5 className="text-info mb-0">
//                 {startDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
//               </h5>
//               <Button variant="light" onClick={handleNextWeek}>→</Button>
//             </div>

//             <div className="d-flex gap-3 overflow-auto pb-2">
//               {weekDays.map((day, idx) => {
//                 const creneaux = getCreneauxForDay(day);
//                 return (
//                   <div key={idx} className="bg-light p-3 rounded" style={{ minWidth: 140 }}>
//                     <div className="text-center fw-bold text-secondary mb-2">
//                       {day.toLocaleDateString('fr-FR', { weekday: 'short' }).toUpperCase()}
//                       <br />
//                       {day.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
//                     </div>
//                     {creneaux.length > 0 ? creneaux.map((heure, i) => {
//                       const slotId = `${day.toDateString()}_${heure}`;
//                       return (
//                         <Button
//                           key={i}
//                           variant={selectedSlot === slotId ? 'primary' : 'outline-primary'}
//                           size="sm"
//                           className="w-100 mb-2 rounded-pill"
//                           onClick={() => setSelectedSlot(slotId)}
//                         >
//                           {heure}
//                         </Button>
//                       );
//                     }) : <div className="text-muted text-center">Aucune dispo</div>}
//                   </div>
//                 );
//               })}
//             </div>

//             {selectedSlot && (
//               <div className="mt-4 text-center">
//                 <p className="text-success fw-bold">⏰ Créneau sélectionné : {selectedSlot}</p>

//                 <div className="mb-3">
//                   <label className="me-3">Type :</label>
//                   <select value={typeConsultation} onChange={e => setTypeConsultation(e.target.value)}>
//                     <option value="consultation">Consultation</option>
//                     <option value="contrôle">Contrôle</option>
//                   </select>

//                   <label className="ms-4 me-3">Mode :</label>
//                   <select value={mode} onChange={e => setMode(e.target.value)}>
//                     <option value="présentiel">Présentiel</option>
//                     <option value="à distance">À distance</option>
//                   </select>
//                 </div>

//                 <Button variant="primary" className="me-2" onClick={handleConfirmation}>Confirmer</Button>
//               </div>
//             )}
//           </Col>
//         </Row>
//       </Card>
//     </Container>
//   );
// }

// export default RendezVous;
import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RendezVous() {
  const navigate = useNavigate();
  const emailMedecinRdv = localStorage.getItem('email_medecin_rdv');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const emailCurrentUser = currentUser?.email;

  const [disponibilites, setDisponibilites] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [typeConsultation, setTypeConsultation] = useState("consultation");
  const [mode, setMode] = useState("présentiel");

  useEffect(() => {
    if (emailMedecinRdv) {
      axios.get(`http://127.0.0.1:8000/api/disponibilites/${emailMedecinRdv}/`)
        .then(res => setDisponibilites(res.data.disponibilite || []))
        .catch(err => console.error("Erreur lors du chargement des disponibilités", err));
      localStorage.removeItem('email_medecin');
    }
  }, [emailMedecinRdv]);

  const getWeekDays = () => {
    const days = [];
    const current = new Date(startDate);
    for (let i = 0; i < 6; i++) {
      const d = new Date(current);
      d.setDate(current.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const handlePrevWeek = () => {
    const newStart = new Date(startDate);
    newStart.setDate(startDate.getDate() - 6);
    setStartDate(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(startDate);
    newStart.setDate(startDate.getDate() + 6);
    setStartDate(newStart);
  };

  const generateCreneaux = (debut, fin) => {
    const result = [];
    const [h1, m1] = debut.split(':').map(Number);
    const [h2, m2] = fin.split(':').map(Number);
    let d = new Date();
    d.setHours(h1, m1, 0);
    const end = new Date();
    end.setHours(h2, m2, 0);
    while (d < end) {
      result.push(d.toTimeString().slice(0, 5));
      d = new Date(d.getTime() + 15 * 60000);
    }
    return result;
  };

  const getCreneauxForDay = (day) => {
    const jourNom = day.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase();
    const dispo = disponibilites.find(d => d.jour === jourNom);
    if (!dispo) return [];
    const slots = [];
    if (dispo.matin_debut && dispo.matin_fin)
      slots.push(...generateCreneaux(dispo.matin_debut, dispo.matin_fin));
    if (dispo.apresmidi_debut && dispo.apresmidi_fin)
      slots.push(...generateCreneaux(dispo.apresmidi_debut, dispo.apresmidi_fin));
    return slots;
  };

  const handleConfirmation = async () => {
    if (!selectedSlot) return;
    const [dayString, time] = selectedSlot.split('_');
    const date = new Date(dayString);
    const formattedDate = date.toISOString().split('T')[0];
    const payload = {
      patient_email: emailCurrentUser,
      medecin_email: emailMedecinRdv,
      date: formattedDate,
      heure: time,
      type_consultation: typeConsultation,
      mode: mode
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/rendezvous/create/", payload);
      alert("✅ Rendez-vous confirmé !");
      navigate("/rendezvous-patient");
    } catch (error) {
      alert("❌ Erreur lors de la prise de rendez-vous");
      console.error(error);
    }
  };

  const handlePaiement = () => {
    localStorage.setItem("pending_rdv_slot", selectedSlot);
    localStorage.setItem("pending_rdv_type", typeConsultation);
    localStorage.setItem("pending_rdv_mode", mode);
    localStorage.setItem("pending_rdv_medecin", emailMedecinRdv);
    navigate("/paiement");
  };

  const weekDays = getWeekDays();

  return (
    <Container className="my-5">
      <Card className="p-4 shadow-lg border-0 rounded-4" style={{ backgroundColor: '#e8f5f3' }}>
        <Row>
          <Col md={3} className="text-center border-end" style={{ borderColor: '#a8d5cd !important' }}>
            <img 
              src={localStorage.getItem('photo_medecin_rdv') || "https://via.placeholder.com/130"} 
              alt="Docteur" 
              className="img-fluid rounded-circle shadow" 
              style={{ width: '130px', height: '130px', objectFit: 'cover', border: '3px solid #5bbfb2' }}
            />            
            <h5 style={{ color: '#2a9d8f', marginTop: '15px' }}>Docteur</h5>
            <p style={{ color: '#66b2a8' }}>{emailMedecinRdv}</p>
          </Col>

          <Col md={9}>
            <div className="d-flex justify-content-between align-items-center mb-3" 
                 style={{ backgroundColor: '#c2e8e2', padding: '10px', borderRadius: '8px' }}>
              <Button variant="light" onClick={handlePrevWeek} 
                      style={{ backgroundColor: '#a8d5cd', color: '#2a9d8f', border: 'none' }}>←</Button>
              <h5 className="mb-0" style={{ color: '#2a9d8f' }}>
                {startDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </h5>
              <Button variant="light" onClick={handleNextWeek}
                      style={{ backgroundColor: '#a8d5cd', color: '#2a9d8f', border: 'none' }}>→</Button>
            </div>

            <div className="d-flex gap-3 overflow-auto pb-2">
              {weekDays.map((day, idx) => {
                const creneaux = getCreneauxForDay(day);
                return (
                  <div key={idx} className="p-3 rounded" style={{ minWidth: 140, backgroundColor: '#d4f0eb' }}>
                    <div className="text-center fw-bold mb-2" 
                         style={{ color: '#2a9d8f', backgroundColor: '#a8d5cd', padding: '5px', borderRadius: '4px' }}>
                      {day.toLocaleDateString('fr-FR', { weekday: 'short' }).toUpperCase()}<br />
                      {day.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                    </div>
                    {creneaux.length > 0 ? creneaux.map((heure, i) => {
                      const slotId = `${day.toDateString()}_${heure}`;
                      return (
                        <Button
                          key={i}
                          style={{
                            backgroundColor: selectedSlot === slotId ? '#2a9d8f' : 'white',
                            color: selectedSlot === slotId ? 'white' : '#2a9d8f',
                            border: `1px solid #a8d5cd`,
                            transition: 'all 0.3s ease'
                          }}
                          size="sm"
                          className="w-100 mb-2 rounded-pill"
                          onClick={() => setSelectedSlot(slotId)}
                        >
                          {heure}
                        </Button>
                      );
                    }) : <div style={{ color: '#66b2a8', textAlign: 'center' }}>Aucune dispo</div>}
                  </div>
                );
              })}
            </div>

            {selectedSlot && (
              <div className="mt-4 text-center" style={{ backgroundColor: '#d4f0eb', padding: '15px', borderRadius: '8px' }}>
                <p className="fw-bold" style={{ color: '#2a9d8f' }}>⏰ Créneau sélectionné : {selectedSlot}</p>

                <div className="mb-3">
                  <label className="me-3" style={{ color: '#2a9d8f' }}>Type :</label>
                  <select 
                    value={typeConsultation} 
                    onChange={e => setTypeConsultation(e.target.value)}
                    style={{ borderColor: '#a8d5cd', color: '#2a9d8f', padding: '5px', borderRadius: '4px' }}
                  >
                    <option value="consultation">Consultation</option>
                    <option value="contrôle">Contrôle</option>
                  </select>

                  <label className="ms-4 me-3" style={{ color: '#2a9d8f' }}>Mode :</label>
                  <select 
                    value={mode} 
                    onChange={e => setMode(e.target.value)}
                    style={{ borderColor: '#a8d5cd', color: '#2a9d8f', padding: '5px', borderRadius: '4px' }}
                  >
                    <option value="présentiel">Présentiel</option>
                    <option value="à distance">À distance</option>
                  </select>
                </div>

                {(typeConsultation === "consultation" && mode === "à distance") ? (
                  <Button 
                    style={{ backgroundColor: '#4db6ac', border: 'none' }}
                    onClick={handlePaiement}
                  >
                    Passer au paiement
                  </Button>
                ) : (
                  <Button 
                    style={{ backgroundColor: '#2a9d8f', border: 'none' }}
                    onClick={handleConfirmation}
                  >
                    Confirmer
                  </Button>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default RendezVous;