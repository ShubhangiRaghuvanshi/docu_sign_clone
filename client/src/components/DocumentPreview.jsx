import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import SignaturePad from 'react-signature-canvas';

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.js`;

const DocumentPreview = ({ fileUrl, fileId, onSignaturesUpdate }) => {
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signatures, setSignatures] = useState([]);
  const [pageWidth, setPageWidth] = useState(600); // default width
  const [pageHeight, setPageHeight] = useState(null);
  const pdfContainerRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 100, y: 100 }); // initial drag position
  const [showDraggable, setShowDraggable] = useState(true);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [activeSignature, setActiveSignature] = useState(null); // {sig, cidx}
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);
  const signaturePadRef = useRef(null);
  const hasAnyCoordinates = signatures && signatures.some(sig => Array.isArray(sig.coordinates) && sig.coordinates.length > 0);

  // Move fetchSignatures out of useEffect so it can be reused
  const fetchSignatures = async () => {
    if (!fileId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://docu-sign-clone.onrender.com/api/signatures/${fileId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch signatures');
      const data = await res.json();
      setSignatures(data);
      // Notify parent component of signature updates
      if (onSignaturesUpdate) {
        onSignaturesUpdate(data);
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    fetchSignatures();
  }, [fileId]);

  const onDocumentLoadSuccess = ({ numPages, _pdfInfo }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (err) => {
    setError('Failed to load PDF');
    setLoading(false);
  };

  // Get the rendered page's height after rendering
  const onPageRenderSuccess = (page) => {
    const viewport = page.getViewport({ scale: 1 });
    setPageHeight(viewport.height * (pageWidth / viewport.width));
  };

  // Drag handlers for the signature box
  const handleDragStart = (e) => {
    setDragging(true);
  };

  const handleDrag = (e) => {
    if (!dragging || !pdfContainerRef.current) return;
    // For mouse events
    if (e.type === 'mousemove' && e.buttons !== 1) return;
    const rect = pdfContainerRef.current.getBoundingClientRect();
    const x = (e.type === 'touchmove' ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.type === 'touchmove' ? e.touches[0].clientY : e.clientY) - rect.top;
    setDragPos({ x, y });
  };

  const handleDragEnd = async (e) => {
    setDragging(false);
    if (!pdfContainerRef.current) return;
    const rect = pdfContainerRef.current.getBoundingClientRect();
    const x = (e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX) - rect.left;
    const y = (e.type === 'touchend' ? e.changedTouches[0].clientY : e.clientY) - rect.top;
    // Calculate relative coordinates (0-1)
    const relX = x / rect.width;
    const relY = y / rect.height;
    // POST to backend
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://docu-sign-clone.onrender.com/api/signatures', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId,
          coordinates: [{ x: relX, y: relY, page: 1 }],
          status: 'pending',
        }),
      });
      if (!res.ok) throw new Error('Failed to save signature');
      setShowDraggable(false); // Hide draggable after placing
      fetchSignatures(); // Refresh signatures
    } catch (err) {
      alert('Failed to save signature: ' + err.message);
    }
  };

  // Handle clicking a signature placeholder
  const handlePlaceholderClick = (sig, cidx) => {
    setActiveSignature({ sig, cidx });
    setShowSignatureModal(true);
  };

  // Handle saving the drawn signature
  const handleSaveSignature = async () => {
    if (!signaturePadRef.current || !activeSignature) return;
    const dataUrl = signaturePadRef.current.getCanvas().toDataURL('image/png');
    // Don't set local state here, rely on backend response
    // setSignatureDataUrl(dataUrl); 
    setShowSignatureModal(false);

    // Upload to backend
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://docu-sign-clone.onrender.com/api/signatures/${activeSignature.sig._id}/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: dataUrl, cidx: activeSignature.cidx }),
      });
      if (!res.ok) throw new Error('Failed to upload signature image');
      
      const data = await res.json();
      setSignatures(data.signatures); // Update state with the new list from backend
    } catch (err) {
      alert('Failed to upload signature image: ' + err.message);
    }
  };

  if (!fileUrl || !fileUrl.toLowerCase().endsWith('.pdf')) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded">
        <p className="text-gray-500">No PDF selected or unsupported file type.</p>
      </div>
    );
  }

  // Debug: log the fileUrl being used
  console.log('DocumentPreview fileUrl:', fileUrl);

  // Normalize fileUrl to use forward slashes
  let normalizedFileUrl = fileUrl.replace(/\\/g, '/');
  // Ensure the fileUrl is absolute
  if (!/^https?:\/\//.test(normalizedFileUrl)) {
    normalizedFileUrl = `https://docu-sign-clone.onrender.com/${normalizedFileUrl.replace(/^\/+/, '')}`;
  }

  return (
    <div className="pdf-preview flex flex-col items-center relative">
      {loading && !error && (
        <div className="text-blue-500 mb-2">Loading PDF...</div>
      )}
      {error && (
        <div className="text-red-500 mb-2">{error}</div>
      )}
      {/* Signature Modal */}
      {showSignatureModal && (
        <div style={{
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 4px 32px rgba(0,0,0,0.15)' }}>
            <h3 className="mb-2 font-bold text-lg text-blue-700">Draw or Upload Your Signature</h3>
            <SignaturePad
              ref={signaturePadRef}
              penColor="#2563eb"
              backgroundColor="#fff"
              canvasProps={{ width: 350, height: 120, className: 'rounded border border-blue-200' }}
            />
            <div className="flex gap-2 mt-4">
              <button onClick={() => signaturePadRef.current.clear()} className="px-3 py-1 bg-gray-200 rounded">Clear</button>
              <button onClick={handleSaveSignature} className="px-3 py-1 bg-blue-600 text-white rounded">Save Drawing</button>
              <button onClick={() => setShowSignatureModal(false)} className="px-3 py-1 bg-red-100 text-red-600 rounded">Cancel</button>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Or upload a signature image (PNG/JPG):</label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file || !activeSignature) return;
                  const reader = new window.FileReader();
                  reader.onloadend = async () => {
                    const base64String = reader.result;
                    // Upload to backend
                    try {
                      const token = localStorage.getItem('token');
                      const res = await fetch(`https://docu-sign-clone.onrender.com/api/signatures/${activeSignature.sig._id}/image`, {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ image: base64String, cidx: activeSignature.cidx }),
                      });
                      if (!res.ok) throw new Error('Failed to upload signature image');
                      const data = await res.json();
                      setSignatures(data.signatures);
                      setShowSignatureModal(false);
                    } catch (err) {
                      alert('Failed to upload signature image: ' + err.message);
                    }
                  };
                  reader.readAsDataURL(file);
                }}
                className="block w-full text-sm text-gray-700 border border-gray-300 rounded mt-1"
              />
            </div>
          </div>
        </div>
      )}
      {/* Drag-and-drop signature overlay */}
      <div
        ref={pdfContainerRef}
        style={{ position: 'relative', width: pageWidth, height: pageHeight || 'auto' }}
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        onTouchMove={handleDrag}
        onTouchEnd={handleDragEnd}
      >
        <Document
          file={normalizedFileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading=" "
          error=" "
        >
          <Page
            pageNumber={1}
            width={pageWidth}
            onRenderSuccess={onPageRenderSuccess}
          />
        </Document>
        {/* Signature placeholders */}
        {signatures && signatures.length > 0 && pageHeight && signatures.map((sig) =>
          sig.coordinates.map((coord, cidx) => {
            const hasImage = sig.images && sig.images[cidx];
            
            // Get status-based styling
            const getStatusStyle = () => {
              switch (sig.status) {
                case 'signed':
                  return {
                    background: hasImage ? 'transparent' : 'rgba(34, 197, 94, 0.2)',
                    border: hasImage ? 'none' : '2px solid #16a34a',
                    color: '#15803d'
                  };
                case 'rejected':
                  return {
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '2px solid #dc2626',
                    color: '#b91c1c'
                  };
                case 'pending':
                default:
                  return {
                    background: hasImage ? 'transparent' : 'rgba(255, 215, 0, 0.7)',
                    border: hasImage ? 'none' : '2px dashed #bfa700',
                    color: '#7c5e00'
                  };
              }
            };

            const statusStyle = getStatusStyle();
            
            return (
              <div
                key={`${sig._id}-${cidx}`}
                style={{
                  position: 'absolute',
                  left: `${coord.x * pageWidth}px`,
                  top: `${coord.y * pageHeight}px`,
                  width: '40px',
                  height: '24px',
                  ...statusStyle,
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  zIndex: 10,
                  cursor: hasImage || sig.status === 'rejected' ? 'default' : 'pointer',
                  pointerEvents: hasImage || sig.status === 'rejected' ? 'none' : 'auto',
                }}
                title={`Signer: ${sig.signer}, Status: ${sig.status}${sig.rejectionReason ? `, Reason: ${sig.rejectionReason}` : ''}`}
                onClick={hasImage || sig.status === 'rejected' ? undefined : () => handlePlaceholderClick(sig, cidx)}
              >
                {hasImage ? (
                  <img src={sig.images[cidx]} alt="Signature" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                ) : sig.status === 'rejected' ? (
                  '❌'
                ) : sig.status === 'signed' ? (
                  '✅'
                ) : (
                  'Sign'
                )}
              </div>
            );
          })
        )}
        {/* Draggable signature box */}
        {showDraggable && !hasAnyCoordinates && (
          <div
            style={{
              position: 'absolute',
              left: dragPos.x - 60,
              top: dragPos.y - 24,
              width: '120px',
              height: '48px',
              background: 'white',
              border: '2px solid #2563eb',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(37,99,235,0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb',
              fontWeight: 'bold',
              fontFamily: '"Pacifico", cursive, sans-serif',
              fontSize: '1.1rem',
              cursor: dragging ? 'grabbing' : 'grab',
              zIndex: 20,
              userSelect: 'none',
              transition: 'box-shadow 0.2s, border 0.2s',
              gap: '0.5em'
            }}
            draggable={false}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <span style={{fontSize: '1.5em'}}>✍️</span>
            <span>Sign Here</span>
          </div>
        )}
      </div>
      {numPages && !error && (
        <div className="text-gray-500 text-sm mt-2">Page 1 of {numPages}</div>
      )}
    </div>
  );
};

export default DocumentPreview; 