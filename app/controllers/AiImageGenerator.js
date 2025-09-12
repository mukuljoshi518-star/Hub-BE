const { default: axios } = require('axios');
const FormData = require('form-data');

const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const form = new FormData();

    // Stability API expects a JSON field with your payload
    const payload = {
      prompt: prompt,
      // include other required fields like 'cfg_scale', 'steps', 'samples' etc. as per API docs
      output_format: 'png',
      aspect_ratio: '1:1',
    };

    form.append('json', JSON.stringify(payload));

    const response = await axios.post(
      'https://api.stability.ai/v2beta/stable-image/generate/sd3',
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${process.env.API_KEY}`
        },
        responseType: 'arraybuffer' // for image buffer response
      }
    );

    // Save file
    const fileName = `image_${Date.now()}.png`;
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, response.data);

    const imageUrl = `/uploads/${fileName}`;
    await Image.create({ prompt, imageUrl });

    res.json({ imageUrl });
  } catch (error) {
    console.error('Image generation error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate image' });
  }
};

module.exports = {
    generateImage
}