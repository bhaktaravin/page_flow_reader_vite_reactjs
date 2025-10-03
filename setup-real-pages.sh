#!/bin/bash

echo "🚀 Setting up PageFlow Reader with Real Manga Pages"
echo "=================================================="

# Install proxy dependencies
echo "📦 Installing proxy server dependencies..."
cd proxy
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 To enable real manga pages:"
echo "1. Start the proxy server: cd proxy && npm start"
echo "2. Start your React app: npm run dev" 
echo "3. Search for manga and enjoy real pages!"
echo ""
echo "💡 The proxy server runs on http://localhost:3001"
echo "💡 Your React app runs on http://localhost:5173"
echo ""
echo "🔧 Troubleshooting:"
echo "   - Make sure both servers are running"
echo "   - Check console for 'Local Proxy (Best)' messages"
echo "   - If proxy fails, app will fallback to demo pages"