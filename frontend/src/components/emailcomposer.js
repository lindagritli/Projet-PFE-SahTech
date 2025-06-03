import React from 'react';

function EmailComposer() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📧 Nouveau message</h2>

      <div style={styles.field}>
        <label>De :</label>
        <input type="email" value="mon.email@example.com" disabled style={styles.input} />
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
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    backgroundColor: '#f4f6fb',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    fontFamily: 'Segoe UI, sans-serif',
  },
  title: {
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333',
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
    height: '120px',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    resize: 'vertical',
  },
  fileInput: {
    border: 'none',
    marginTop: '5px',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '12px',
    backgroundColor: '#0066cc',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default EmailComposer;
