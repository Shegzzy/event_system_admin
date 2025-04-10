import "./qrcode.css";
import React, { useState } from "react";
import { db } from "../../firebaseConfig";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

const AdminQRScanner = () => {
  const [scanResult, setScanResult] = useState("");
  const [guest, setGuest] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScan = async (data) => {
    if (data && data !== scanResult) {
      setScanResult(data);
      setError("");
      await fetchGuestDetails(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError("QR Scan Error. Please try again.");
  };

  const fetchGuestDetails = async (qrCode) => {
    setLoading(true); // Show loading indicator
    try {
      const guestRef = collection(db, "attendees");
      const guestQuery = query(guestRef, where("eventQr", "==", qrCode));
      const guestSnap = await getDocs(guestQuery);

      if (!guestSnap.empty) {
        const guestDoc = guestSnap.docs[0];
        const guestData = guestDoc.data();

        setGuest(guestData);
      } else {
        setError("Invalid QR Code!");
        setGuest(null);
      }
    } catch (err) {
      setError("Error fetching guest details. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
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
      console.error(err);
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

        {loading && <p className="loading">Loading...</p>} {/* Show loading indicator */}

        {error && <p className="error">{error}</p>}

        {guest && (
          <div className="guest-info">
            <p><strong>Event:</strong> {guest.eventName}</p>
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
