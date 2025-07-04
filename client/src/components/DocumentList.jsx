import React from 'react';

const DocumentList = ({ documents, onDocumentSelect, selectedUrl }) => {
  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-3">Your Documents</h3>
      <ul className="space-y-2">
        {documents.map(doc => (
          <li key={doc._id} className="border rounded p-3 hover:bg-gray-50">
            <button 
              className={`text-left w-full ${selectedUrl === doc.filePath ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
              onClick={() => onDocumentSelect(doc.filePath)}
            >
              <div className="font-medium">{doc.originalName}</div>
              <div className="text-sm text-gray-500">
                Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentList; 