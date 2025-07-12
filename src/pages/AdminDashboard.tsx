import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Award, TrendingUp, Calendar, Download, Filter } from 'lucide-react';
import { useAccount } from 'wagmi';

interface DashboardStats {
  totalCertificates: number;
  totalStudents: number;
  totalInstitutions: number;
  monthlyGrowth: number;
}

interface RecentActivity {
  id: string;
  type: 'issued' | 'verified';
  certificate: string;
  student: string;
  institution: string;
  timestamp: Date;
}

const AdminDashboard: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [stats, setStats] = useState<DashboardStats>({
    totalCertificates: 0,
    totalStudents: 0,
    totalInstitutions: 0,
    monthlyGrowth: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    setTimeout(() => {
      setStats({
        totalCertificates: 12547,
        totalStudents: 8932,
        totalInstitutions: 156,
        monthlyGrowth: 23.5
      });

      setRecentActivity([
        {
          id: '1',
          type: 'issued',
          certificate: 'Blockchain Fundamentals',
          student: 'John Doe',
          institution: 'MIT',
          timestamp: new Date(Date.now() - 1000 * 60 * 30)
        },
        {
          id: '2',
          type: 'verified',
          certificate: 'Advanced Cryptography',
          student: 'Jane Smith',
          institution: 'Stanford',
          timestamp: new Date(Date.now() - 1000 * 60 * 60)
        },
        {
          id: '3',
          type: 'issued',
          certificate: 'Machine Learning',
          student: 'Bob Johnson',
          institution: 'NPTEL',
          timestamp: new Date(Date.now() - 1000 * 60 * 90)
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  if (!isConnected) {
    return (
      <div className="pt-16 min-h-screen bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-12">
            <Users className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Admin Access Required
            </h2>
            <p className="text-slate-400 mb-8">
              Please connect your wallet to access the admin dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Admin Dashboard
            </h1>
            <p className="text-xl text-slate-400">
              Monitor and manage the EduCred platform
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-slate-800 border border-slate-600 text-slate-300 px-4 py-2 rounded-lg hover:border-purple-500 hover:text-purple-400 transition-all duration-200">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-2 text-slate-400">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading dashboard data...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <Award className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{stats.totalCertificates.toLocaleString()}</div>
                    <div className="text-slate-400 text-sm">Total Certificates</div>
                  </div>
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{stats.monthlyGrowth}% this month
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{stats.totalStudents.toLocaleString()}</div>
                    <div className="text-slate-400 text-sm">Total Students</div>
                  </div>
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +15.2% this month
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-pink-500/20 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-pink-400" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{stats.totalInstitutions}</div>
                    <div className="text-slate-400 text-sm">Institutions</div>
                  </div>
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8.1% this month
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <Calendar className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">98.7%</div>
                    <div className="text-slate-400 text-sm">Uptime</div>
                  </div>
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +0.2% this month
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'issued' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {activity.type === 'issued' ? (
                          <Award className="w-4 h-4" />
                        ) : (
                          <BarChart3 className="w-4 h-4" />
                        )}
                      </div>
                      
                      <div>
                        <div className="text-white font-medium">
                          {activity.type === 'issued' ? 'Certificate Issued' : 'Certificate Verified'}
                        </div>
                        <div className="text-slate-400 text-sm">
                          {activity.certificate} • {activity.student} • {activity.institution}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-slate-400 text-sm">
                      {formatTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center">
                <Award className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Issue Certificate</h3>
                <p className="text-slate-400 text-sm mb-4">Create and mint a new certificate</p>
                <button className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-4 py-2 rounded-lg transition-colors">
                  Get Started
                </button>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center">
                <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Bulk Issue</h3>
                <p className="text-slate-400 text-sm mb-4">Upload CSV to issue multiple certificates</p>
                <button className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg transition-colors">
                  Upload CSV
                </button>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center">
                <BarChart3 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Analytics</h3>
                <p className="text-slate-400 text-sm mb-4">View detailed platform analytics</p>
                <button className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-lg transition-colors">
                  View Reports
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;