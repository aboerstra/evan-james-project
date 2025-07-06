import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '../../../components/AdminLayout';
import { getStrapiImageUrl } from '../../../services/api';

export default function MerchPage({ serverProducts }) {
  const router = useRouter();
  
  // Use server data or fallback to empty array
  const [products, setProducts] = useState(serverProducts || []);
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  const confirmDelete = (product) => {
    setProductToDelete(product);
    setIsDeleting(true);
  };
  
  const cancelDelete = () => {
    setIsDeleting(false);
    setProductToDelete(null);
  };
  
  const deleteProduct = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
      
      const response = await fetch(`${API_URL}/api/merchandises/${productToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      
      // Remove from local state
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setIsDeleting(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };
  
  const toggleFeatured = async (id) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
      
      // Find the current product to get its current featured status
      const currentProduct = products.find(product => product.id === id);
      if (!currentProduct) return;
      
      const response = await fetch(`${API_URL}/api/merchandises/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            featured: !currentProduct.featured
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      
      // Update local state
      setProducts(products.map(product => 
        product.id === id 
          ? { ...product, featured: !product.featured } 
          : product
      ));
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product. Please try again.');
    }
  };
  
  // Format price for display
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };
  
  return (
    <AdminLayout title="Merchandise">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-mulish lowercase text-ice-blue mb-2">merchandise</h1>
          <p className="text-white/70">manage your merch store</p>
        </div>
        <Link 
          href="/admin/merch/new" 
          className="mt-4 md:mt-0 bg-electric-blue hover:bg-electric-blue/80 text-white px-4 py-2 rounded-md text-center transition-colors inline-block"
        >
          add new product
        </Link>
      </div>
      
      {/* Store Status Banner */}
      <div className="bg-electric-blue/10 p-4 rounded-lg border border-electric-blue/30 mb-6">
        <div className="flex items-center justify-between">
          <p className="text-white">
            <span className="font-medium text-ice-blue">Store Status:</span> Coming Soon
          </p>
          <Link 
            href="/admin/merch/settings" 
            className="text-ice-blue hover:text-electric-blue transition-colors text-sm"
          >
            Configure Store Settings
          </Link>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="bg-navy/80 backdrop-blur-md rounded-lg border border-electric-blue/30 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-sapphire/20 border border-electric-blue/20 rounded-lg overflow-hidden"
            >
              <div className="aspect-square relative">
                {product.images?.data?.[0]?.attributes?.url ? (
                  <Image
                    src={getStrapiImageUrl({ data: product.images.data[0] })}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-navy/50 text-white/40">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                  <Link 
                    href={`/admin/merch/edit/${product.id}`}
                    className="bg-electric-blue hover:bg-electric-blue/80 text-white p-3 rounded-full transition-colors mr-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-mulish lowercase text-ice-blue">{product.name}</h3>
                  <span className="text-xs px-2 py-1 bg-sapphire/30 rounded-full">{product.category}</span>
                </div>
                
                <div className="flex justify-between mb-4">
                  <span className="text-white font-bold">{formatPrice(product.price)}</span>
                  <span className="text-sm text-white/70">Stock: {product.stockQuantity || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <button
                      onClick={() => toggleFeatured(product.id)}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        product.featured 
                          ? 'bg-electric-blue/20 text-ice-blue' 
                          : 'bg-navy/50 text-white/60'
                      }`}
                    >
                      {product.featured ? 'Featured' : 'Not Featured'}
                    </button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link 
                      href={`/admin/merch/edit/${product.id}`}
                      className="text-ice-blue hover:text-electric-blue transition-colors"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => confirmDelete(product)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {products.length === 0 && (
            <div className="col-span-full p-8 text-center text-white/70">
              No products found. Add your first product to get started.
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-navy border border-electric-blue/30 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-mulish text-ice-blue mb-4">Confirm Deletion</h3>
            <p className="mb-6 text-white">
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-electric-blue/50 text-white rounded-md hover:bg-electric-blue/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteProduct}
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

// Fetch merchandise data on the server side
export async function getServerSideProps() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
    
    console.log('Merch SSR: Fetching data from:', API_URL);
    
    // Fetch merchandise with images
    const response = await fetch(`${API_URL}/api/merchandises?populate=images&sort=createdAt:desc`);
    
    if (!response.ok) {
      console.error('Merch SSR: Failed to fetch merchandise:', response.status);
      return {
        props: {
          serverProducts: []
        }
      };
    }
    
    const data = await response.json();
    
    // Transform Strapi data to match our component structure
    const serverProducts = data.data?.map(product => ({
      id: product.id,
      name: product.attributes.name || '',
      price: product.attributes.price || 0,
      category: product.attributes.category || '',
      stockQuantity: product.attributes.stockQuantity || 0,
      featured: product.attributes.featured || false,
      images: product.attributes.images || null,
      description: product.attributes.description || '',
      variants: product.attributes.variants || [],
      createdAt: product.attributes.createdAt || ''
    })) || [];
    
    console.log('Merch SSR: Found', serverProducts.length, 'products');
    
    return {
      props: {
        serverProducts
      }
    };
  } catch (error) {
    console.error('Merch SSR: Error fetching data:', error);
    
    return {
      props: {
        serverProducts: []
      }
    };
  }
}
