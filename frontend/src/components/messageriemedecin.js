import React, { useState, useEffect, useRef } from 'react';
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const fileInputRef = useRef(null);

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

  // Gestion du fichier joint
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(file.name);
    }
  };

  // Supprimer le fichier joint
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Envoi du message avec fichier joint
  const handleSend = () => {
    if (!form.destinataire || !form.objet || !form.contenu) {
      alert("Tous les champs sont obligatoires.");
      return;
    }

    // Créer un FormData pour envoyer le fichier
    const formData = new FormData();
    formData.append('expediteur', currentUser.email);
    formData.append('destinataire', form.destinataire);
    formData.append('objet', form.objet);
    formData.append('contenu', form.contenu);
    
    if (selectedFile) {
      formData.append('pieces_jointe', selectedFile);
    }

    axios.post(`http://127.0.0.1:8000/api/messages/send/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(() => {
        alert("📤 Message envoyé !");
        setForm({ destinataire: '', objet: '', contenu: '' });
        setSelectedFile(null);
        setFilePreview('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      })
      .catch(() => alert("❌ Erreur lors de l'envoi du message"));
  };

  // Envoi de la réponse directe
  const handleReplySend = () => {
    if (!replyContent || !selectedMessage?.expediteur?.email) return;

    axios.post(`http://127.0.0.1:8000/api/messages/send/`, {
      expediteur: currentUser.email,
      destinataire: selectedMessage.expediteur.email,
      objet: selectedMessage.objet.startsWith('Re:') ? selectedMessage.objet : `Re: ${selectedMessage.objet}`,
      contenu: replyContent
    })
      .then(() => {
        alert("✅ Réponse envoyée !");
        setReplyContent('');
      })
      .catch(() => alert("❌ Erreur lors de l'envoi de la réponse"));
  };

  return (
    <div style={styles.layout}>
      {/* Sidebar - Liste messages */}
      <div style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}>📥 Messages reçus</h3>
        {messages.length > 0 ? (
          messages.map(msg => (
            <div
              key={msg.id}
              style={{
                ...styles.messagePreview,
                backgroundColor: selectedMessage?.id === msg.id ? '#e6f0ff' : '#fff',
                borderLeft: selectedMessage?.id === msg.id ? '4px solid #3498db' : '1px solid #e1e8ed'
              }}
              onClick={() => setSelectedMessage(msg)}
            >
              <strong style={styles.previewSender}>
                {msg.expediteur?.first_name
                  ? `${msg.expediteur.first_name} ${msg.expediteur.last_name}`
                  : msg.expediteur?.email || 'Inconnu'}
              </strong>
              <span style={styles.previewSubject}>{msg.objet}</span>
              <span style={styles.previewDate}>Aujourd'hui</span>
            </div>
          ))
        ) : (
          <p style={styles.emptyInbox}>Aucun message reçu</p>
        )}
      </div>

      {/* Zone lecture + rédaction */}
      <div style={styles.main}>
        <h2 style={styles.sectionTitle}>📨 Détails du message</h2>
        {selectedMessage ? (
          <div style={styles.preview}>
            <div style={styles.messageHeader}>
              <div style={styles.avatarCircle}>
                {selectedMessage.expediteur?.first_name ? selectedMessage.expediteur.first_name[0].toUpperCase() : 'U'}
              </div>
              <div style={styles.messageHeaderInfo}>
                <p style={styles.senderName}>
                  {selectedMessage.expediteur?.first_name
                    ? `${selectedMessage.expediteur.first_name} ${selectedMessage.expediteur.last_name}`
                    : selectedMessage.expediteur?.email || 'Inconnu'}
                </p>
                <p style={styles.messageSubject}>{selectedMessage.objet}</p>
              </div>
            </div>
            <div style={styles.messageContent}>{selectedMessage.contenu}</div>
            
            {/* Affichage de la pièce jointe si présente */}
            {selectedMessage.pieces_jointe && (
              <div style={styles.attachmentSection}>
                <p style={styles.attachmentTitle}>📎 Pièce jointe :</p>
                <a 
                  href={selectedMessage.pieces_jointe} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={styles.attachmentLink}
                >
                  Télécharger le fichier
                </a>
              </div>
            )}

            {/* Bloc de réponse intégré */}
            <div style={styles.replySection}>
              <label style={styles.replyLabel}>↩️ Répondre</label>
              <textarea
                placeholder="Votre réponse ici..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                style={styles.textarea}
              ></textarea>
              <button onClick={handleReplySend} style={styles.button}>
                <span style={styles.buttonIcon}>↗️</span> Envoyer la réponse
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.emptyPreview}>
            <div style={styles.emptyPreviewIcon}>📩</div>
            <p style={styles.emptyPreviewText}>Sélectionnez un message pour l'afficher</p>
          </div>
        )}

        <div style={styles.divider}></div>

        <div style={styles.composeSection}>
          <h2 style={styles.sectionTitle}>✍️ Nouveau message</h2>
          <div style={styles.composeForm}>
            <div style={styles.field}>
              <label style={styles.label}>À :</label>
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
              <label style={styles.label}>Objet :</label>
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
              <label style={styles.label}>Message :</label>
              <textarea
                name="contenu"
                placeholder="Écrivez votre message ici..."
                value={form.contenu}
                onChange={handleChange}
                style={styles.textarea}
              ></textarea>
            </div>
            
            {/* Section pour joindre un fichier */}
            <div style={styles.field}>
              <label style={styles.label}>📎 Pièce jointe :</label>
              <div style={styles.fileInputContainer}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={styles.fileInput}
                  id="file-upload"
                />
                <label htmlFor="file-upload" style={styles.fileInputLabel}>
                  Choisir un fichier
                </label>
                {filePreview && (
                  <div style={styles.filePreviewContainer}>
                    <span style={styles.filePreviewName}>{filePreview}</span>
                    <button 
                      onClick={handleRemoveFile} 
                      style={styles.removeFileButton}
                      title="Supprimer le fichier"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <button onClick={handleSend} style={styles.sendButton}>
              <span style={styles.buttonIcon}>📤</span> Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: 'flex',
    fontFamily: '"Poppins", "Segoe UI", sans-serif',
    minHeight: '85vh',
    backgroundColor: '#f8fafc',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    borderRadius: '16px',
    overflow: 'hidden',
    margin: '20px',
  },
  sidebar: {
    width: '30%',
    backgroundColor: '#C7E7DE',
    padding: '25px',
    borderRight: '1px solid #A5D5C8',
    boxShadow: 'inset -5px 0 15px -5px rgba(0, 0, 0, 0.05)',
    overflowY: 'auto',
  },
  sidebarTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#0E3843',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '2px solid #75B5A3',
    letterSpacing: '0.5px',
  },
  main: {
    width: '70%',
    padding: '30px 40px',
    backgroundColor: '#ffffff',
    overflowY: 'auto',
  },
  messagePreview: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    marginBottom: '15px',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    position: 'relative',
  },
  previewSender: {
    fontSize: '16px',
    color: '#1e293b',
    marginBottom: '5px',
  },
  previewSubject: {
    fontSize: '14px',
    color: '#64748b',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  previewDate: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    fontSize: '12px',
    color: '#94a3b8',
  },
  preview: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
  },
  messageHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid #e2e8f0',
  },
  avatarCircle: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#0E3843',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    marginRight: '15px',
  },
  messageHeaderInfo: {
    flex: 1,
  },
  senderName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 5px 0',
  },
  messageSubject: {
    fontSize: '16px',
    color: '#64748b',
    margin: 0,
  },
  messageContent: {
    lineHeight: '1.8',
    color: '#334155',
    padding: '15px 0 25px 0',
    fontSize: '16px',
    borderBottom: '1px solid #e2e8f0',
  },
  replySection: {
    marginTop: '25px',
    padding: '20px',
    backgroundColor: '#f1f5f9',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
  },
  replyLabel: {
    display: 'block',
    marginBottom: '15px',
    color: '#1e293b',
    fontWeight: '600',
    fontSize: '16px',
  },
  field: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    fontWeight: '500',
    color: '#334155',
    fontSize: '15px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#f8fafc',
  },
  textarea: {
    width: '100%',
    height: '150px',
    padding: '14px 16px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    resize: 'vertical',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#f8fafc',
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '15px',
    padding: '12px 24px',
    backgroundColor: '#0E3843',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(14, 56, 67, 0.3)',
  },
  buttonIcon: {
    fontSize: '18px',
  },
  sendButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '15px',
    padding: '14px 28px',
    backgroundColor: '#0E3843',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(14, 56, 67, 0.3)',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0E3843',
    marginBottom: '25px',
    position: 'relative',
    paddingBottom: '10px',
  },
  divider: {
    margin: '40px 0',
    height: '1px',
    backgroundColor: '#e2e8f0',
    position: 'relative',
  },
  emptyPreview: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 0',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px dashed #cbd5e1',
  },
  emptyPreviewIcon: {
    fontSize: '40px',
    marginBottom: '20px',
  },
  emptyPreviewText: {
    color: '#64748b',
    fontSize: '16px',
  },
  emptyInbox: {
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '30px',
    backgroundColor: '#E5F2ED',
    borderRadius: '10px',
    border: '1px dashed #A5D5C8',
  },
  composeSection: {
    backgroundColor: '#f8fafc',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  },
  composeForm: {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  },
  // Styles pour la fonctionnalité de pièce jointe
  fileInputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  fileInput: {
    display: 'none',
  },
  fileInputLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 20px',
    backgroundColor: '#f1f5f9',
    color: '#334155',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    width: 'fit-content',
  },
  filePreviewContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 15px',
    backgroundColor: '#e0f2f1',
    borderRadius: '8px',
    marginTop: '10px',
  },
  filePreviewName: {
    flex: 1,
    fontSize: '14px',
    color: '#0E3843',
    fontWeight: '500',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  removeFileButton: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '0 5px',
  },
  attachmentSection: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  attachmentTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '10px',
  },
  attachmentLink: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: '#e0f2f1',
    color: '#0E3843',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  }
};

export default MessagerieInterface;