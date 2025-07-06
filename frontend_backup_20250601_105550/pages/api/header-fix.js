// This API route is used to patch the global Response object to fix Content-Type header issues
export default function handler(req, res) {
  // Patch the global Response object if it exists
  if (typeof global.Response !== 'undefined') {
    const originalSetHeader = global.Response.prototype.setHeader;
    if (originalSetHeader) {
      global.Response.prototype.setHeader = function(name, value) {
        // Fix Content-Type header if it contains square brackets
        if (name === 'Content-Type' && typeof value === 'string' && value.includes('[')) {
          value = value.replace(/[\[\]"]/g, '');
        }
        return originalSetHeader.call(this, name, value);
      };
    }
  }
  
  // Patch the ServerResponse object
  if (typeof res.constructor !== 'undefined') {
    const originalSetHeader = res.constructor.prototype.setHeader;
    if (originalSetHeader) {
      res.constructor.prototype.setHeader = function(name, value) {
        // Fix Content-Type header if it contains square brackets
        if (name === 'Content-Type' && typeof value === 'string' && value.includes('[')) {
          value = value.replace(/[\[\]"]/g, '');
        }
        return originalSetHeader.call(this, name, value);
      };
    }
  }
  
  // Return a success message
  res.status(200).json({ 
    message: 'Headers patched successfully',
    timestamp: new Date().toISOString()
  });
}
