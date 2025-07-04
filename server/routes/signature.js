const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const signatureController = require('../controllers/signatureController');
const auditLogger = require('../middleware/audit');
const auditController = require('../controllers/auditController');

// Save signature positions
router.post('/api/signatures', authMiddleware, auditLogger('signed'), signatureController.saveSignature);

// Get signature status summary (MUST come before /:fileId route)
router.get('/api/signatures/:fileId/status', authMiddleware, signatureController.getSignatureStatus);

// Get signatures for a document
router.get('/api/signatures/:fileId', authMiddleware, signatureController.getSignaturesByFile);

// Finalize (embed) signatures in PDF
router.post('/api/signatures/finalize', authMiddleware, auditLogger('finalized'), signatureController.finalizeSignature);

// Upload signature image
router.post('/api/signatures/:id/image', authMiddleware, auditLogger('uploaded_image'), signatureController.uploadSignatureImage);

// Invite signer via email
router.post('/api/signatures/invite', authMiddleware, auditLogger('invited'), signatureController.inviteSigner);

// Accept signature
router.put('/api/signatures/:signatureId/accept', authMiddleware, auditLogger('accepted'), signatureController.acceptSignature);

// Reject signature
router.put('/api/signatures/:signatureId/reject', authMiddleware, auditLogger('rejected'), signatureController.rejectSignature);

// Audit trail route
router.get('/api/audit/:fileId', authMiddleware, auditController.getAuditTrail);

module.exports = router; 