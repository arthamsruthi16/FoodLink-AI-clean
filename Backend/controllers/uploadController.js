function uploadSingleImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'Image upload failed or no file provided.' });
  }

  const publicUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(201).json({ imageUrl: publicUrl, filename: req.file.filename });
}

module.exports = { uploadSingleImage };
