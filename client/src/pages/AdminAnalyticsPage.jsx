import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await axios.get('/api/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats');
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) return <div className="text-center text-holo-silver mt-8">Loading analytics...</div>;
  if (!stats) return <div className="text-red-500 mt-8 text-center">No analytics found</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-cosmic-navy rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold text-neon-cyan mb-6">Admin Analytics Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Total Listings" value={stats.totalListings} />
        <StatCard label="Total Bookings" value={stats.totalBookings} />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-holo-silver mb-2">Most Booked Areas</h2>
        <ul className="space-y-2">
          {stats.mostBookedAreas.map((area, i) => (
            <li key={i} className="bg-space-black p-3 rounded-xl flex justify-between items-center text-holo-silver">
              <span>{area._id}</span>
              <span className="text-neon-green font-bold">{area.count}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-holo-silver mb-2">Top Rated PGs</h2>
        <ul className="space-y-2">
          {stats.topRatedPGs.map((pg, i) => (
            <li key={i} className="bg-space-black p-3 rounded-xl flex justify-between items-center text-holo-silver">
              <span>{pg.title}</span>
              <span className="text-neon-cyan font-bold">{pg.rating?.toFixed(1)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-space-black p-6 rounded-xl text-center shadow-md border border-holo-border">
      <div className="text-holo-silver text-sm mb-1">{label}</div>
      <div className="text-3xl text-neon-cyan font-bold">{value}</div>
    </div>
  );
}
