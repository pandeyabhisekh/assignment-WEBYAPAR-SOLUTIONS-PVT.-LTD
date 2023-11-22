// index.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const sharp = require('sharp');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/image_gallery', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Setup Multer for image upload
const upload = multer({
  limits: {
    fileSize: 10000000, // 10MB limit
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image file.'));
    }
    cb(undefined, true);
  },
});

// Define mongoose schema and model for images
const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
});
const Image = mongoose.model('Image', imageSchema);

// Express routes
app.use(express.json());

// Image upload route with in-browser cropping
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .toBuffer();

    const image = new Image({
      data: buffer,
      contentType: req.file.mimetype,
    });
    await image.save();
    res.status(201).send();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Get all uploaded images
app.get('/images', async (req, res) => {
  try {
    const images = await Image.find();
    res.send(images);
  } catch (error) {
    res.status(500).send();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
