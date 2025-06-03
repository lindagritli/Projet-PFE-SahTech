import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MessagerieMedecin() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [inbox, setInbox] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [form, setForm] = useState({
    destinataire: '',
    objet: '',
    contenu: ''
  });

  // Charger les messages reçus du médecin
  useEffect(() => {
    if (currentUser?.email) {
      axios.get(`http://127.0.0.1:8000/api/messages/inbox/${currentUser.email}/`)
        .then(res => setInbox(res.data))
        .catch(err => console.error(err));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSend = () => {
    axios.post(`http://127.0.0.1:8000/api/messages/send/`, {
      expediteur: currentUser.email,
      ...form
    }).then(() => {
      alert("📤 Message envoyé !");
      setForm({ destinataire: '', objet: '', contenu: '' });
    }).catch(() => alert("❌ Erreur lors de l'envoi"));
  };

  return (
    <div style={styles.layout}>
      {/* Sidebar boîte de réception */}
      <div style={styles.sidebar}>
        <h3>📥 Messages reçus</h3>
        {inbox.map(msg => (
          <div
            key={msg.id}
            style={{ ...styles.messagePreview, backgroundColor: selectedMessage?.id === msg.id ? '#e6f0ff' : '#fff' }}
            onClick={() => setSelectedMessage(msg)}
          >
            <strong>{msg.expediteur}</strong><br />
            <span>{msg.objet}</span>
          </div>
        ))}
      </div>

      {/* Zone de rédaction */}
      <div style={styles.main}>
        <h2>📧 Nouveau message</h2>

        <div style={styles.field}>
          <label>De :</label>
          <input type="email" value={currentUser?.email || ''} disabled style={styles.input} />
        </div>

        <div style={styles.field}>
          <label>À :</label>
          <input type="email" name="destinataire" value={form.destinataire} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.field}>
          <label>Objet :</label>
          <input type="text" name="objet" value={form.objet} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.field}>
          <label>Message :</label>
          <textarea name="contenu" value={form.contenu} onChange={handleChange} style={styles.textarea}></textarea>
        </div>

        <button onClick={handleSend} style={styles.button}>📤 Envoyer</button>

        {/* Aperçu message sélectionné */}
        {selectedMessage && (
          <div style={styles.preview}>
            <h4>📨 Message sélectionné :</h4>
            <p><strong>De :</strong> {selectedMessage.expediteur}</p>
            <p><strong>Objet :</strong> {selectedMessage.objet}</p>
            <p>{selectedMessage.contenu}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: 'flex',
    fontFamily: 'Segoe UI, sans-serif',
    minHeight: '100vh',
  },
  sidebar: {
    width: '30%',
    backgroundColor: '#f2f4f7',
    padding: '20px',
    borderRight: '1px solid #ddd',
  },
  main: {
    width: '70%',
    padding: '30px',
    backgroundColor: '#fefefe',
  },
  messagePreview: {
    border: '1px solid #ddd',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  field: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    marginTop: '10px',
    padding: '12px',
    backgroundColor: '#0066cc',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
  },
  preview: {
    marginTop: '40px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ccc',
    padding: '15px',
    borderRadius: '6px',
  }
};

export default MessagerieMedecin;
