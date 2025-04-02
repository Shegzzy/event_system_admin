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
    if (data && data !== scanResult) {
      setScanResult(data);
      setError(""); // Clear previous errors
      await fetchGuestDetails(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError("QR Scan Error. Please try again.");
  };

  const fetchGuestDetails = async (guestId) => {
    try {
      const guestRef = doc(db, "attendees", guestId); // Ensure you fetch from the correct collection
      const guestSnap = await getDoc(guestRef);

      if (guestSnap.exists()) {
        setGuest({ id: guestId, ...guestSnap.data() });
      } else {
        setError("Invalid QR Code!");
        setGuest(null);
      }
    } catch (err) {
      setError("Error fetching guest details. Try again.");
    }
  };

  const handleCheckIn = async () => {
    if (!guest || guest.status === "checked in") return;

    try {
      const guestRef = doc(db, "attendees", guest.id);
      await updateDoc(guestRef, { status: "checked in" });

      alert(`${guest.name} has been checked in!`);
      setGuest({ ...guest, status: "checked in" });
    } catch (err) {
      setError("Error updating check-in status. Try again.");
    }
  };

  return (
    <div className="scanner">
      <h2>Admin QR Code Scanner</h2>

      <div className="cam-scanner">
      <BarcodeScannerComponent
        width={500}
        height={500}
        onUpdate={(err, result) => {
          if (result) handleScan(result.text);
          if (err) handleError(err);
        }}
      />

      {error && <p className="error">{error}</p>}

      {guest && (
        <div className="guest-info">
          <p><strong>Name:</strong> {guest.name}</p>
          <p><strong>Email:</strong> {guest.email}</p>
          <p><strong>Status:</strong> {guest.status === "checked in" ? "Already Checked In" : "Not Checked In"}</p>
          {guest.status !== "checked in" && (
            <button onClick={handleCheckIn}>Check In</button>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminQRScanner;
