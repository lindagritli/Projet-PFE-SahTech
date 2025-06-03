import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';

function HeaderBar() {
  const navigate = useNavigate();

  // 🔁 Retour arrière
  const handleBack = () => navigate(-1);

  // 🔓 Déconnexion
  const handleLogout = () => {
    localStorage.clear();
    navigate('/'); // redirige vers accueil
  };

  return (
    <div className="d-flex justify-content-between align-items-center p-3 bg-light border-bottom">
      <Button variant="outline-primary" onClick={handleBack}>
        <FaArrowLeft /> Retour
      </Button>
      <Button variant="outline-danger" onClick={handleLogout}>
        <FaSignOutAlt /> Déconnexion
      </Button>
    </div>
  );
}

export default HeaderBar;
