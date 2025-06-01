import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import AdminLayout from '../../../../components/AdminLayout';
import { getStrapiImageUrl } from '../../../../services/api';

export default function EditMerchPage({ serverProduct }) {
  const router = useRouter();
  const { id } = router.query;
  
  const [isLoading, setIsLoading] = useState(!serverProduct);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState(serverProduct);
  
  // Form state
  const [formData, setFormData] = useState({
    name: serverProduct?.name || '',
    description: serverProduct?.description || '',
    price: serverProduct?.price?.toString() || '',
    category: serverProduct?.category || 'apparel',
    stockQuantity: serverProduct?.stockQuantity?.toString() || '',
    featured: serverProduct?.featured || false,
    images: []
  });
  
  // Variants state
  const [variants, setVariants] = useState(
    serverProduct?.variants?.length > 0 
      ? serverProduct.variants 
      : [{ size: '', color: '', price: '', inventory: '' }]
  );
  
  const [errors, setErrors] = useState({});
  const [previewImages, setPreviewImages] = useState(
    serverProduct?.images?.data?.length > 0 
      ? serverProduct.images.data.map(img => getStrapiImageUrl({ data: img }))
      : []
  );
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const fileList = Array.from(files);
      setFormData({
        ...formData,
        [name]: fileList
      });
      
      // Create preview URLs for new images
      if (fileList.length > 0) {
        const previewUrls = fileList.map(file => URL.createObjectURL(file));
        setPreviewImages(previewUrls);
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle variant changes
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };
  
  // Add new variant
  const addVariant = () => {
    setVariants([...variants, { size: '', color: '', price: '', inventory: '' }]);
  };
  
  // Remove variant
  const removeVariant = (index) => {
    if (variants.length > 1) {
      const updatedVariants = [...variants];
      updatedVariants.splice(index, 1);
      setVariants(updatedVariants);
    }
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (!formData.stockQuantity || isNaN(formData.stockQuantity) || parseInt(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = 'Valid stock quantity is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
      
      let imageIds = [];
      
      // Upload new images if any were selected
      if (formData.images && formData.images.length > 0) {
        const imageFormData = new FormData();
        Array.from(formData.images).forEach(image => {
          imageFormData.append('files', image);
        });
        
        const imageResponse = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          body: imageFormData,
        });
        
        if (!imageResponse.ok) {
          throw new Error('Failed to upload images');
        }
        
        const imageData = await imageResponse.json();
        imageIds = imageData.map(img => img.id);
      }
      
      // Filter out empty variants
      const filteredVariants = variants.filter(variant => 
        variant.size.trim() || variant.color.trim()
      );
      
      // Create the merchandise update data
      const merchData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stockQuantity: parseInt(formData.stockQuantity),
        featured: formData.featured,
        variants: filteredVariants.length > 0 ? filteredVariants : null
      };
      
      // Add images if uploaded, otherwise keep existing
      if (imageIds.length > 0) {
        merchData.images = imageIds;
      }
      
      const response = await fetch(`${API_URL}/api/merchandises/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: merchData
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update merchandise');
      }
      
      // Navigate back to the merchandise list
      router.push('/admin/merch');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error updating merchandise. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <AdminLayout title="Edit Product">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
        </div>
      </AdminLayout>
    );
  }
  
  if (!product) {
    return (
      <AdminLayout title="Edit Product">
        <div className="text-center py-12">
          <h1 className="text-2xl text-white mb-4">Product Not Found</h1>
          <p className="text-white/70 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/admin/merch')}
            className="bg-electric-blue hover:bg-electric-blue/80 text-white px-4 py-2 rounded-md transition-colors"
          >
            Back to Merchandise
          </button>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title="Edit Product">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => router.back()}
          className="mr-4 text-ice-blue hover:text-electric-blue transition-colors"
        >
          &larr; Back
        </button>
        <h1 className="text-3xl font-mulish lowercase text-ice-blue">edit product</h1>
      </div>
      
      <div className="bg-navy/80 backdrop-blur-md rounded-lg border border-electric-blue/30 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column - Basic Info */}
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-sm mb-1">Product Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-sapphire/30 border ${
                    errors.name ? 'border-red-500' : 'border-electric-blue/30'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white`}
                  placeholder="Product name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white resize-none"
                  placeholder="Product description"
                />
              </div>
              
              {/* Price and Stock Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm mb-1">Price ($)</label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-sapphire/30 border ${
                      errors.price ? 'border-red-500' : 'border-electric-blue/30'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white`}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-400">{errors.price}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="stockQuantity" className="block text-sm mb-1">Stock Quantity</label>
                  <input
                    id="stockQuantity"
                    name="stockQuantity"
                    type="number"
                    min="0"
                    required
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-sapphire/30 border ${
                      errors.stockQuantity ? 'border-red-500' : 'border-electric-blue/30'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white`}
                    placeholder="0"
                  />
                  {errors.stockQuantity && (
                    <p className="mt-1 text-sm text-red-400">{errors.stockQuantity}</p>
                  )}
                </div>
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm mb-1">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white"
                >
                  <option value="apparel">Apparel</option>
                  <option value="vinyl">Vinyl</option>
                  <option value="cd">CD</option>
                  <option value="accessories">Accessories</option>
                  <option value="digital">Digital</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {/* Featured */}
              <div className="flex items-center">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-electric-blue/50 focus:ring-electric-blue"
                />
                <label htmlFor="featured" className="ml-2 block text-sm">
                  Featured product
                </label>
              </div>
            </div>
            
            {/* Right column - Image and Variants */}
            <div className="space-y-6">
              {/* Product Images */}
              <div>
                <label htmlFor="images" className="block text-sm mb-1">Product Images</label>
                
                {/* Current Images */}
                {previewImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-white/60 mb-2">Current Images:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {previewImages.map((preview, index) => (
                        <Image
                          key={index}
                          src={preview}
                          alt={`${product.name} ${index + 1}`}
                          width={128}
                          height={128}
                          className="object-cover rounded-lg border border-electric-blue/30"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <input
                  id="images"
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-electric-blue file:text-white hover:file:bg-electric-blue/80"
                />
                <p className="text-xs text-white/60 mt-1">
                  Leave empty to keep current images, or select new images to replace all
                </p>
              </div>
              
              {/* Product Variants */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm">Product Variants</label>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="text-ice-blue hover:text-electric-blue transition-colors text-sm"
                  >
                    + Add Variant
                  </button>
                </div>
                
                <div className="space-y-3">
                  {variants.map((variant, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 items-end">
                      <input
                        type="text"
                        placeholder="Size"
                        value={variant.size}
                        onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                        className="px-2 py-1 bg-sapphire/30 border border-electric-blue/30 rounded text-white text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Color"
                        value={variant.color}
                        onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                        className="px-2 py-1 bg-sapphire/30 border border-electric-blue/30 rounded text-white text-sm"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                        className="px-2 py-1 bg-sapphire/30 border border-electric-blue/30 rounded text-white text-sm"
                      />
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          placeholder="Stock"
                          value={variant.inventory}
                          onChange={(e) => handleVariantChange(index, 'inventory', e.target.value)}
                          className="px-2 py-1 bg-sapphire/30 border border-electric-blue/30 rounded text-white text-sm flex-1"
                        />
                        {variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <p className="text-xs text-white/60 mt-2">
                  Optional: Add size/color variants with different pricing and inventory
                </p>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/merch')}
              className="px-4 py-2 border border-electric-blue/50 text-white rounded-md hover:bg-electric-blue/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-electric-blue text-white rounded-md hover:bg-electric-blue/80 transition-colors disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Update Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

// Fetch product data on the server side
export async function getServerSideProps({ params }) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
    
    console.log('Merch Edit SSR: Fetching product', params.id, 'from:', API_URL);
    
    // Fetch product with images
    const response = await fetch(`${API_URL}/api/merchandises/${params.id}?populate=images`);
    
    if (!response.ok) {
      console.error('Merch Edit SSR: Failed to fetch product:', response.status);
      return {
        props: {
          serverProduct: null
        }
      };
    }
    
    const data = await response.json();
    
    // Transform Strapi data to match our component structure
    const serverProduct = {
      id: data.data.id,
      name: data.data.attributes.name || '',
      description: data.data.attributes.description || '',
      price: data.data.attributes.price || 0,
      category: data.data.attributes.category || 'apparel',
      stockQuantity: data.data.attributes.stockQuantity || 0,
      featured: data.data.attributes.featured || false,
      images: data.data.attributes.images || null,
      variants: data.data.attributes.variants || []
    };
    
    console.log('Merch Edit SSR: Found product:', serverProduct.name);
    
    return {
      props: {
        serverProduct
      }
    };
  } catch (error) {
    console.error('Merch Edit SSR: Error fetching data:', error);
    
    return {
      props: {
        serverProduct: null
      }
    };
  }
}
