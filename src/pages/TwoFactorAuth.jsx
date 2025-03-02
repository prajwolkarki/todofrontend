import { useState, useEffect } from "react";
import axios from "axios";

const TwoFactorAuth = () => {
  const [qrCode, setQrCode] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  // Fetch QR Code for 2FA Setup
  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/setup2FA`, {
          withCredentials: true, 
        });
        setQrCode(response.data.qrCode);
      } catch (error) {
        console.error("Error fetching QR Code:", error.response?.data?.message || error.message);
      }
    };

    fetchQRCode();
  }, []);

  // Verify 2FA Token
  const verifyToken = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/verify2FA`,
        { token },
        { withCredentials: true }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid Token");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Two-Factor Authentication</h2>

        {qrCode ? (
          <>
            <p className="mb-2">Scan this QR Code with Google Authenticator:</p>
            <img src={qrCode} alt="QR Code" className="mx-auto mb-4" />
          </>
        ) : (
          <p>Loading QR Code...</p>
        )}

        {/* Token Verification Form */}
        <form onSubmit={verifyToken} className="space-y-4">
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Verify
          </button>
        </form>

        {message && <p className="mt-3 text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default TwoFactorAuth;
