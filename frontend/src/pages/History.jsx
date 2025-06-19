import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEntries(res.data);
        setFilteredEntries(res.data);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate, token]);

  useEffect(() => {
    let updated = [...entries];

    if (search) {
      updated = updated.filter((entry) =>
        entry.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === 'recent') {
      updated.sort((a, b) => new Date(b.checkedAt) - new Date(a.checkedAt));
    } else if (sortBy === 'oldest') {
      updated.sort((a, b) => new Date(a.checkedAt) - new Date(b.checkedAt));
    } else if (sortBy === 'breaches-high') {
      updated.sort((a, b) => b.breachCount - a.breachCount);
    } else if (sortBy === 'breaches-low') {
      updated.sort((a, b) => a.breachCount - b.breachCount);
    }

    setFilteredEntries(updated);
  }, [search, sortBy, entries]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove deleted entry from state
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      console.error('Failed to delete entry:', err);
      alert('Failed to delete entry');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
        Search History
      </h2>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <input
          type="text"
          placeholder="Search email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="recent">Most Recent</option>
          <option value="oldest">Oldest</option>
          <option value="breaches-high">Breaches: High → Low</option>
          <option value="breaches-low">Breaches: Low → High</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : filteredEntries.length === 0 ? (
        <p className="text-center text-gray-500">No matching history found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredEntries.map((entry) => (
            <li
              key={entry.id}
              className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md flex justify-between items-center"
            >
              <div>
                <p className="text-gray-800 dark:text-gray-200">
                  <strong>Email:</strong> {entry.email}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Breaches:</strong> {entry.breachCount}
                </p>
                <p className="text-gray-500 text-sm dark:text-gray-400">
                  <strong>Checked:</strong> {new Date(entry.checkedAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(entry.id)}
                className="ml-4 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition"
                aria-label="Delete entry"
                title="Delete entry"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
