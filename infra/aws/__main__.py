"""
Pulumi Infrastructure for Tire Pressure Guide on AWS EC2
- Free tier eligible: t2.micro instance
- Single EC2 instance running both frontend and backend via Docker Compose
- Estimated cost: $0-3/month (free within AWS free tier)
"""

import pulumi
import pulumi_aws as aws

# Configuration
config = pulumi.Config()
aws_config = pulumi.Config("aws")
aws_region = aws_config.get("region") or "eu-central-1"
instance_type = config.get("instance_type") or "t2.micro"  # Free tier eligible
key_name = config.require("key_name")  # SSH key pair name (must exist in AWS)

# Get the latest Amazon Linux 2023 AMI
ami = aws.ec2.get_ami(
    most_recent=True,
    owners=["amazon"],
    filters=[
        aws.ec2.GetAmiFilterArgs(
            name="name",
            values=["al2023-ami-*-x86_64"],
        ),
        aws.ec2.GetAmiFilterArgs(
            name="virtualization-type",
            values=["hvm"],
        ),
    ],
)

# Create a VPC (Free)
vpc = aws.ec2.Vpc(
    "tire-pressure-vpc",
    cidr_block="10.0.0.0/16",
    enable_dns_hostnames=True,
    enable_dns_support=True,
    tags={
        "Name": "tire-pressure-vpc",
    },
)

# Create an Internet Gateway (Free)
igw = aws.ec2.InternetGateway(
    "tire-pressure-igw",
    vpc_id=vpc.id,
    tags={
        "Name": "tire-pressure-igw",
    },
)

# Create a public subnet (Free)
public_subnet = aws.ec2.Subnet(
    "tire-pressure-public-subnet",
    vpc_id=vpc.id,
    cidr_block="10.0.1.0/24",
    availability_zone=f"{aws_region}a",
    map_public_ip_on_launch=True,
    tags={
        "Name": "tire-pressure-public-subnet",
    },
)

# Create a route table (Free)
route_table = aws.ec2.RouteTable(
    "tire-pressure-route-table",
    vpc_id=vpc.id,
    routes=[
        aws.ec2.RouteTableRouteArgs(
            cidr_block="0.0.0.0/0",
            gateway_id=igw.id,
        ),
    ],
    tags={
        "Name": "tire-pressure-route-table",
    },
)

# Associate route table with subnet (Free)
route_table_association = aws.ec2.RouteTableAssociation(
    "tire-pressure-route-table-association",
    subnet_id=public_subnet.id,
    route_table_id=route_table.id,
)

# Create Security Group (Free)
security_group = aws.ec2.SecurityGroup(
    "tire-pressure-sg",
    vpc_id=vpc.id,
    description="Security group for Tire Pressure Guide",
    ingress=[
        # SSH
        aws.ec2.SecurityGroupIngressArgs(
            protocol="tcp",
            from_port=22,
            to_port=22,
            cidr_blocks=["0.0.0.0/0"],
            description="SSH access",
        ),
        # HTTP
        aws.ec2.SecurityGroupIngressArgs(
            protocol="tcp",
            from_port=80,
            to_port=80,
            cidr_blocks=["0.0.0.0/0"],
            description="HTTP access",
        ),
        # HTTPS
        aws.ec2.SecurityGroupIngressArgs(
            protocol="tcp",
            from_port=443,
            to_port=443,
            cidr_blocks=["0.0.0.0/0"],
            description="HTTPS access",
        ),
        # Backend API
        aws.ec2.SecurityGroupIngressArgs(
            protocol="tcp",
            from_port=8088,
            to_port=8088,
            cidr_blocks=["0.0.0.0/0"],
            description="Backend API",
        ),
        # Frontend
        aws.ec2.SecurityGroupIngressArgs(
            protocol="tcp",
            from_port=3000,
            to_port=3000,
            cidr_blocks=["0.0.0.0/0"],
            description="Frontend",
        ),
    ],
    egress=[
        # Allow all outbound traffic
        aws.ec2.SecurityGroupEgressArgs(
            protocol="-1",
            from_port=0,
            to_port=0,
            cidr_blocks=["0.0.0.0/0"],
            description="Allow all outbound",
        ),
    ],
    tags={
        "Name": "tire-pressure-sg",
    },
)

# User data script to setup Docker and run the application
domain_name = config.get("domain_name")
allowed_origins = f"http://{domain_name},https://{domain_name}" if domain_name else "http://$(ec2-metadata --public-ipv4 | cut -d ' ' -f 2):3000"

user_data_script = f"""#!/bin/bash
set -e

# Update system
yum update -y

# Install Docker, Nginx, and Git
yum install -y docker nginx git

# Start Docker service
systemctl start docker
systemctl enable docker

# Add ec2-user to docker group
usermod -aG docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# Clone repository
cd /home/ec2-user
git clone https://github.com/eduarde/tire_pressure_guide.git
cd tire_pressure_guide

# Fix ownership
chown -R ec2-user:ec2-user /home/ec2-user/tire_pressure_guide

# Get public IP
PUBLIC_IP=$(ec2-metadata --public-ipv4 | cut -d ' ' -f 2)

# Create .env file for production
cat > .env << 'ENVEOF'
ENVIRONMENT=production
ALLOWED_ORIGINS={allowed_origins}
ENVEOF

# Build and start services
docker build -t tire_pressure_guide-backend:latest .
cd frontend
docker build -t tire_pressure_guide-frontend:latest --build-arg VITE_API_URL=http://{"$PUBLIC_IP" if not domain_name else f"api.{domain_name}"}:8088 .
cd ..

# Create docker-compose.yml
cat > docker-compose.yml << 'COMPOSEEOF'
version: '3.8'

services:
  backend:
    image: tire_pressure_guide-backend:latest
    container_name: tire-pressure-backend
    ports:
      - "8088:8088"
    environment:
      - ENVIRONMENT=production
      - ALLOWED_ORIGINS={allowed_origins}
    networks:
      - tire-pressure-network

  frontend:
    image: tire_pressure_guide-frontend:latest
    container_name: tire-pressure-frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - tire-pressure-network

networks:
  tire-pressure-network:
    driver: bridge
COMPOSEEOF

docker-compose up -d"""

if domain_name:
    user_data_script += f"""

# Configure Nginx as reverse proxy
cat > /tmp/nginx-tunelab.conf << 'NGINXEOF'
server {{{{
    listen 80;
    server_name {domain_name} www.{domain_name};

    location / {{{{
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $$host;
        proxy_cache_bypass $$http_upgrade;
    }}}}
}}}}

server {{{{
    listen 80;
    server_name api.{domain_name};

    location / {{{{
        proxy_pass http://localhost:8088;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $$host;
        proxy_cache_bypass $$http_upgrade;
    }}}}
}}}}
NGINXEOF

mv /tmp/nginx-tunelab.conf /etc/nginx/conf.d/tunelab.conf

# Start Nginx
systemctl start nginx
systemctl enable nginx

# Install Certbot and obtain SSL certificates
yum install -y certbot python3-certbot-nginx

# Wait for DNS to propagate (in case of new instance)
sleep 30

# Get SSL certificates
certbot --nginx -d {domain_name} -d www.{domain_name} -d api.{domain_name} --non-interactive --agree-tos --email eduarderja@gmail.com --redirect || echo "SSL certificate installation failed, will retry later"

# Enable auto-renewal
systemctl start certbot-renew.timer
systemctl enable certbot-renew.timer
"""

user_data_script += """


# Setup auto-start on reboot
cat > /etc/systemd/system/tire-pressure.service << 'EOFS'
[Unit]
Description=Tire Pressure Guide
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ec2-user/tire_pressure_guide
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
User=ec2-user

[Install]
WantedBy=multi-user.target
EOFS

systemctl enable tire-pressure.service

echo "Setup complete! Application is running."
"""

# Create EC2 instance (t2.micro is free tier eligible)
instance = aws.ec2.Instance(
    "tire-pressure-instance",
    instance_type=instance_type,
    ami=ami.id,
    key_name=key_name,
    subnet_id=public_subnet.id,
    vpc_security_group_ids=[security_group.id],
    user_data=user_data_script,
    associate_public_ip_address=True,
    tags={
        "Name": "tire-pressure-guide",
    },
    # Enable detailed monitoring (free tier includes basic monitoring)
    monitoring=False,
    # Root volume configuration (free tier includes 30GB)
    root_block_device=aws.ec2.InstanceRootBlockDeviceArgs(
        volume_size=20,  # GB - well within free tier
        volume_type="gp3",  # Cheaper than gp2
        delete_on_termination=True,
    ),
)

# Create an Elastic IP (Free when attached to running instance)
eip = aws.ec2.Eip(
    "tire-pressure-eip",
    instance=instance.id,
    tags={
        "Name": "tire-pressure-eip",
    },
)

# Route 53 Configuration for custom domain
domain_name = config.get("domain_name")  # Optional: tunelab.cc

if domain_name:
    # Get the hosted zone for the domain
    zone = aws.route53.get_zone(name=domain_name)
    
    # Create A record for root domain pointing to EC2 instance
    root_record = aws.route53.Record(
        "root-domain-record",
        zone_id=zone.zone_id,
        name=domain_name,
        type="A",
        ttl=300,
        records=[eip.public_ip],
    )
    
    # Create A record for www subdomain
    www_record = aws.route53.Record(
        "www-domain-record",
        zone_id=zone.zone_id,
        name=f"www.{domain_name}",
        type="A",
        ttl=300,
        records=[eip.public_ip],
    )
    
    # Create A record for api subdomain (for backend)
    api_record = aws.route53.Record(
        "api-domain-record",
        zone_id=zone.zone_id,
        name=f"api.{domain_name}",
        type="A",
        ttl=300,
        records=[eip.public_ip],
    )
    
    pulumi.export("domain", domain_name)
    pulumi.export("www_domain", f"www.{domain_name}")
    pulumi.export("api_domain", f"api.{domain_name}")
    pulumi.export("domain_frontend_url", f"http://{domain_name}:3000")
    pulumi.export("domain_backend_url", f"http://api.{domain_name}:8088")

# Exports
pulumi.export("instance_id", instance.id)
pulumi.export("public_ip", eip.public_ip)
pulumi.export("public_dns", instance.public_dns)
pulumi.export("frontend_url", eip.public_ip.apply(lambda ip: f"http://{ip}:3000"))
pulumi.export("backend_url", eip.public_ip.apply(lambda ip: f"http://{ip}:8088"))
pulumi.export("api_docs", eip.public_ip.apply(lambda ip: f"http://{ip}:8088/docs"))
pulumi.export("ssh_command", pulumi.Output.concat(
    "ssh -i ~/.ssh/",
    key_name,
    ".pem ec2-user@",
    eip.public_ip
))
pulumi.export("estimated_monthly_cost", "$0-3 (free within AWS free tier)")
