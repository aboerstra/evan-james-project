// This API route is used to fix the Content-Type header issue
export default function handler(req, res) {
  // Set the Content-Type header correctly
  res.setHeader('Content-Type', 'application/json');
  
  // Return a success message
  res.status(200).json({ 
    message: 'Headers fixed successfully',
    timestamp: new Date().toISOString()
  });
}
