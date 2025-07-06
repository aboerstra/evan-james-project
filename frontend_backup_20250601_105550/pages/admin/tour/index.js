import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '../../../components/AdminLayout';

export default function TourPage({ serverTourDates }) {
  const router = useRouter();
  
  // Use server data or fallback to empty array
  const [tourDates, setTourDates] = useState(serverTourDates || []);
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [tourDateToDelete, setTourDateToDelete] = useState(null);
  
  const confirmDelete = (tourDate) => {
    setTourDateToDelete(tourDate);
    setIsDeleting(true);
  };
  
  const cancelDelete = () => {
    setIsDeleting(false);
    setTourDateToDelete(null);
  };
  
  const deleteTourDate = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
      
      const response = await fetch(`${API_URL}/api/tour-dates/${tourDateToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete tour date');
      }
      
      // Remove from local state
      setTourDates(tourDates.filter(td => td.id !== tourDateToDelete.id));
      setIsDeleting(false);
      setTourDateToDelete(null);
    } catch (error) {
      console.error('Error deleting tour date:', error);
      alert('Error deleting tour date. Please try again.');
    }
  };
  
  const toggleSoldOut = async (id) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
      
      // Find the current tour date to get its current sold out status
      const currentTourDate = tourDates.find(td => td.id === id);
      if (!currentTourDate) return;
      
      const response = await fetch(`${API_URL}/api/tour-dates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            soldOut: !currentTourDate.soldOut
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update tour date');
      }
      
      // Update local state
      setTourDates(tourDates.map(td => 
        td.id === id 
          ? { ...td, soldOut: !td.soldOut } 
          : td
      ));
    } catch (error) {
      console.error('Error updating tour date:', error);
      alert('Error updating tour date. Please try again.');
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <AdminLayout title="Tour Dates">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-mulish lowercase text-ice-blue mb-2">tour dates</h1>
          <p className="text-white/70">manage upcoming performances</p>
        </div>
        <Link 
          href="/admin/tour/new" 
          className="mt-4 md:mt-0 bg-electric-blue hover:bg-electric-blue/80 text-white px-4 py-2 rounded-md text-center transition-colors inline-block"
        >
          add tour date
        </Link>
      </div>
      
      {/* Tour Dates List */}
      <div className="bg-navy/80 backdrop-blur-md rounded-lg border border-electric-blue/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead className="bg-sapphire/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Venue</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Ticket Link</th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-electric-blue/10">
              {tourDates.map((tourDate) => (
                <tr key={tourDate.id} className="hover:bg-sapphire/10 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(tourDate.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tourDate.venue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tourDate.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tourDate.ticketUrl ? (
                      <a 
                        href={tourDate.ticketUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-ice-blue hover:text-electric-blue transition-colors underline"
                      >
                        Tickets
                      </a>
                    ) : (
                      <span className="text-white/40">No link</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleSoldOut(tourDate.id)}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        tourDate.soldOut 
                          ? 'bg-red-500/20 text-red-300' 
                          : 'bg-green-500/20 text-green-300'
                      }`}
                    >
                      {tourDate.soldOut ? 'Sold Out' : 'Available'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        href={`/admin/tour/edit/${tourDate.id}`}
                        className="text-ice-blue hover:text-electric-blue transition-colors"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => confirmDelete(tourDate)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {tourDates.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-white/70">
                    No tour dates found. Add your first tour date to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Tip for Public Display */}
      <div className="mt-6 bg-electric-blue/10 p-4 rounded-lg border border-electric-blue/30">
        <p className="text-white/70 text-sm">
          <span className="font-medium text-ice-blue">Tip:</span> Only future dates are shown on the public tour page. Past dates are automatically archived.
        </p>
      </div>
      
      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-navy border border-electric-blue/30 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-mulish text-ice-blue mb-4">Confirm Deletion</h3>
            <p className="mb-6 text-white">
              Are you sure you want to delete the tour date at {tourDateToDelete?.venue} on {formatDate(tourDateToDelete?.date)}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-electric-blue/50 text-white rounded-md hover:bg-electric-blue/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteTourDate}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// Fetch tour dates data on the server side
export async function getServerSideProps() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
    
    console.log('Tour SSR: Fetching data from:', API_URL);
    
    // Fetch tour dates sorted by date
    const response = await fetch(`${API_URL}/api/tour-dates?sort=date:asc`);
    
    if (!response.ok) {
      console.error('Tour SSR: Failed to fetch tour dates:', response.status);
      return {
        props: {
          serverTourDates: []
        }
      };
    }
    
    const data = await response.json();
    
    // Transform Strapi data to match our component structure
    const serverTourDates = data.data?.map(tourDate => ({
      id: tourDate.id,
      date: tourDate.attributes.date || '',
      venue: tourDate.attributes.venue || '',
      city: tourDate.attributes.city || '',
      ticketUrl: tourDate.attributes.ticketUrl || '',
      soldOut: tourDate.attributes.soldOut || false,
      description: tourDate.attributes.description || '',
      createdAt: tourDate.attributes.createdAt || ''
    })) || [];
    
    console.log('Tour SSR: Found', serverTourDates.length, 'tour dates');
    
    return {
      props: {
        serverTourDates
      }
    };
  } catch (error) {
    console.error('Tour SSR: Error fetching data:', error);
    
    return {
      props: {
        serverTourDates: []
      }
    };
  }
}
