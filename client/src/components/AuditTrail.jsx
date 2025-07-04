import React, { useEffect, useState } from 'react';

const AuditTrail = ({ fileId }) => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fileId) return;
    setLoading(true);
    setError(null);
    const fetchAuditTrail = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/audit/${fileId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch audit trail');
        const data = await res.json();
        setAudits(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAuditTrail();
  }, [fileId]);

  if (!fileId) return null;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 mt-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
        <p className="text-red-700">Error: {error}</p>
      </div>
    );
  }

  if (!audits.length) {
    return (
      <div className="bg-white rounded-lg shadow p-4 mt-4">
        <p className="text-gray-500 text-center">No audit trail found for this document.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 mt-4">
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-4 rounded-t-lg">
        <h3 className="text-white font-semibold text-lg">Audit Trail</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {audits.map((audit) => (
              <tr key={audit._id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                  {audit.signer?.name || audit.signer?.email || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  {audit.action.charAt(0).toUpperCase() + audit.action.slice(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {audit.ip || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {new Date(audit.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditTrail; 