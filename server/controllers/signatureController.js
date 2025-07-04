const Signature = require('../models/Signature');
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');
const Document = require('../models/Document');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Save signature positions
exports.saveSignature = async (req, res) => {
  try {
    const { fileId, coordinates, status } = req.body;
    const signer = req.user.id;

    if (!fileId || !coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
      return res.status(400).json({ message: 'Missing or invalid coordinates' });
    }

    const targetPage = coordinates[0].page || 1;

    // Check if user already signed this file on this page
    const existing = await Signature.findOne({
      fileId,
      signer,
      'coordinates.page': targetPage,
    });

    if (existing) {
      return res.status(200).json({
        message: `Signature already exists for page ${targetPage}`,
        signature: existing,
      });
    }

    // Proceed to save
    const signature = new Signature({
      fileId,
      coordinates,
      signer,
      status: status || 'pending',
    });

    await signature.save();

    res.status(201).json({
      message: 'Signature saved',
      signature,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getSignaturesByFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const signatures = await Signature.find({ fileId });
    res.json(signatures);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.finalizeSignature = async (req, res) => {
  try {
    const { fileId } = req.body;

    const doc = await Document.findById(fileId);
    const signatures = await Signature.find({ fileId, status: 'signed' });

    if (!doc || !signatures.length) {
      return res.status(404).json({ message: 'Document or signed signatures not found' });
    }

    const existingPdfBytes = fs.readFileSync(doc.filePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();

    for (const sig of signatures) {
      for (const [cidx, coord] of sig.coordinates.entries()) {
        const pageIndex = (coord.page ? coord.page - 1 : 0);
        if (pageIndex >= pages.length) continue;

        const page = pages[pageIndex];
        const { width, height } = page.getSize();
        
        const hasImage = sig.images && sig.images[cidx];

        if (hasImage) {
        
          const pngImageBytes = Buffer.from(sig.images[cidx].split(',')[1], 'base64');
          const pngImage = await pdfDoc.embedPng(pngImageBytes);
          const imageWidth = 50; 
          page.drawImage(pngImage, {
            x: coord.x * width,
            y: height - (coord.y * height) - (24 / 2), 
            width: imageWidth,
            height: (imageWidth * pngImage.height) / pngImage.width,
          });
        } else {
        
          page.drawText('Signed', {
            x: coord.x * width,
            y: height - (coord.y * height),
            size: 12,
            color: rgb(0, 0.53, 0),
          });
        }
      }
    }

    const signedPdfBytes = await pdfDoc.save();
    const signedFileName = `signed-${Date.now()}-${path.basename(doc.filePath)}`;
    const signedPath = path.join('uploads', signedFileName);
    fs.writeFileSync(signedPath, signedPdfBytes);

    res.status(200).json({
      message: 'PDF signed successfully',
      signedFile: signedPath.replace(/\\/g, '/'),
    });
  } catch (err) {
    console.error('Finalize Signature Error:', err);
    res.status(500).json({ message: 'Failed to sign PDF' });
  }
};

exports.uploadSignatureImage = async (req, res) => {
  try {
    const { image, cidx } = req.body;
    const { id } = req.params;

    if (!image || typeof cidx !== 'number') {
      return res.status(400).json({ message: 'Missing image or cidx' });
    }

    const signature = await Signature.findById(id);
    if (!signature) {
      return res.status(404).json({ message: 'Signature not found' });
    }

    // Initialize images array if not present
    if (!signature.images) signature.images = [];

    // Ensure images array is as long as coordinates
    while (signature.images.length < signature.coordinates.length) {
      signature.images.push(null);
    }

    // Update specific image at cidx
    signature.images[cidx] = image;
    await signature.save();

    // ✅ Return all updated signatures for the same document
    const updatedSignatures = await Signature.find({ fileId: signature.fileId });

    res.status(200).json({
      message: 'Signature image saved',
      signatures: updatedSignatures,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save signature image' });
  }
};

exports.inviteSigner = async (req, res) => {
  try {
    const { fileId, signerEmail } = req.body;
    if (!fileId || !signerEmail) {
      return res.status(400).json({ message: 'Missing fileId or signerEmail' });
    }
    // 1. Generate token
    const token = jwt.sign({ fileId, signerEmail }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '2d' });
    const link = `http://localhost:3000/sign?token=${token}`;

    // 2. Send email (or log for dev)
    // Setup nodemailer (use Ethereal for dev)
    let testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    const info = await transporter.sendMail({
      from: 'DocuSign Clone <no-reply@yourapp.com>',
      to: signerEmail,
      subject: 'You are invited to sign a document',
      text: `Click to sign: ${link}`,
      html: `<a href="${link}">Click to sign the document</a>`
    });

    res.json({
      message: 'Invite sent',
      link,
      preview: nodemailer.getTestMessageUrl(info)
    });
  } catch (err) {
    console.error('Invite Signer Error:', err);
    res.status(500).json({ message: 'Failed to send invite' });
  }
};

// Accept signature
exports.acceptSignature = async (req, res) => {
  try {
    const { signatureId } = req.params;
    const { reason } = req.body;

    const signature = await Signature.findById(signatureId);
    if (!signature) {
      return res.status(404).json({ message: 'Signature not found' });
    }

    // Check if user is authorized to accept this signature
    if (signature.signer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to accept this signature' });
    }

    // Update status to signed
    signature.status = 'signed';
    if (reason) {
      signature.rejectionReason = null; // Clear any previous rejection reason
    }
    await signature.save();

    res.json({
      message: 'Signature accepted successfully',
      signature
    });
  } catch (err) {
    console.error('Accept Signature Error:', err);
    res.status(500).json({ message: 'Failed to accept signature' });
  }
};

// Reject signature
exports.rejectSignature = async (req, res) => {
  try {
    const { signatureId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const signature = await Signature.findById(signatureId);
    if (!signature) {
      return res.status(404).json({ message: 'Signature not found' });
    }

    // Check if user is authorized to reject this signature
    if (signature.signer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to reject this signature' });
    }

    // Update status to rejected with reason
    signature.status = 'rejected';
    signature.rejectionReason = reason;
    await signature.save();

    res.json({
      message: 'Signature rejected successfully',
      signature
    });
  } catch (err) {
    console.error('Reject Signature Error:', err);
    res.status(500).json({ message: 'Failed to reject signature' });
  }
};

// Get signature status summary for a document
exports.getSignatureStatus = async (req, res) => {
  try {
    console.log('getSignatureStatus called with fileId:', req.params.fileId);
    const { fileId } = req.params;
    
    const signatures = await Signature.find({ fileId }).populate('signer', 'email name');
    console.log('Found signatures:', signatures.length);
    
    const statusSummary = {
      total: signatures.length,
      pending: signatures.filter(s => s.status === 'pending').length,
      signed: signatures.filter(s => s.status === 'signed').length,
      rejected: signatures.filter(s => s.status === 'rejected').length,
      signatures: signatures
    };

    console.log('Status summary:', statusSummary);
    res.json(statusSummary);
  } catch (err) {
    console.error('Get Signature Status Error:', err);
    res.status(500).json({ message: 'Failed to get signature status' });
  }
}; 