import React from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function TestPage() {
  return (
    <AdminLayout title="Test Page">
      <div className="bg-navy/80 backdrop-blur-md p-6 rounded-lg border border-electric-blue/30">
        <h1 className="text-3xl font-mulish lowercase text-ice-blue mb-4">Test Page</h1>
        <p className="text-white">This is a test page to verify the AdminLayout component is working correctly.</p>
      </div>
    </AdminLayout>
  );
}
