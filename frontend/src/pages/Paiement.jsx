// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// function ExpandedBilling() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [city, setCity] = useState("");
//   const [zipCode, setZipCode] = useState("");
//   const [cardNumber, setCardNumber] = useState("");
//   const [expirationDate, setExpirationDate] = useState("");
//   const [securityCode, setSecurityCode] = useState("");
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
//   const [formValid, setFormValid] = useState(false);
//   const [isValidating, setIsValidating] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setFormValid(
//       name &&
//         email &&
//         city &&
//         zipCode &&
//         (selectedPaymentMethod !== "Carte bancaire" ||
//           (cardNumber && expirationDate && securityCode))
//     );
//   }, [
//     name,
//     email,
//     city,
//     zipCode,
//     cardNumber,
//     expirationDate,
//     securityCode,
//     selectedPaymentMethod,
//   ]);

//   const handlePayer = () => {
//     setIsValidating(true);
//     setTimeout(() => {
//       navigate("/facture");
//     }, 2000);
//   };

//   return (
//     <div className="flex flex-col px-11 py-12 bg-white rounded-xl max-w-[570px] mx-auto relative">
//       <div className="text-xl font-bold tracking-tight text-gray-900 mb-6">
//         Détails de paiement
//       </div>

//       <form className="space-y-6 relative">
//         {/* Form inputs */}
//         <div>
//           <label className="block text-sm font-semibold">Nom sur la carte</label>
//           <input
//             type="text"
//             placeholder="Ex. Ali Ben Salah"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-semibold">Email</label>
//           <input
//             type="email"
//             placeholder="Ex. ali@email.com"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
//           />
//         </div>

//         <div className="flex gap-4">
//           <div className="w-1/2">
//             <label className="block text-sm font-semibold">Ville</label>
//             <input
//               type="text"
//               placeholder="Ex. Tunis"
//               value={city}
//               onChange={(e) => setCity(e.target.value)}
//               className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             />
//           </div>
//           <div className="w-1/2">
//             <label className="block text-sm font-semibold">Code postal</label>
//             <input
//               type="text"
//               placeholder="Ex. 1000"
//               value={zipCode}
//               onChange={(e) => setZipCode(e.target.value)}
//               className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-semibold">Méthode de paiement</label>
//           <div className="flex items-center gap-3 mt-2">
//             <input
//               type="radio"
//               id="carte"
//               name="paymentMethod"
//               value="Carte bancaire"
//               checked={selectedPaymentMethod === "Carte bancaire"}
//               onChange={() => setSelectedPaymentMethod("Carte bancaire")}
//             />
//             <label htmlFor="carte" className="flex items-center gap-2 cursor-pointer">
//               Carte bancaire
//               <img
//                 src="https://cdn.builder.io/api/v1/image/assets/TEMP/4db0d52251e2e85e15017213b714600ca26e64c54ff09930ee211678706a17a1"
//                 alt="Carte"
//                 className="w-16 h-auto"
//               />
//             </label>
//           </div>
//           <div className="flex items-center gap-3 mt-3">
//             <input
//               type="radio"
//               id="paypal"
//               name="paymentMethod"
//               value="Paypal"
//               checked={selectedPaymentMethod === "Paypal"}
//               onChange={() => setSelectedPaymentMethod("Paypal")}
//             />
//             <label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
//               PayPal
//               <img
//                 src="https://cdn.builder.io/api/v1/image/assets/TEMP/756d0d7d2cce75e81a9eb66888e66133b11cd90d6368354a8a83f397a48a2418"
//                 alt="PayPal"
//                 className="w-20 h-auto"
//               />
//             </label>
//           </div>
//         </div>

//         {selectedPaymentMethod === "Carte bancaire" && (
//           <>
//             <div>
//               <label className="block text-sm font-semibold">Numéro de carte</label>
//               <input
//                 type="text"
//                 placeholder="1111 2222 3333 4444"
//                 value={cardNumber}
//                 onChange={(e) => setCardNumber(e.target.value)}
//                 className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               />
//             </div>
//             <div className="flex gap-4">
//               <div className="w-1/2">
//                 <label className="block text-sm font-semibold">Expiration</label>
//                 <input
//                   type="text"
//                   placeholder="MM/AA"
//                   value={expirationDate}
//                   onChange={(e) => setExpirationDate(e.target.value)}
//                   className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                 />
//               </div>
//               <div className="w-1/2">
//                 <label className="block text-sm font-semibold">Code sécurité</label>
//                 <input
//                   type="text"
//                   placeholder="CVC"
//                   value={securityCode}
//                   onChange={(e) => setSecurityCode(e.target.value)}
//                   className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                 />
//               </div>
//             </div>
//           </>
//         )}

//         {/* Ton bouton bleu */}
//         <button
//           type="button"
//           className="btn w-100"
//           style={{
//             backgroundColor: "#89CFF0",
//             color: "white",
//             fontWeight: "bold",
//             border: "none",
//           }}
//           onClick={handlePayer}
//         >
//           Payer
//         </button>

//         {/* Chargement centré dans le formulaire */}
//         {isValidating && (
//           <div style={{
//             position: 'absolute',
//             top: '40%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             textAlign: 'center'
//           }}>
//             <div style={{
//               width: '40px',
//               height: '40px',
//               border: '5px solid #38a169',
//               borderTop: '5px solid transparent',
//               borderRadius: '50%',
//               margin: '0 auto',
//               animation: 'spin 1s linear infinite'
//             }} />
//             <div style={{ marginTop: '10px', color: '#38a169', fontWeight: 'bold' }}>
//               Validation du paiement...
//             </div>
//             <style>
//               {`@keyframes spin {
//                 0% { transform: rotate(0deg); }
//                 100% { transform: rotate(360deg); }
//               }`}
//             </style>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// }

// export default ExpandedBilling;
// ✅ Mise à jour de la page Paiement.jsx :
// "Confirmer et payer" crée le rendez-vous & redirige vers /facture

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ExpandedBilling() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [formValid, setFormValid] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFormValid(
      name &&
        email &&
        city &&
        zipCode &&
        (selectedPaymentMethod !== "Carte bancaire" ||
          (cardNumber && expirationDate && securityCode))
    );
  }, [
    name,
    email,
    city,
    zipCode,
    cardNumber,
    expirationDate,
    securityCode,
    selectedPaymentMethod,
  ]);

  const handlePayer = async () => {
    setIsValidating(true);

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const patient_email = currentUser?.email;
    const medecin_email = localStorage.getItem("pending_rdv_medecin");
    const slot = localStorage.getItem("pending_rdv_slot");
    const type = localStorage.getItem("pending_rdv_type");
    const mode = localStorage.getItem("pending_rdv_mode");

    if (!slot || !patient_email || !medecin_email) {
      alert("Informations de rendez-vous manquantes");
      return;
    }

    const [dayString, heure] = slot.split("_");
    const date = new Date(dayString);
    const formattedDate = date.toISOString().split("T")[0];

    const payload = {
      patient_email,
      medecin_email,
      date: formattedDate,
      heure,
      type_consultation: type,
      mode,
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/rendezvous/create/", payload);
      setTimeout(() => {
        navigate("/facture");
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de la confirmation du rendez-vous :", error);
      alert("Erreur lors de la confirmation du rendez-vous");
    }
  };

  return (
    <div className="flex flex-col px-11 py-12 bg-white rounded-xl max-w-[570px] mx-auto relative">
      <div className="text-xl font-bold tracking-tight text-gray-900 mb-6">
        Détails de paiement
      </div>

      <form className="space-y-6 relative">
        {/* Form inputs */}
        <div>
          <label className="block text-sm font-semibold">Nom sur la carte</label>
          <input
            type="text"
            placeholder="Ex. Ali Ben Salah"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Email</label>
          <input
            type="email"
            placeholder="Ex. ali@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-semibold">Ville</label>
            <input
              type="text"
              placeholder="Ex. Tunis"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-semibold">Code postal</label>
            <input
              type="text"
              placeholder="Ex. 1000"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold">Méthode de paiement</label>
          <div className="flex items-center gap-3 mt-2">
            <input
              type="radio"
              id="carte"
              name="paymentMethod"
              value="Carte bancaire"
              checked={selectedPaymentMethod === "Carte bancaire"}
              onChange={() => setSelectedPaymentMethod("Carte bancaire")}
            />
            <label htmlFor="carte" className="flex items-center gap-2 cursor-pointer">
              Carte bancaire
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/4db0d52251e2e85e15017213b714600ca26e64c54ff09930ee211678706a17a1"
                alt="Carte"
                className="w-16 h-auto"
              />
            </label>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <input
              type="radio"
              id="paypal"
              name="paymentMethod"
              value="Paypal"
              checked={selectedPaymentMethod === "Paypal"}
              onChange={() => setSelectedPaymentMethod("Paypal")}
            />
            <label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
              PayPal
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/756d0d7d2cce75e81a9eb66888e66133b11cd90d6368354a8a83f397a48a2418"
                alt="PayPal"
                className="w-20 h-auto"
              />
            </label>
          </div>
        </div>

        {selectedPaymentMethod === "Carte bancaire" && (
          <>
            <div>
              <label className="block text-sm font-semibold">Numéro de carte</label>
              <input
                type="text"
                placeholder="1111 2222 3333 4444"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-semibold">Expiration</label>
                <input
                  type="text"
                  placeholder="MM/AA"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold">Code sécurité</label>
                <input
                  type="text"
                  placeholder="CVC"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                  className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>
          </>
        )}

        <button
          type="button"
          className="btn w-100"
          style={{
            backgroundColor: "#89CFF0",
            color: "white",
            fontWeight: "bold",
            border: "none",
          }}
          onClick={handlePayer}
        >
          Confirmer et payer
        </button>

        {isValidating && (
          <div style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '5px solid #38a169',
              borderTop: '5px solid transparent',
              borderRadius: '50%',
              margin: '0 auto',
              animation: 'spin 1s linear infinite'
            }} />
            <div style={{ marginTop: '10px', color: '#38a169', fontWeight: 'bold' }}>
              Validation du paiement...
            </div>
            <style>
              {`@keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }`}
            </style>
          </div>
        )}
      </form>
    </div>
  );
}

export default ExpandedBilling;
