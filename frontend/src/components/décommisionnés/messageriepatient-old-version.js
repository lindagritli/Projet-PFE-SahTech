import React, { useState } from 'react';

function MessagerieInterface() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));


  const messagesFake = [
    { id: 1, expediteur: 'alice@gmail.com', objet: 'Rendez-vous', contenu: 'Je souhaite prendre RDV', lu: false },
    { id: 2, expediteur: 'bob@hopital.com', objet: 'Résultat', contenu: 'Les résultats sont prêts', lu: true }
  ];

  return (
    <div style={styles.layout}>
      {/* Sidebar - Liste messages */}
      <div style={styles.sidebar}>
        <h3>📥 Messages reçus</h3>
        {messagesFake.map(msg => (
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

      {/* Zone rédaction */}
      <div style={styles.main}>
        <h2>📧 Nouveau message</h2>

        <div style={styles.field}>
          <label>De :</label>
          <input type="email" value={currentUser?.email || ''} disabled style={styles.input} />
          </div>

        <div style={styles.field}>
          <label>À :</label>
          <input type="email" placeholder="destinataire@example.com" style={styles.input} />
        </div>

        <div style={styles.field}>
          <label>Objet :</label>
          <input type="text" placeholder="Sujet du message" style={styles.input} />
        </div>

        <div style={styles.field}>
          <label>Message :</label>
          <textarea placeholder="Écrivez votre message ici..." style={styles.textarea}></textarea>
        </div>

        <div style={styles.field}>
          <label>📎 Fichiers :</label>
          <input type="file" multiple style={styles.fileInput} />
        </div>

        <button style={styles.button}>📤 Envoyer</button>

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
  fileInput: {
    marginTop: '5px',
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

export default MessagerieInterface;
