const Audit = require('../models/Audit');

exports.getAuditTrail = async (req, res) => {
  try {
    const { fileId } = req.params;
    const audits = await Audit.find({ fileId }).populate('signer', 'email name');
    res.json(audits);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch audit trail' });
  }
}; 