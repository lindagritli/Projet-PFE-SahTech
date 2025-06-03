import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import backgroundauth from '../assets/backgroundauth.jpg'; // Remplace selon ton chemin

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'patient'
  });

  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setMessage("✅ Inscription réussie !");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setSuccess(false);
        setMessage(data?.error || "Erreur lors de l'inscription.");
      }
    } catch (error) {
      setSuccess(false);
      setMessage("Erreur de connexion au serveur.");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundauth})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0,0,0,0)',
          position: 'absolute',
          inset: 0,
          zIndex: 1
        }}
      ></div>

       {/* ✅ Navbar arrondie flottante */}
      <div className="absolute top-8 left-4 right-4 bg-[#007A74] text-white shadow-lg rounded-full px-10 py-4 z-10">
        <div className="flex items-center justify-between max-w-[1700px] mx-auto">
          <h1 className="text-2xl font-bold tracking-wide flex items-center space-x-2">
            <div className="loader scale-75 mr-3 flex">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="orbe" style={{ '--index': i }}></div>
              ))}
            </div>
            <span>SahTech</span>
          </h1>
          <div className="flex gap-8 font-medium text-lg">
            <span className="cursor-pointer hover:underline" onClick={() => navigate('/rendezvous')}>Prendre un Rendez-vous</span>
            <span className="cursor-pointer hover:underline" onClick={() => navigate('/signup')}>S’inscrire</span>
            <span className="cursor-pointer hover:underline" onClick={() => navigate('/login')}>Se connecter</span>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh', position: 'relative', zIndex: 2 }}>
        <div className="custom-container" style={{ marginTop: '150px' }}>
          <p className="title">Créer un compte</p>

          {message && (
            <div className={`alert ${success ? 'alert-success' : 'alert-danger'}`}>
              {message}
            </div>
          )}

          <form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              className="input"
              placeholder="Nom d'utilisateur"
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              className="input"
              placeholder="Email"
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              className="input"
              placeholder="Mot de passe"
              onChange={handleChange}
              required
            />

            <div className="mt-3 text-center">
              <label className="me-3">Vous êtes :</label>
              <label className="me-2">
                <input
                  type="radio"
                  name="role"
                  value="patient"
                  checked={formData.role === 'patient'}
                  onChange={handleChange}
                /> Patient
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="medecin"
                  checked={formData.role === 'medecin'}
                  onChange={handleChange}
                /> Médecin
              </label>
            </div>

            <button type="submit" className="form-btn">S'inscrire</button>
          </form>

          <p className="sign-up-label">
            Vous avez déjà un compte ?<span className="sign-up-link" onClick={() => navigate('/login')}> Se connecter</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;