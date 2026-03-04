// client/app/dashboard/page.tsx
'use client';

import { Users, TrendingUp, CheckCircle, Clock } from 'lucide-react';

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, here's what's happening with your leads today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Leads" value="1,284" change="+12%" icon={Users} color="blue" />
        <StatCard title="Hot Leads (AI)" value="42" change="+5 this hour" icon={TrendingUp} color="orange" />
        <StatCard title="Converted" value="86" change="+2.4%" icon={CheckCircle} color="green" />
        <StatCard title="Pending Action" value="15" change="Urgent" icon={Clock} color="red" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Lead Activity</h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
          <p className="text-gray-400">Live Data Feed will appear here in Phase 3</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className="text-green-600 font-medium">{change}</span>
        <span className="text-gray-400 ml-2">from last month</span>
      </div>
    </div>
  );
}