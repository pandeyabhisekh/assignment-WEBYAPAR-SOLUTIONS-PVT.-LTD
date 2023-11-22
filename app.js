// app.js
document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('uploadForm');
  const imageInput = document.getElementById('imageInput');
  const imageGallery = document.getElementById('imageGallery');

  // Event listener for image upload form
  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', imageInput.files[0]);

    try {
      // Upload image using axios
      await axios.post('http://localhost:3000/upload', formData);

      // Fetch and display all images
      const response = await axios.get('http://localhost:3000/images');
      displayImages(response.data);
    } catch (error) {
      console.error('Error uploading image:', error.response.data.error);
    }
  });

  // Fetch and display all images on page load
  axios.get('http://localhost:3000/images')
    .then((response) => displayImages(response.data))
    .catch((error) => console.error('Error fetching images:', error.response.data.error));

  // Function to display images in the gallery
  function displayImages(images) {
    imageGallery.innerHTML = '';
    images.forEach((image) => {
      const imageUrl = `data:${image.contentType};base64,${image.data.toString('base64')}`;
      const imageCard = document.createElement('div');
      imageCard.classList.add('card', 'image-card');
      imageCard.innerHTML = `
        <img src="${imageUrl}" class="card-img-top" alt="Uploaded Image">
      `;
      imageGallery.appendChild(imageCard);
    });
  }
});
