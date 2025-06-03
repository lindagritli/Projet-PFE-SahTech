import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MessagerieInterface() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({
    destinataire: '',
    objet: '',
    contenu: ''
  });
  const [replyContent, setReplyContent] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // Charger les messages reçus
  useEffect(() => {
    if (!currentUser?.email) return;
    axios.get(`http://127.0.0.1:8000/api/messages/inbox/${currentUser.email}/`)
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));
  }, [currentUser?.email]);

  // Gestion des champs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Envoi du message
  const handleSend = () => {
    if (!form.destinataire || !form.objet || !form.contenu) {
      alert("Tous les champs sont obligatoires.");
      return;
    }

    axios.post(`http://127.0.0.1:8000/api/messages/send/`, {
      expediteur: currentUser.email,
      destinataire: form.destinataire,
      objet: form.objet,
      contenu: form.contenu
    })
      .then(() => {
        alert("📤 Message envoyé !");
        setForm({ destinataire: '', objet: '', contenu: '' });
      })
      .catch(() => alert("❌ Erreur lors de l'envoi du message"));
  };

  // Envoi réponse rapide
  const handleReplySend = () => {
    if (!replyContent || !selectedMessage?.expediteur?.email) return;

    axios.post(`http://127.0.0.1:8000/api/messages/send/`, {
      expediteur: currentUser.email,
      destinataire: selectedMessage.expediteur.email,
      objet: selectedMessage.objet.startsWith('Re:') ? selectedMessage.objet : `Re: ${selectedMessage.objet}`,
      contenu: replyContent
    })
      .then(() => {
        alert("📨 Réponse envoyée !");
        setReplyContent('');
      })
      .catch(() => alert("❌ Erreur lors de la réponse"));
  };

  return (
    <div style={styles.layout}>
      {/* Sidebar - Liste messages */}
      <div style={styles.sidebar}>
        <h3 style={styles.title}>📥 Messages reçus</h3>
        {messages.length > 0 ? (
          messages.map(msg => (
            <div
              key={msg.id}
              style={{
                ...styles.messagePreview,
                backgroundColor: selectedMessage?.id === msg.id ? '#eef2ff' : '#fff',
                borderLeft: selectedMessage?.id === msg.id ? '4px solid #0E3843' : '4px solid transparent'
              }}
              onClick={() => setSelectedMessage(msg)}
            >
              <strong style={{color: '#0E3843'}}>{msg.expediteur.email}</strong><br />
              <span style={{color: '#64748b'}}>{msg.objet}</span>
            </div>
          ))
        ) : (
          <p style={styles.emptyState}>Aucun message reçu</p>
        )}
      </div>

      {/* Zone lecture + réponse rapide */}
      <div style={styles.main}>
        <h2 style={styles.title}>📨 Détails du message</h2>
        {selectedMessage ? (
          <div style={styles.preview}>
            <p><strong style={{color: '#0E3843'}}>De :</strong> {selectedMessage.expediteur.email}</p>
            <p><strong style={{color: '#0E3843'}}>Objet :</strong> {selectedMessage.objet}</p>
            <p style={{marginTop: '15px', color: '#334155'}}>{selectedMessage.contenu}</p>

            {/* Réponse intégrée */}
            <div style={{ marginTop: '25px', padding: '20px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
              <label style={{display: 'block', marginBottom: '10px', color: '#0E3843', fontWeight: '500'}}>↩️ Répondre :</label>
              <textarea
                placeholder="Votre réponse ici..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                style={styles.textarea}
              ></textarea>
              <button onClick={handleReplySend} style={styles.button}>
                <span>Envoyer la réponse</span>
                <span>↗️</span>
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.emptyState}>Cliquez sur un message pour l'afficher</div>
        )}

        <div style={styles.divider}></div>

        <h2 style={styles.title}>✍️ Nouveau message</h2>
        <div style={styles.field}>
          <label style={{display: 'block', marginBottom: '8px', color: '#0E3843', fontWeight: '500'}}>À :</label>
          <input
            type="email"
            name="destinataire"
            placeholder="Email du destinataire"
            value={form.destinataire}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={{display: 'block', marginBottom: '8px', color: '#0E3843', fontWeight: '500'}}>Objet :</label>
          <input
            type="text"
            name="objet"
            placeholder="Sujet du message"
            value={form.objet}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={{display: 'block', marginBottom: '8px', color: '#0E3843', fontWeight: '500'}}>Message :</label>
          <textarea
            name="contenu"
            placeholder="Écrivez votre message ici..."
            value={form.contenu}
            onChange={handleChange}
            style={styles.textarea}
          ></textarea>
        </div>
        <button onClick={handleSend} style={styles.button}>
          <span>📤</span>
          <span>Envoyer</span>
        </button>
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: 'flex',
    fontFamily: 'Poppins, Segoe UI, sans-serif',
    minHeight: '90vh',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    borderRadius: '12px',
    overflow: 'hidden',
    margin: '20px',
    backgroundColor: '#fff',
  },
  sidebar: {
    width: '30%',
    backgroundColor: '#f8fafc',
    padding: '25px',
    borderRight: '1px solid #eaedf2',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  main: {
    width: '70%',
    padding: '30px 40px',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  messagePreview: {
    border: 'none',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease',
    borderLeft: '4px solid transparent',
  },
  preview: {
    backgroundColor: '#f9fafb',
    border: 'none',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
    lineHeight: '1.6',
  },
  field: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    backgroundColor: '#f8fafc',
    transition: 'border 0.2s ease',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    height: '120px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    resize: 'vertical',
    outline: 'none',
    transition: 'border 0.2s ease',
  },
  button: {
    marginTop: '15px',
    padding: '12px 20px',
    backgroundColor: '#0E3843',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#0E3843',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#eaedf2',
    margin: '25px 0',
    width: '100%',
  },
  emptyState: {
    color: '#94a3b8',
    fontStyle: 'italic',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px dashed #cbd5e1',
  }
};

export default MessagerieInterface;