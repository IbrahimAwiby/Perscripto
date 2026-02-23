// pages/PaymentFailed.jsx
import { useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaTimesCircle className="text-red-500 text-3xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h2>
        <p className="text-gray-600 mb-6">
          Please try again or use another payment method.
        </p>
        <button
          onClick={() => navigate("/my-appointments")}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default PaymentFailed;
