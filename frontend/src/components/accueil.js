import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarCheck, FaUserMd, FaSearch, FaHospitalAlt, FaBriefcaseMedical, FaMobile, FaBell } from 'react-icons/fa';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import imagebackg from '../assets/imagebackg.jpg'; 
import ChatbotPopup from '../pages/ChatbotPopUp';
import medecinsImage from '../assets/medecins.png'; // adapte le chemin si nécessaire
import rendezvousImage from '../assets/rendezvous.png'; // adapte le chemin si nécessaire
import consultationImage from '../assets/consultation.png'; // adapte le chemin si nécessaire

function Accueil() {
  const [medecins, setMedecins] = useState([]);
  const [filteredMedecins, setFilteredMedecins] = useState([]);
  const [villes, setVilles] = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [evaluationsMedecins, setEvaluationsMedecins] = useState({});

  const [searchNom, setSearchNom] = useState('');
  const [searchSpecialite, setSearchSpecialite] = useState('');
  const [searchVille, setSearchVille] = useState('');
  const [searchGrade, setSearchGrade] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les médecins
    axios.get('http://127.0.0.1:8000/api/medecins/')
      .then(res => {
        setMedecins(res.data);
        setFilteredMedecins(res.data);
        
        // Récupérer les évaluations pour chaque médecin
        res.data.forEach(medecin => {
          axios.get(`http://127.0.0.1:8000/api/medecin/${medecin.user}/evaluations/`)
            .then(evalRes => {
              setEvaluationsMedecins(prev => ({
                ...prev,
                [medecin.id]: evalRes.data.moyenne || 0
              }));
            })
            .catch(err => console.error(`Erreur chargement évaluations pour médecin ${medecin.id}:`, err));
        });
      });

    axios.get('http://127.0.0.1:8000/api/villes/').then(res => setVilles(res.data));
    axios.get('http://127.0.0.1:8000/api/specialites/').then(res => setSpecialites(res.data));
  }, []);

  const handleSearch = () => {
    const filtered = medecins.filter((med) =>
      med.nom.toLowerCase().includes(searchNom.toLowerCase()) &&
      med.specialite_nom?.toLowerCase().includes(searchSpecialite.toLowerCase()) &&
      med.ville_nom?.toLowerCase().includes(searchVille.toLowerCase()) &&
      med.grade?.toLowerCase().includes(searchGrade.toLowerCase())
    );
    setFilteredMedecins(filtered);
  };

  const calculerExperience = (debut) => {
    if (!debut) return '';
    const anneeDebut = new Date(debut).getFullYear();
    const anneeActuelle = new Date().getFullYear();
    const annees = anneeActuelle - anneeDebut;
    return annees > 0 ? `${annees} ans d'expérience` : '';
  };

  // Liste des villes pour les filtres rapides
  const villesRapides = [
    'Tataouine', 'Ariana', 'Le Kef', 'Sfax', 'Tozeur', 'Ben arous', 'Gabes', 'Nabeul', 'Kasserine', 'Mannouba'
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f9fc' }}>
      {/* HERO SECTION AVEC BACKGROUND IMAGE ET NAVBAR INCLUSE */}
      <div className="relative">
        <div
          className="relative w-full h-[100vh] flex flex-col justify-end text-white text-center px-4"
          style={{
            backgroundImage: `url(${imagebackg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black opacity-40 z-0"></div>

          {/* Navbar arrondie flottante plus large */}
          <div className="absolute top-8 left-4 right-4 bg-[#007A74] text-white shadow-lg rounded-full px-10 py-4 z-10">
            <div className="flex items-center justify-between max-w-[1700px] mx-auto">
              <h1 className="text-2xl font-bold tracking-wide flex items-center space-x-2">
                <div className="loader scale-75 mr-3 flex">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="orbe" style={{ "--index": i }}></div>
                  ))}
                </div>
                <span>SahTech</span>
                <span>🩺</span>
                <span className="ml-1">صحّـتكـ</span>
              </h1>

              <div className="hidden md:flex items-center space-x-6">
                <a href="#services" className="hover:text-teal-200 transition-colors">Services</a>
                <a href="#about" className="hover:text-teal-200 transition-colors">À propos</a>
                <a href="#contact" className="hover:text-teal-200 transition-colors">Contact</a>
                <button onClick={() => navigate('/signup')} className="px-4 py-2 bg-[#B0B9A8] text-white rounded-md hover:bg-teal-800 transition">S'inscrire</button>
                <button onClick={() => navigate('/login')} className="px-4 py-2 bg-[#B0B9A8] text-white rounded-md hover:bg-teal-800 transition">Se connecter</button>
              </div>
            </div>
          </div>

          <div className="absolute top-50 z-10 max-w-3xl mx-auto pb-4 left-0 right-0 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              NOUS FOURNISSONS LES MEILLEURS SOINS
            </h1>
            <p className="mb-6 text-lg">
              Découvrez nos médecins experts. Accédez aux soins de qualité avec SahTech.
            </p>
          </div>

          <div className="absolute bottom-0 w-full overflow-hidden leading-[0] rotate-180 z-0">
            <svg className="relative block w-[calc(150%+1.3px)] h-[100px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path
                d="M321.39,56.44C195.19,82.37,65.12,104.9,0,114.72V0H1200V114.72
                c-65.12-9.82-195.19-32.35-321.39-58.28C752.57,27.62,626.34,0,
                600,0S447.43,27.62,321.39,56.44Z"
                className="fill-white"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <ChatbotPopup />

      <Container className="my-5">
        <Row>
          {/* Colonne de filtres à gauche */}
          <Col md={3}>
            <div className="border rounded shadow-sm p-3 mb-4 bg-white">
              <h4 className="pb-2 mb-3 fw-bold">Filtrer par</h4>
              
              <div className="mb-3">
                <div className="position-relative d-flex">
                  <div className="position-relative flex-grow-1">
                    <FaSearch className="position-absolute" style={{ top: '12px', left: '10px', color: '#999' }} />
                    <Form.Control 
                      placeholder="Nom du professionnel de santé" 
                      value={searchNom} 
                      onChange={(e) => setSearchNom(e.target.value)} 
                      className="pl-4 py-2"
                      style={{ paddingLeft: '35px' }}
                    />
                  </div>
                  <Button 
                    variant="warning" 
                    onClick={handleSearch}
                    style={{ backgroundColor: '#226D68', borderColor: '#226D68', marginLeft: '5px' }}
                  >
                    OK
                  </Button>
                </div>
              </div>
              
              <div className="mb-3">
                <Form.Label>Spécialité</Form.Label>
                <Form.Select value={searchSpecialite} onChange={(e) => setSearchSpecialite(e.target.value)}>
                  <option value="">Toutes les spécialités</option>
                  {specialites.map(spec => (
                    <option key={spec.id} value={spec.nom}>{spec.nom}</option>
                  ))}
                </Form.Select>
              </div>
              
              <div className="mb-3">
                <div className="d-flex align-items-center">
              
                </div>
                                <Form.Label>Etablissement</Form.Label>

                <Form.Select className="mt-2">
  <option value="">Tous les établissements</option>
  {/* Remplacer par la liste des établissements quand disponible */}
  {/* Exemple: 
  {etablissements.map(etab => (
    <option key={etab.id} value={etab.nom}>{etab.nom}</option>
  ))}
  */}
</Form.Select>
              </div>
              
              <div className="mb-3">
                <Form.Label>Ville</Form.Label>
                <div className="position-relative">
                  <Form.Select value={searchVille} onChange={(e) => setSearchVille(e.target.value)}>
                    <option value="">Toutes les villes</option>
                    {villes.map(ville => (
                      <option key={ville.id} value={ville.nom}>{ville.nom}</option>
                    ))}
                  </Form.Select>
                </div>
              </div>
              
              <div className="mb-3">
                <Form.Label>Genre</Form.Label>
                <Form.Select>
                  <option value="">Tous les genres</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                </Form.Select>
              </div>
              
            
            
              
              <Button 
                variant="primary" 
                onClick={handleSearch} 
                className="w-100 mt-2 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: '#226D68', borderColor: '#226D68' }}
              >
                <FaSearch className="me-2" />
                RECHERCHER
              </Button>
            </div>
          </Col>
          
          {/* Filtres rapides par ville */}
          <Col md={9}>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {villesRapides.map((ville, index) => (
                <button 
                  key={index}
                  className="btn rounded-pill px-3 py-1"
                  style={{ 
                    backgroundColor: searchVille === ville ? '#226D68' : 'white',
                    color: searchVille === ville ? 'white' : '#333',
                    border: '1px solid #ddd',
                    fontSize: '0.9rem'
                  }}
                  onClick={() => {
                    setSearchVille(ville === searchVille ? '' : ville);
                    handleSearch();
                  }}
                >
                  {ville}
                </button>
              ))}
              <button 
                className="btn rounded-pill px-3 py-1"
                style={{ 
                  backgroundColor: 'white',
                  color: '#666',
                  border: '1px solid #ddd',
                  fontSize: '0.9rem'
                }}
              >
                ••• Voir Plus
              </button>
            </div>
            
            {/* Liste des médecins */}
            <div className="shadow-sm rounded bg-white p-0">
              {filteredMedecins.length > 0 ? (
                filteredMedecins.map((med) => (
                  <div key={med.id} className="border-bottom p-0">
                    <div className="p-4">
                      <div className="d-flex">
                        {/* Photo du médecin */}
                        <img
                          src={med.photo || 'https://via.placeholder.com/80'}
                          alt={`${med.nom} ${med.prenom}`}
                          className="rounded"
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                        
                        {/* Informations principales */}
                        <div className="ms-3 flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h4 className="mb-0 fw-bold" style={{ color: '#0099ff' }}>
                                Dr. {med.prenom} {med.nom}
                              </h4>
                              <p className="mb-1">
                                {typeof med.specialite === 'object' ? med.specialite.nom : 
                                 typeof med.specialite === 'number' ? specialites.find(s => s.id === med.specialite)?.nom || 'Spécialité' : 
                                 med.specialite_nom || 'Spécialité'}
                              </p>
                              <div className="d-flex align-items-center mb-1">
                                <FaMapMarkerAlt className="text-info me-1" />
                                <span>
                                  {typeof med.ville === 'object' ? med.ville.nom : 
                                   typeof med.ville === 'number' ? villes.find(v => v.id === med.ville)?.nom || 'Ville' : 
                                   med.ville_nom || 'Ville'}
                                </span>
                              </div>
                              
                              {/* Expérience */}
                              {med.debut_carriere && (
                                <div className="d-flex align-items-center mb-1">
                                  <FaBriefcaseMedical className="text-success me-1" />
                                  <span>{calculerExperience(med.debut_carriere)}</span>
                                </div>
                              )}
                              
                              {/* Évaluation */}
                              {evaluationsMedecins[med.id] > 0 && (
                                <div className="d-flex align-items-center">
                                  <div style={{ display: 'flex', color: '#ffc107' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <span key={star}>
                                        {evaluationsMedecins[med.id] >= star - 0.5 ? 
                                          (evaluationsMedecins[med.id] >= star ? '★' : '⭐') : 
                                          '☆'}
                                      </span>
                                    ))}
                                  </div>
                                  <span className="ms-1 text-muted">
                                    ({evaluationsMedecins[med.id]})
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* Bouton Prendre Rendez-vous */}
                            <button
                              className="btn px-3 py-2 d-flex align-items-center"
                              style={{ 
                                backgroundColor: '#226D68', 
                                color: 'white',
                                borderRadius: '4px',
                                border: 'none'
                              }}
                              onClick={() => {
                                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                                if (!currentUser) {
                                  localStorage.setItem('redirect_after_login', 'rendezvous');
                                  localStorage.setItem('email_medecin_rdv', med.email);
                                  navigate('/login');
                                  
                                } else {
                                  localStorage.setItem('email_medecin_rdv', med.email);
                                  navigate('/rendezvous');
                                }
                              }}
                            >
                              <FaCalendarCheck className="me-2 " />
                              Prendre Rendez-vous
                            </button>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted p-4">Aucun médecin à afficher</p>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      {/* NOUVELLE SECTION: Avantages du service */}
      <div className="py-5 border-top bg-white">
        <Container>
          <h2 className="text-center mb-4 fw-bold" style={{ color: '#007A74' }}>Pourquoi prendre rendez-vous avec SahTech ?</h2>
          <Row className="text-center">
            <Col md={4} className="mb-4 mb-md-0">
              <div className="d-flex flex-column align-items-center">
                <div className="mb-3" style={{ width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={medecinsImage} 
                    alt="Médecin et infirmière" 
                    className="img-fluid"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
                <h5 className="fw-bold mb-2">Accédez rapidement à votre médecin</h5>
                <p className="text-muted small">Trouvez facilement le spécialiste dont vous avez besoin</p>
              </div>
            </Col>
            
            <Col md={4} className="mb-4 mb-md-0">
              <div className="d-flex flex-column align-items-center">
                <div className="mb-3" style={{ width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={rendezvousImage} 
                    alt="Téléphone avec application" 
                    className="img-fluid"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
                <h5 className="fw-bold mb-2">Prenez rendez-vous en ligne à tout moment</h5>
                <p className="text-muted small">Réservez votre consultation 24h/24 et 7j/7</p>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="d-flex flex-column align-items-center">
                <div className="mb-3" style={{ width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={consultationImage} 
                    alt="Notification sur téléphone" 
                    className="img-fluid"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
                <h5 className="fw-bold mb-2">Recevez des SMS/mail de rappel personnalisés</h5>
                <p className="text-muted small">Ne manquez plus jamais vos rendez-vous médicaux</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Accueil;
