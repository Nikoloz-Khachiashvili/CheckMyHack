import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import API from '../api'; // ✅ NEW: Import secure axios instance

const Home = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/check', { email });

      // ✅ Use API instead of axios to include token
      await API.post('/api/history', {
        email,
        breachCount: response.data.length,
        checkedAt: new Date().toISOString(),
      });

      setLoading(false);
      navigate('/result', { state: { data: response.data, email } });
    } catch (err) {
      setLoading(false);
      if (err.response) {
        setErrorMsg(`Error: ${err.response.data.error || 'Failed to check breach'}`);
      } else {
        setErrorMsg('Network error, please try again.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        CheckMyHack
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <button
          type="submit"
          disabled={loading}
          className="relative bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {loading ? (
            <ClipLoader size={20} color="#fff" />
          ) : (
            'Check'
          )}
        </button>
      </form>

      {errorMsg && (
        <p className="mt-4 text-red-600 dark:text-red-400 text-center font-semibold">
          {errorMsg}
        </p>
      )}
    </div>
  );
};

export default Home;
