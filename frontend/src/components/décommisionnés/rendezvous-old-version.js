// import React, { useState } from 'react';
// import { Button, Container, Row, Col, Card } from 'react-bootstrap';
// import haneneImg from '../assets/hanene.png'; // ✅ adapte le chemin selon ton projet

// const horaires = [
//   "08:30", "09:00", "09:30", "10:00", "10:30",
//   "11:00", "11:30", "13:00", "13:30", "14:00"
// ];

// function RendezVous() {
//   const [startDate, setStartDate] = useState(new Date());
//   const [selectedSlot, setSelectedSlot] = useState(null);

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

//   const weekDays = getWeekDays();

//   return (
//     <Container className="my-5">
//       <Card className="p-4 shadow-lg border-0 rounded-4">
//         <Row>
//           {/* Col gauche - Docteur */}
//           <Col md={3} className="text-center border-end">
//             <img src={haneneImg} alt="Docteur" className="img-fluid rounded-circle shadow" style={{ width: 130, height: 130, objectFit: 'cover' }} />
//             <h5 className="text-primary mt-3">Dr Ahlem ABID</h5>
//             <p className="text-muted mb-1">Dermatologue</p>
//             <p className="text-muted">Clinique ABC, Tunis</p>
//             <p className="text-muted">📞 +216 20 000 000</p>
//           </Col>

//           {/* Col droite - calendrier */}
//           <Col md={9}>
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <Button variant="light" onClick={handlePrevWeek}>←</Button>
//               <h5 className="text-info mb-0">
//                 {startDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
//               </h5>
//               <Button variant="light" onClick={handleNextWeek}>→</Button>
//             </div>

//             <div className="d-flex gap-3 overflow-auto pb-2">
//               {weekDays.map((day, idx) => (
//                 <div key={idx} className="bg-light p-3 rounded" style={{ minWidth: 140 }}>
//                   <div className="text-center fw-bold text-secondary mb-2">
//                     {day.toLocaleDateString('fr-FR', { weekday: 'short' }).toUpperCase()}
//                     <br />
//                     {day.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
//                   </div>
//                   {horaires.map((heure, i) => {
//                     const slotId = `${day.toDateString()}_${heure}`;
//                     return (
//                       <Button
//                         key={i}
//                         variant={selectedSlot === slotId ? 'primary' : 'outline-primary'}
//                         size="sm"
//                         className="w-100 mb-2 rounded-pill"
//                         onClick={() => setSelectedSlot(slotId)}
//                       >
//                         {heure}
//                       </Button>
//                     );
//                   })}
//                 </div>
//               ))}
//             </div>

//             {/* Action */}
//             {selectedSlot && (
//   <div className="mt-4 text-center">
//     <p className="text-success fw-bold">⏰ Créneau sélectionné : {selectedSlot}</p>
//     <Button variant="primary" className="me-2">Confirmer</Button>
//     <Button variant="success" className="me-2">Modifier</Button>
//     <Button variant="danger">Supprimer</Button>
//   </div>
// )}

//           </Col>
//         </Row>
//       </Card>
//     </Container>
//   );
// }

// export default RendezVous;

import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function RendezVous() {
  const emailMedecinRdv = localStorage.getItem('email_medecin_rdv');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const emailCurrentUser = currentUser?.email;

  const [disponibilites, setDisponibilites] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    if (emailMedecinRdv) {
      axios.get(`http://127.0.0.1:8000/api/disponibilites/${emailMedecinRdv}/`)
        .then(res => setDisponibilites(res.data.disponibilite || []))
        .catch(err => console.error("Erreur lors du chargement des disponibilités", err));
  
      // Optionnel : Nettoyage une fois utilisé
      localStorage.removeItem('email_medecin');
    }
  }, [emailMedecinRdv]);
  
  // useEffect(() => {
  //   if (emailMedecinRdv) {
  //     alert(emailMedecinRdv);
  //     axios.get(`http://127.0.0.1:8000/api/disponibilites/${emailMedecinRdv}/`)
  //       .then(res => setDisponibilites(res.data.disponibilite || []))
  //       .catch(err => console.error("Erreur lors du chargement des disponibilités", err));
  //   }
  // }, [emailMedecinRdv]);

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
  // const getWeekDays = () => {
  //   const days = [];
  //   const current = new Date(startDate);
  //   for (let i = 0; i < 7; i++) {
  //     const d = new Date(current);
  //     d.setDate(current.getDate() + i);
  //     days.push(d);
  //   }
  //   return days;
  // };
  
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

  const weekDays = getWeekDays();

  return (
    <Container className="my-5">
      <Card className="p-4 shadow-lg border-0 rounded-4">
        <Row>
          <Col md={3} className="text-center border-end">
            <img src="https://via.placeholder.com/130" alt="Docteur" className="img-fluid rounded-circle shadow" />
            <h5 className="text-primary mt-3">Docteur</h5>
            <p className="text-muted">{emailMedecinRdv}</p>
          </Col>

          <Col md={9}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button variant="light" onClick={handlePrevWeek}>←</Button>
              <h5 className="text-info mb-0">
                {startDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </h5>
              <Button variant="light" onClick={handleNextWeek}>→</Button>
            </div>

            <div className="d-flex gap-3 overflow-auto pb-2">
              {weekDays.map((day, idx) => {
                const creneaux = getCreneauxForDay(day);
                return (
                  <div key={idx} className="bg-light p-3 rounded" style={{ minWidth: 140 }}>
                    <div className="text-center fw-bold text-secondary mb-2">
                      {day.toLocaleDateString('fr-FR', { weekday: 'short' }).toUpperCase()}
                      <br />
                      {day.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                    </div>
                    {creneaux.length > 0 ? creneaux.map((heure, i) => {
                      const slotId = `${day.toDateString()}_${heure}`;
                      return (
                        <Button
                          key={i}
                          variant={selectedSlot === slotId ? 'primary' : 'outline-primary'}
                          size="sm"
                          className="w-100 mb-2 rounded-pill"
                          onClick={() => setSelectedSlot(slotId)}
                        >
                          {heure}
                        </Button>
                      );
                    }) : <div className="text-muted text-center">Aucune dispo</div>}
                  </div>
                );
              })}
            </div>

            {selectedSlot && (
              <div className="mt-4 text-center">
                <p className="text-success fw-bold">⏰ Créneau sélectionné : {selectedSlot}</p>
                <Button variant="primary" className="me-2">Confirmer</Button>
                <Button variant="success" className="me-2">Modifier</Button>
                <Button variant="danger">Supprimer</Button>
              </div>
            )}
          </Col>
        </Row>
      </Card>
    </Container>
  );
}

export default RendezVous;
