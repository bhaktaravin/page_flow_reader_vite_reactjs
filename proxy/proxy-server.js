import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());

// Proxy endpoint for manga images
app.get('/proxy', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    console.log(`🔄 Proxying request to: ${url}`);

    // Fetch the image from MangaDx
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PageFlow Reader/1.0.0',
        'Referer': 'https://mangadx.org/'
      }
    });

    if (!response.ok) {
      console.log(`❌ Failed to fetch: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({ 
        error: `Failed to fetch: ${response.status} ${response.statusText}` 
      });
    }

    // Set appropriate headers
    res.set({
      'Content-Type': response.headers.get('content-type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      'Access-Control-Allow-Origin': '*'
    });

    // Pipe the image data
    response.body.pipe(res);
    console.log(`✅ Successfully proxied image`);

  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'PageFlow Reader CORS Proxy is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 PageFlow Reader CORS Proxy running on http://localhost:${PORT}`);
  console.log(`📡 Use: http://localhost:${PORT}/proxy?url=<manga-image-url>`);
});