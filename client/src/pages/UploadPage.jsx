import React from 'react';
import { useNavigate } from 'react-router-dom';
import UploadForm from '../components/UploadForm';

const UploadPage = () => {
  const navigate = useNavigate();

  const handleUploadSuccess = () => {
    // Redirect to dashboard after successful upload
    navigate('/dashboard');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Document</h1>
        <UploadForm onUploadSuccess={handleUploadSuccess} />
      </div>
    </div>
  );
};

export default UploadPage; 