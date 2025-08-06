export default async function handler(req, res) {
  const { path } = req.query;
  const backendUrl = process.env.VITE_API_URL || 'http://localhost:3000';
  
  // Construct the full backend URL
  const targetUrl = `${backendUrl}/api/${path.join('/')}`;
  
  try {
    // Forward the request to the backend
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'Authorization': req.headers.authorization || '',
        ...req.headers
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    
    // Get the response data
    const data = await response.json();
    
    // Forward the response
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
} 