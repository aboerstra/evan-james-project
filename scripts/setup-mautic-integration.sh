#!/bin/bash

# Mautic-Strapi Integration Setup Script
# This script helps set up the Mautic integration for Strapi

echo "🚀 Setting up Mautic-Strapi Integration..."

# Check if we're in the correct directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "❌ Error: backend/.env file not found"
    echo "Please create a .env file in the backend directory first"
    exit 1
fi

echo "📋 Checking current configuration..."

# Check if Mautic environment variables are set
if grep -q "MAUTIC_INTEGRATION_ENABLED" backend/.env; then
    echo "✅ Mautic environment variables found in .env"
else
    echo "⚠️  Mautic environment variables not found in .env"
    echo "📝 Adding Mautic configuration template to .env..."
    
    cat >> backend/.env << EOF

# Mautic Integration Configuration
MAUTIC_INTEGRATION_ENABLED=false
MAUTIC_BASE_URL=https://mautic.evanjamesofficial.com
MAUTIC_API_USERNAME=
MAUTIC_API_PASSWORD=
MAUTIC_API_TIMEOUT=10000
EOF
    
    echo "✅ Mautic configuration template added to .env"
    echo "📝 Please edit backend/.env and configure your Mautic credentials"
fi

# Check if axios is installed
if grep -q '"axios"' backend/package.json; then
    echo "✅ Axios dependency found"
else
    echo "📦 Installing axios dependency..."
    cd backend && npm install axios && cd ..
    echo "✅ Axios installed"
fi

echo ""
echo "🎉 Mautic-Strapi Integration setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure Mautic API settings:"
echo "   - Enable API in Mautic (Settings → Configuration → API Settings)"
echo "   - Create API user in Mautic (Settings → Users)"
echo "   - Set API credentials in backend/.env"
echo ""
echo "2. Enable the integration:"
echo "   - Set MAUTIC_INTEGRATION_ENABLED=true in backend/.env"
echo ""
echo "3. Test the connection:"
echo "   - Restart Strapi backend"
echo "   - Use admin endpoint: GET /api/newsletter-subscriptions/mautic/test-connection"
echo ""
echo "4. Sync existing subscriptions (optional):"
echo "   - Use admin endpoint: POST /api/newsletter-subscriptions/bulk-sync-to-mautic"
echo ""
echo "📖 For detailed setup instructions, see: docs/MAUTIC_STRAPI_INTEGRATION.md"
echo ""
echo "🔧 Integration features:"
echo "   ✅ Automatic sync on email verification"
echo "   ✅ Automatic unsubscribe handling"
echo "   ✅ Manual sync tools for admins"
echo "   ✅ Bulk sync for existing data"
echo "   ✅ Connection testing"
echo "   ✅ Comprehensive error handling"
echo ""
