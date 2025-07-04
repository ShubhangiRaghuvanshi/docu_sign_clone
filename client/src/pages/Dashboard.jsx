import React, { useState, useEffect } from 'react';
import DocumentPreview from '../components/DocumentPreview';
import SignatureStatus from '../components/SignatureStatus';
import AuditTrail from '../components/AuditTrail';
import { UserCircle, LogOut, Settings } from 'lucide-react';
import { removeToken, getUserFromToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [signedFileUrl, setSignedFileUrl] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteResult, setInviteResult] = useState(null);
  const [signaturesUpdated, setSignaturesUpdated] = useState(0); // Counter to trigger refreshes
  const [dropdownOpen, setDropdownOpen] = useState(false); // Add this line
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/docs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch documents');
      const docs = await res.json();
      setDocuments(docs);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDocumentSelect = (doc) => {
    setSelectedDoc(doc);
  };

  const handleUploadSuccess = () => {
    fetchDocuments(); // Refresh the list after upload
  };

  const handleSignaturesUpdate = () => {
    // Increment counter to trigger SignatureStatus refresh
    setSignaturesUpdated(prev => prev + 1);
  };

  const handleFinalizeSignature = async () => {
    if (!selectedDoc) return;
    setSignedFileUrl(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/signatures/finalize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId: selectedDoc._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to finalize PDF');
      setSignedFileUrl(`http://localhost:5000/${data.signedFile}`);
    } catch (err) {
      alert('Failed to finalize PDF: ' + err.message);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!selectedDoc || !inviteEmail) return;
    setInviteResult(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/signatures/invite', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId: selectedDoc._id, signerEmail: inviteEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send invite');
      setInviteResult(data);
    } catch (err) {
      alert('Failed to send invite: ' + err.message);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const user = getUserFromToken();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Document Dashboard</h1>
            <p className="text-gray-500 text-base">Manage and preview your documents</p>
          </div>
          <div className="relative">
            <button
              className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow border border-gray-200 hover:shadow-md transition"
              onClick={() => setDropdownOpen(open => !open)}
              type="button"
            >
              <UserCircle className="w-8 h-8 text-blue-400" />
              <span className="font-semibold text-gray-700">{user?.name || user?.email || 'User'}</span>
              <svg className="w-4 h-4 text-gray-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-30">
                <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-t-xl gap-2"><Settings className="w-4 h-4" /> Settings</button>
                <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-b-xl gap-2" onClick={handleLogout}><LogOut className="w-4 h-4" /> Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4 py-8">
        {/* Sidebar: Document List */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-700 tracking-wide">Your Documents</h2>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full w-9 h-9 flex items-center justify-center shadow transition-all border-2 border-blue-200"
                title="Upload Document"
                onClick={() => alert('Upload functionality goes here!')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  onClick={() => handleDocumentSelect(doc)}
                  className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 border bg-white/80 shadow-sm hover:shadow-md hover:bg-blue-50 active:scale-95 border-transparent ${
                    selectedDoc && selectedDoc._id === doc._id
                      ? 'ring-2 ring-blue-400 border-blue-300 bg-blue-100 scale-[1.03] shadow-lg'
                      : ''
                  }`}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-gray-800 font-semibold text-base truncate flex-1">{doc.name || doc.originalName}</span>
                </div>
              ))}
              {documents.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p>No documents found</p>
                </div>
              )}
            </div>
          </div>
        </aside>
        {/* Main Content */}
        <section className="flex-1 flex flex-col gap-8">
          {/* Document Preview */}
          <div className="bg-white/80 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-gray-700 to-blue-700 px-8 py-5">
              <h2 className="text-white font-bold text-lg tracking-wide">Preview</h2>
            </div>
            <div className="p-8">
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}
              {selectedDoc ? (
                <DocumentPreview 
                  fileUrl={selectedDoc.filePath} 
                  fileId={selectedDoc._id} 
                  onSignaturesUpdate={handleSignaturesUpdate}
                />
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 font-medium text-lg mb-2">No document selected</p>
                  <p className="text-gray-300">Choose a document from the list to preview it here</p>
                </div>
              )}
              {/* Invite signer form */}
              {selectedDoc && (
                <form onSubmit={handleInvite} className="mb-4 flex items-center gap-2 mt-6">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="Signer email"
                    className="border-2 border-blue-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold px-4 py-2 rounded-xl shadow hover:shadow-lg transition"
                  >
                    Invite to Sign
                  </button>
                  {inviteResult && inviteResult.link && (
                    <a
                      href={inviteResult.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline ml-2 font-semibold"
                    >
                      Public Sign Link
                    </a>
                  )}
                  {inviteResult && inviteResult.preview && (
                    <a
                      href={inviteResult.preview}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 underline ml-2 font-semibold"
                    >
                      Email Preview
                    </a>
                  )}
                </form>
              )}
            </div>
          </div>
          {/* Signature Status & Audit Trail */}
          {selectedDoc && (
            <>
              <SignatureStatus fileId={selectedDoc._id} refreshTrigger={signaturesUpdated} />
              <AuditTrail fileId={selectedDoc._id} />
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;