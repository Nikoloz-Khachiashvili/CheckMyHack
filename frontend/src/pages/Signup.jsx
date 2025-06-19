// frontend/src/pages/Signup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Password strength checker
  const checkStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[\W_]/.test(pwd)) strength++;

    if (strength <= 1) return 'Weak';
    if (strength === 2 || strength === 3) return 'Moderate';
    if (strength === 4) return 'Strong';
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setPasswordStrength(checkStrength(val));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Block weak passwords
    if (passwordStrength === 'Weak' || !passwordStrength) {
      setErrorMsg(
        'Password too weak. Use 8+ chars, uppercase, number, and special character.'
      );
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/'); // redirect after signup
    } catch (err) {
      const msg = err.response?.data?.error || 'Signup failed';
      setErrorMsg(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">Sign Up</h2>
      <form onSubmit={handleSignup} className="flex flex-col gap-4 relative">
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            required
            value={password}
            onChange={handlePasswordChange}
            className="px-4 py-2 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {password && (
          <p
            className={`text-sm font-semibold ${
              passwordStrength === 'Weak'
                ? 'text-red-600'
                : passwordStrength === 'Moderate'
                ? 'text-yellow-500'
                : 'text-green-600'
            }`}
          >
            Password strength: {passwordStrength}
          </p>
        )}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          Sign Up
        </button>

        {errorMsg && <p className="text-red-600 text-center">{errorMsg}</p>}
      </form>
    </div>
  );
};

export default Signup;
