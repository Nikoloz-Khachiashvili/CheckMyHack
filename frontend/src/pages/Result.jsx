import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, email } = location.state || {};

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow-md transition-colors mt-8 mx-4 sm:mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100 text-center break-words">
        Results for: {email}
      </h2>

      {data && data.length > 0 ? (
        <>
          {data.map((breach, index) => (
            <div
              key={index}
              className="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 transition-colors"
            >
              <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-gray-100">
                {breach.Name}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                <strong>Date:</strong> {breach.BreachDate}
              </p>
              <p
                className="text-gray-800 dark:text-gray-200"
                dangerouslySetInnerHTML={{ __html: breach.Description }}
              />
            </div>
          ))}

          <div className="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-900 text-sm text-blue-900 dark:text-blue-100 border border-blue-300 dark:border-blue-700">
            <p className="font-semibold">🛡️ Security Tips:</p>
            <ul className="list-disc ml-5 mt-2">
              <li>Use a password manager (e.g., Bitwarden, 1Password).</li>
              <li>Enable two-factor authentication (2FA) where available.</li>
              <li>Avoid reusing passwords across multiple sites.</li>
              <li>Change your password if it was exposed above.</li>
            </ul>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-700 dark:text-gray-300">
          No breaches found for this email!
        </p>
      )}

      <div className="text-center mt-8">
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow transition"
        >
          Check another email
        </button>
      </div>
    </div>
  );
};

export default Result;
