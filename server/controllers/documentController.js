const Document = require('../models/Document');

exports.uploadDocument = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  try {
    const doc = new Document({
      originalName: req.file.originalname,
      filePath: req.file.path.replace(/\\/g, '/'),
      uploader: req.user.id,
    });
    await doc.save();
    res.status(201).json({ message: 'File uploaded successfully', document: doc });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listUserDocuments = async (req, res) => {
  try {
    let docs = await Document.find({ uploader: req.user.id }).sort({ uploadDate: -1 });
    
    docs = docs.map(doc => {
      doc.filePath = doc.filePath.replace(/\\/g, '/');
      return doc;
    });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 