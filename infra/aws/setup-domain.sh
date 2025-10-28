#!/bin/bash
# Setup script for custom domain on EC2
# Run this on your EC2 instance after SSH

set -e

FRONTEND_DOMAIN="${1:-yourdomain.com}"
BACKEND_DOMAIN="${2:-api.yourdomain.com}"

echo "Setting up domains:"
echo "  Frontend: $FRONTEND_DOMAIN"
echo "  Backend: $BACKEND_DOMAIN"

# Install Nginx
sudo yum install -y nginx

# Create Nginx configuration
sudo tee /etc/nginx/conf.d/tire-pressure.conf > /dev/null <<EOF
# Frontend
server {
    listen 80;
    server_name $FRONTEND_DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}

# Backend API
server {
    listen 80;
    server_name $BACKEND_DOMAIN;

    location / {
        proxy_pass http://localhost:8088;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Update CORS settings
cd /home/ec2-user/tire_pressure_guide
cat > .env << EOF
ENVIRONMENT=production
ALLOWED_ORIGINS=http://$FRONTEND_DOMAIN,https://$FRONTEND_DOMAIN
EOF

# Restart containers
docker-compose restart backend

echo "✓ Setup complete!"
echo ""
echo "Frontend: http://$FRONTEND_DOMAIN"
echo "Backend: http://$BACKEND_DOMAIN"
echo ""
echo "Next step: Setup SSL with certbot (see setup-ssl.sh)"
