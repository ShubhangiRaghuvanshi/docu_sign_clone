import React, { useState, useEffect } from 'react';

const SignatureStatus = ({ fileId, refreshTrigger }) => {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedSignature, setSelectedSignature] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (fileId) {
      fetchSignatureStatus();
    }
  }, [fileId, refreshTrigger]);

  const fetchSignatureStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/signatures/${fileId}/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch signature status');
      const data = await res.json();
      setStatusData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSignature = async (signatureId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/signatures/${signatureId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error('Failed to accept signature');
      fetchSignatureStatus(); // Refresh status
    } catch (err) {
      alert('Failed to accept signature: ' + err.message);
    }
  };

  const handleRejectSignature = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/signatures/${selectedSignature._id}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });
      if (!res.ok) throw new Error('Failed to reject signature');
      
      setShowRejectModal(false);
      setSelectedSignature(null);
      setRejectionReason('');
      fetchSignatureStatus(); // Refresh status
    } catch (err) {
      alert('Failed to reject signature: ' + err.message);
    }
  };

  const openRejectModal = (signature) => {
    setSelectedSignature(signature);
    setShowRejectModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'signed': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'signed': return '✅';
      case 'rejected': return '❌';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error: {error}</p>
      </div>
    );
  }

  if (!statusData || statusData.total === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-gray-500 text-center">No signatures found for this document.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header with summary and filter */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <h3 className="text-white font-semibold text-lg">Signature Status</h3>
          <button
            onClick={fetchSignatureStatus}
            className="text-white hover:text-blue-200 transition-colors ml-2"
            title="Refresh status"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        {/* Filter dropdown */}
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <label htmlFor="status-filter" className="text-white text-sm font-medium">Filter:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="rounded px-2 py-1 text-sm border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="signed">Signed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      <div className="flex space-x-4 mt-2">
        <div className="text-white text-sm">
          <span className="font-medium">{statusData.total}</span> Total
        </div>
        <div className="text-yellow-200 text-sm">
          <span className="font-medium">{statusData.pending}</span> Pending
        </div>
        <div className="text-green-200 text-sm">
          <span className="font-medium">{statusData.signed}</span> Signed
        </div>
        <div className="text-red-200 text-sm">
          <span className="font-medium">{statusData.rejected}</span> Rejected
        </div>
      </div>

      {/* Signature list */}
      <div className="p-6">
        <div className="space-y-4">
          {(statusData.signatures
            .filter(sig => filterStatus === 'all' ? true : sig.status === filterStatus)
          ).map((signature) => (
            <div key={signature._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(signature.status)}`}>
                    <span className="mr-1">{getStatusIcon(signature.status)}</span>
                    {signature.status.charAt(0).toUpperCase() + signature.status.slice(1)}
                  </div>
                  <div>
                    <p className="font-extrabold text-lg text-gray-900">
                      {signature.signer?.name || signature.signer?.email || 'Unknown Signer'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(signature.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-2">
                  {signature.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAcceptSignature(signature._id)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => openRejectModal(signature)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {signature.status === 'rejected' && signature.rejectionReason && (
                    <div className="text-sm text-red-600 max-w-xs">
                      <strong>Reason:</strong> {signature.rejectionReason}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {/* Show message if no signatures match filter */}
          {statusData.signatures.filter(sig => filterStatus === 'all' ? true : sig.status === filterStatus).length === 0 && (
            <div className="text-center text-gray-400 py-8">No signatures with this status.</div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Reject Signature</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this signature:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleRejectSignature}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedSignature(null);
                  setRejectionReason('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignatureStatus; 