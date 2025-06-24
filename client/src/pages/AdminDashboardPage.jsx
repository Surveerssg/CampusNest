import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PendingApprovals from '../components/PendingApprovals';
import AdminAnalytics from '../components/AdminAnalytics';

export default function AdminDashboardPage() {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState('approvals');

  if (!isAdmin()) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="mt-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-neon-cyan">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab('approvals')}
          className={`px-4 py-2 rounded-xl font-semibold ${tab === 'approvals' ? 'bg-neon-cyan text-black' : 'bg-cosmic-navy text-white'}`}
        >
          Pending Approvals
        </button>
        <button
          onClick={() => setTab('analytics')}
          className={`px-4 py-2 rounded-xl font-semibold ${tab === 'analytics' ? 'bg-neon-cyan text-black' : 'bg-cosmic-navy text-white'}`}
        >
          Analytics
        </button>
      </div>

      {/* Tab Content */}
      {tab === 'approvals' && <PendingApprovals />}
      {tab === 'analytics' && <AdminAnalytics />}
    </div>
  );
}
