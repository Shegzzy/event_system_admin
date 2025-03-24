import "./qrcode.css";
import React, { useState } from "react";
import { db } from "../../firebaseConfig";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const AdminQRScanner = () => {
  const [scanResult, setScanResult] = useState("");
  const [guest, setGuest] = useState(null);
  const [error, setError] = useState("");

  const handleScan = async (data) => {
    if (data) {
      setScanResult(data);
      await fetchGuestDetails(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError("QR Scan Error. Please try again.");
  };

  const fetchGuestDetails = async (guestId) => {
    const guestRef = doc(db, "guests", guestId);
    const guestSnap = await getDoc(guestRef);

    if (guestSnap.exists()) {
      setGuest({ id: guestId, ...guestSnap.data() });
    } else {
      setError("Invalid QR Code!");
    }
  };

  const handleCheckIn = async () => {
    if (!guest) return;

    const guestRef = doc(db, "guests", guest.id);
    await updateDoc(guestRef, { checkedIn: true });

    alert("Guest checked in successfully!");
    setGuest({ ...guest, checkedIn: true });
  };

  return (
    <div className="scanner">
      <h2>Admin QR Code Scanner</h2>

      <BarcodeScannerComponent
        width={500}
        height={500}
        onUpdate={(error, result) => {
          if (result) handleScan(result?.text);
          if (error) handleError(error);
        }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      {guest && (
        <div>
          <p><strong>Name:</strong> {guest.name}</p>
          <p><strong>Email:</strong> {guest.email}</p>
          <p><strong>Status:</strong> {guest.checkedIn ? "Already Checked In" : "Not Checked In"}</p>
          {!guest.checkedIn && <button onClick={handleCheckIn}>Check In</button>}
        </div>
      )}
    </div>
  );
};

export default AdminQRScanner;
