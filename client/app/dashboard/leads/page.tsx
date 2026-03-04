// client/app/dashboard/leads/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; 
import { Search, Filter, Plus, MoreHorizontal, Phone, Mail, Loader2 } from 'lucide-react';
// Note: We use ../../ because we are inside dashboard/leads/
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. REAL-TIME DATABASE LISTENER
  // This code runs once when the page loads. It connects to Firebase
  // and keeps the list updated instantly if data changes.
  useEffect(() => {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeads(leadsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads Pipeline</h1>
          <p className="text-gray-500">Manage and track your AI-scored leads.</p>
        </div>
        
        {/* The Link to the "Add Lead" page we built earlier */}
        <Link href="/dashboard/leads/add">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={20} className="mr-2" />
            Add New Lead
          </button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search leads by name or email..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">
          <Filter size={20} className="mr-2" />
          Filter
        </button>
      </div>

      {/* The Leads Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center text-gray-400">
             <Loader2 className="animate-spin mr-2" /> Loading Leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            No leads found. Add your first one!
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">AI Score</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.filter(lead => 
                // Search Filter Logic
                lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                lead.email.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors group">
                  
                  {/* Name Column */}
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{lead.name}</div>
                    <div className="text-sm text-gray-400">{lead.email}</div>
                  </td>
                  
                  {/* Status Column */}
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      lead.status === 'New' ? 'bg-blue-50 text-blue-700' :
                      lead.status === 'Qualified' ? 'bg-green-50 text-green-700' :
                      lead.status === 'Lost' ? 'bg-red-50 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {lead.status}
                    </span>
                  </td>

                  {/* AI Score Column */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            lead.aiScore > 80 ? 'bg-green-500' : 
                            lead.aiScore > 50 ? 'bg-orange-500' : 
                            'bg-red-500'
                          }`} 
                          style={{ width: `${lead.aiScore || 5}%` }}
                        />
                      </div>
                      <span className="font-bold text-gray-700">{lead.aiScore || 0}</span>
                    </div>
                  </td>

                  {/* Contact Icons */}
                  <td className="p-4">
                    <div className="flex gap-2 text-gray-400">
                      <a href={`tel:${lead.phone}`} className="hover:text-blue-600 transition-colors"><Phone size={18} /></a>
                      <a href={`mailto:${lead.email}`} className="hover:text-blue-600 transition-colors"><Mail size={18} /></a>
                    </div>
                  </td>

                  {/* Action Menu */}
                  <td className="p-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}