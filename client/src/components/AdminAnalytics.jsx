import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/analytics');
      setStats(res.data);
    } catch (e) {
      setError('Failed to load analytics.');
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!stats) return <div className="text-slate-400">Loading analytics...</div>;

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <StatCard label="Total Listings" value={stats.totalListings} />
        <StatCard label="Total Bookings" value={stats.totalBookings} />
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Visit Requests" value={stats.totalVisitRequests} />
      </div>

      {/* Most Booked Area */}
      <div>
        <h3 className="text-xl font-semibold text-slate-300 mb-2">Most Booked Area</h3>
        <div className="bg-slate-800 p-4 rounded-xl text-slate-100">
          {stats.mostBookedArea || 'N/A'}
        </div>
      </div>

      {/* Top Rated PGs */}
      <div>
        <h3 className="text-xl font-semibold text-slate-300 mb-2">Top Rated PGs</h3>
        {stats.topRatedPGs && stats.topRatedPGs.length > 0 ? (
          <ul className="list-disc list-inside text-slate-100 space-y-1">
            {stats.topRatedPGs.map(pg => (
              <li key={pg._id}>
                <span className="font-semibold">{pg.title}</span> – {pg.rating.toFixed(1)}⭐
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-slate-400">No top PGs found.</div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="p-5 bg-slate-800 rounded-xl shadow text-slate-200">
      <div className="text-sm mb-1">{label}</div>
      <div className="text-2xl font-bold">{value ?? 0}</div>
    </div>
  );
}
