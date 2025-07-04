const Audit = require('../models/Audit');
const Signature = require('../models/Signature');

const auditLogger = (action) => async (req, res, next) => {
  res.on('finish', async () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      let fileId = req.body.fileId || req.params.fileId;
      const signer = req.user?.id;
      
      // For accept/reject actions, get fileId from the signature
      if (!fileId && (action === 'accepted' || action === 'rejected')) {
        try {
          const signature = await Signature.findById(req.params.signatureId);
          if (signature) {
            fileId = signature.fileId;
          }
        } catch (err) {
          console.error('Error getting fileId from signature:', err);
        }
      }
      
      if (fileId && signer) {
        await Audit.create({
          fileId,
          signer,
          action,
          ip: req.ip
        });
      }
    }
  });
  next();
};

module.exports = auditLogger; 