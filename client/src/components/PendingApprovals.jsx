import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PendingApprovals() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingProperties();
  }, []);

  const fetchPendingProperties = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/places/admin/pending');
      setProperties(res.data);
    } catch {
      setError('Failed to fetch pending properties.');
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(`/api/places/admin/${id}/approve`);
      setProperties(prev => prev.filter(p => p._id !== id));
    } catch {
      alert('Failed to approve property.');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(`/api/places/admin/${id}/reject`);
      setProperties(prev => prev.filter(p => p._id !== id));
    } catch {
      alert('Failed to reject property.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <h2 className="text-xl mb-4 font-semibold text-holo-silver">Pending Property Approvals</h2>
      {properties.length === 0 ? (
        <div className="text-holo-silver">No pending properties.</div>
      ) : (
        <table className="w-full border rounded-xl overflow-hidden bg-cosmic-navy text-holo-silver">
          <thead>
            <tr className="bg-void-purple text-neon-cyan">
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Owner</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(p => (
              <tr key={p._id} className="border-b border-holo-border">
                <td className="py-2 px-4 font-bold">{p.title}</td>
                <td className="py-2 px-4">{p.owner}</td>
                <td className="py-2 px-4">{p.status}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button onClick={() => handleApprove(p._id)} className="bg-neon-green text-black px-3 py-1 rounded-xl font-semibold hover:bg-green-400 transition">Approve</button>
                  <button onClick={() => handleReject(p._id)} className="bg-red-500 text-white px-3 py-1 rounded-xl font-semibold hover:bg-red-600 transition">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
