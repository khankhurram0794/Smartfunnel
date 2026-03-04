// client/app/dashboard/leads/add/page.tsx
'use client';

import { useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { useRouter } from 'next/navigation';
import { Save, X } from 'lucide-react';

export default function AddLeadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'New',
    notes: '',
    aiScore: 0,
    aiSentiment: 'Neutral'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. SAVE TO FIREBASE
      await addDoc(collection(db, "leads"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      // 2. Redirect back to list
      router.push('/dashboard/leads');
    } catch (error) {
      console.error("Error adding lead: ", error);
      alert("Error saving data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Add New Lead</h1>
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Name & Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input 
                required
                type="text" 
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                placeholder="Ex. John Doe"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input 
                required
                type="email" 
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                placeholder="john@company.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Phone & Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input 
                type="tel" 
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                placeholder="+91 98765 43210"
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Initial Status</label>
              <select 
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Notes / Context</label>
            <textarea 
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32 text-gray-900 bg-white"
              placeholder="Met at tech conference, interested in the premium plan..."
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? "Saving..." : <><Save size={20} /> Save Lead</>}
          </button>
        </form>
      </div>
    </div>
  );
}