import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundAuth from '../assets/backgroundauth.jpg';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setMessage('Connexion réussie !');
        localStorage.setItem('currentUser', JSON.stringify({
          email: data.email || formData.email,
          role: data.role,
          username: data.username,
        }));
        const redirect = localStorage.getItem('redirect_after_login');
        if (redirect === 'rendezvous') {
          localStorage.removeItem('redirect_after_login');
          navigate('/rendezvous');
        } else {
          if (data.role === 'medecin') navigate('/dashboard-medecin');
          else if (data.role === 'patient') navigate('/dashboard-patient');
          else if (data.role === 'admin') navigate('/dashboard-admin');
          else {
            setSuccess(false);
            setMessage(data.error || "Erreur de connexion.");
          }
        }
      }
    } catch (error) {
      setSuccess(false);
      setMessage("Erreur de connexion au serveur.");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundAuth})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
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

      {/* ✅ Formulaire centré */}
      <div className="d-flex justify-content-center align-items-center py-5 w-100" style={{ paddingTop: '120px' }}>
        <div
          className="form-container"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '400px',
            width: '100%',
          }}
        >
          <p className="title">Connexion</p>
          {message && (
            <div className={`alert ${success ? 'alert-success' : 'alert-danger'}`}>
              {message}
            </div>
          )}

          <form className="form" onSubmit={handleSubmit}>
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
            <button type="submit" className="form-btn">Se connecter</button>
          </form>

          <p className="sign-up-label">
            Vous n'avez pas de compte ?
            <span className="sign-up-link" onClick={() => navigate('/signup')}> S’inscrire</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
