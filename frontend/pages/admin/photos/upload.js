import React from 'react';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import AdminLayout from '../../../components/AdminLayout';

export default function PhotoUploadPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [createNewAlbum, setCreateNewAlbum] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  
  // Sample albums data
  const albums = [
    { id: 1, title: 'Press Photos' },
    { id: 2, title: 'Live at Echo Bar' },
    { id: 3, title: 'Behind The Scenes' },
  ];
  
  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);
  
  // Handle file selection via drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);
  
  // Handle file selection via input
  const handleChange = (e) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };
  
  // Process selected files
  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => {
      // Create a preview URL for the file
      const previewUrl = URL.createObjectURL(file);
      
      return {
        file,
        previewUrl,
        name: file.name,
        size: file.size,
        type: file.type,
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
    });
    
    setFiles(prev => [...prev, ...newFiles]);
  };
  
  // Remove a file from the list
  const removeFile = (id) => {
    setFiles(files.filter(file => file.id !== id));
  };
  
  // Clear all selected files
  const clearFiles = () => {
    // Release object URLs to prevent memory leaks
    files.forEach(file => {
      URL.revokeObjectURL(file.previewUrl);
    });
    setFiles([]);
  };
  
  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      alert('Please select at least one file to upload.');
      return;
    }
    
    if (!selectedAlbum && !createNewAlbum) {
      alert('Please select an album or create a new one.');
      return;
    }
    
    if (createNewAlbum && !newAlbumName.trim()) {
      alert('Please enter a name for the new album.');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(i);
      }
      
      // In a real implementation, this would be an API call to upload the files
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate back to the photos page after successful upload
      router.push('/admin/photos');
    } catch (error) {
      console.error('Error uploading files:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  return (
    <AdminLayout title="Upload Photos">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => router.back()}
          className="mr-4 text-ice-blue hover:text-electric-blue transition-colors"
        >
          &larr; Back
        </button>
        <h1 className="text-3xl font-mulish lowercase text-ice-blue">upload photos</h1>
      </div>
      
      <div className="bg-navy/50 backdrop-blur-sm rounded-lg border border-electric-blue/20 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Upload area */}
            <div className="md:col-span-2">
              {/* File Drop Zone */}
              <div 
                className={`border-2 border-dashed rounded-lg p-8 mb-6 flex flex-col items-center justify-center ${
                  dragActive 
                    ? 'border-electric-blue bg-electric-blue/10' 
                    : 'border-electric-blue/30 hover:border-electric-blue/60 hover:bg-sapphire/10'
                } transition-colors cursor-pointer`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-electric-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                
                <p className="text-center mb-2">
                  <span className="text-ice-blue">Click to browse</span> or drag and drop
                </p>
                <p className="text-sm text-white/60 text-center">
                  Supported formats: JPG, PNG, GIF, WebP<br />
                  Maximum file size: 10MB
                </p>
                
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </div>
              
              {/* Selected Files */}
              {files.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm uppercase tracking-wider text-white/70">Selected Files ({files.length})</h3>
                    <button
                      type="button"
                      onClick={clearFiles}
                      className="text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {files.map((file) => (
                      <div key={file.id} className="relative group">
                        <div className="aspect-square relative rounded-md overflow-hidden bg-sapphire/20">
                          <Image
                            src={file.previewUrl}
                            alt={file.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        
                        <div className="mt-1">
                          <p className="text-xs text-white truncate" title={file.name}>
                            {file.name.length > 20 ? `${file.name.substring(0, 17)}...` : file.name}
                          </p>
                          <p className="text-xs text-white/60">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Right column - Options */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm uppercase tracking-wider text-white/70 mb-4">Upload Options</h3>
                
                {/* Album Selection */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <input
                      id="existing-album"
                      name="album-option"
                      type="radio"
                      checked={!createNewAlbum}
                      onChange={() => setCreateNewAlbum(false)}
                      className="h-4 w-4 text-electric-blue focus:ring-electric-blue border-gray-300"
                    />
                    <label htmlFor="existing-album" className="ml-2 block text-sm">
                      Add to existing album
                    </label>
                  </div>
                  
                  <select
                    id="album"
                    name="album"
                    value={selectedAlbum}
                    onChange={(e) => setSelectedAlbum(e.target.value)}
                    disabled={createNewAlbum}
                    className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white disabled:opacity-50"
                  >
                    <option value="">Select an album</option>
                    {albums.map(album => (
                      <option key={album.id} value={album.id}>
                        {album.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Create New Album */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <input
                      id="new-album"
                      name="album-option"
                      type="radio"
                      checked={createNewAlbum}
                      onChange={() => setCreateNewAlbum(true)}
                      className="h-4 w-4 text-electric-blue focus:ring-electric-blue border-gray-300"
                    />
                    <label htmlFor="new-album" className="ml-2 block text-sm">
                      Create new album
                    </label>
                  </div>
                  
                  <input
                    type="text"
                    id="new-album-name"
                    name="new-album-name"
                    placeholder="Enter album name"
                    value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                    disabled={!createNewAlbum}
                    className="w-full px-3 py-2 bg-sapphire/30 border border-electric-blue/30 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue text-white disabled:opacity-50"
                  />
                </div>
              </div>
              
              {/* Additional Options */}
              <div>
                <h3 className="text-sm uppercase tracking-wider text-white/70 mb-4">Additional Options</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="optimize"
                      name="optimize"
                      type="checkbox"
                      className="h-4 w-4 rounded border-electric-blue/50 focus:ring-electric-blue"
                    />
                    <label htmlFor="optimize" className="ml-2 block text-sm">
                      Optimize images (recommended)
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="preserve-exif"
                      name="preserve-exif"
                      type="checkbox"
                      className="h-4 w-4 rounded border-electric-blue/50 focus:ring-electric-blue"
                    />
                    <label htmlFor="preserve-exif" className="ml-2 block text-sm">
                      Preserve image metadata
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm">Uploading...</h3>
                <p className="text-sm">{uploadProgress}%</p>
              </div>
              <div className="w-full bg-sapphire/20 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-electric-blue h-full transition-all duration-300 ease-in-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Form Actions */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/photos')}
              className="px-4 py-2 border border-electric-blue/50 text-white rounded-md hover:bg-electric-blue/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || files.length === 0}
              className="px-4 py-2 bg-electric-blue text-white rounded-md hover:bg-electric-blue/80 transition-colors disabled:opacity-50 flex items-center"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                `Upload ${files.length} Photo${files.length !== 1 ? 's' : ''}`
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
