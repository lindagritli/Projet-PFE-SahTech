// ancienne version du chat : décommissionnée
import React, { useState } from 'react';

function ChatIA() {
  const [question, setQuestion] = useState('');
  const [reponse, setReponse] = useState('');

  const handleEnvoyer = async () => {
    if (!question.trim()) return;

    try {
      const res = await fetch('http://127.0.0.1:8000/api/ia/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });

      const data = await res.json();
      setReponse(data.reponse);
    } catch (err) {
      setReponse("Erreur de connexion avec le serveur.");
    }
  };

  return (
    <div className="card shadow p-3" style={{ width: '250px' }}>
      <h6>Chat IA</h6>
      <p className="text-muted">Posez-moi vos questions !</p>
      <input
        type="text"
        className="form-control"
        placeholder="Écrivez ici..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button className="btn btn-info btn-sm mt-2 w-100" onClick={handleEnvoyer}>
        Envoyer
      </button>
      {reponse && (
        <div className="alert alert-info mt-3">
          <strong>IA :</strong> {reponse}
        </div>
      )}
    </div>
  );
}

export default ChatIA;
