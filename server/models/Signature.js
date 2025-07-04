const mongoose = require('mongoose');

const coordinateSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  page: { type: Number, required: true, default: 1 }
}, { _id: false });

const signatureSchema = new mongoose.Schema({
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  coordinates: [coordinateSchema],
  signer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'signed', 'rejected'], default: 'pending' },
  rejectionReason: { type: String },
  images: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Signature', signatureSchema); 