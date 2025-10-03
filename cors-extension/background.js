chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    const headers = details.responseHeaders || [];
    
    // Add CORS headers to allow access
    headers.push({
      name: 'Access-Control-Allow-Origin',
      value: '*'
    });
    
    headers.push({
      name: 'Access-Control-Allow-Methods',
      value: 'GET, POST, PUT, DELETE, OPTIONS'
    });
    
    headers.push({
      name: 'Access-Control-Allow-Headers',
      value: '*'
    });
    
    return { responseHeaders: headers };
  },
  {
    urls: ["*://uploads.mangadx.org/*"]
  },
  ["blocking", "responseHeaders"]
);