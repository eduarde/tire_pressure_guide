# AWS EC2 Deployment with Pulumi (Python SDK)

Deploy both frontend and backend on a single AWS EC2 instance with **minimal cost** ($0-3/month).

## 💰 Cost Breakdown

| Resource | Cost | Notes |
|----------|------|-------|
| EC2 t2.micro | **$0** | Free tier: 750 hours/month (always-on) |
| Elastic IP | **$0** | Free when attached to running instance |
| EBS Storage (20GB) | **$0-2** | Free tier: 30GB gp3 |
| Data Transfer | **$0** | Free tier: 100GB/month |
| **Total** | **$0-3/month** | Free within AWS free tier limits |

## 🏗️ Architecture

- **Single t2.micro EC2 instance** (free tier eligible)
- **Docker Compose** running both services
- **Elastic IP** for static public IP
- **Security Groups** for firewall rules
- **Amazon Linux 2023** with Docker pre-configured

## 📋 Prerequisites

### 1. AWS Account Setup
```bash
# Install AWS CLI
brew install awscli  # macOS

# Configure AWS credentials
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1), Output format (json)
```

### 2. Create SSH Key Pair
```bash
# Create key pair in AWS
aws ec2 create-key-pair \
  --key-name tire-pressure-key \
  --query 'KeyMaterial' \
  --output text > ~/.ssh/tire-pressure-key.pem

# Set permissions
chmod 400 ~/.ssh/tire-pressure-key.pem
```

Or create via AWS Console:
1. Go to EC2 → Key Pairs → Create Key Pair
2. Name: `tire-pressure-key`
3. Download and save to `~/.ssh/tire-pressure-key.pem`

### 3. Install Pulumi
```bash
# macOS
brew install pulumi

# Or via curl
curl -fsSL https://get.pulumi.com | sh

# Verify
pulumi version
```

### 4. Install Python Dependencies
```bash
cd infra/aws

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## 🚀 Deployment Steps

### 1. Configure Pulumi
```bash
cd infra/aws

# Login to Pulumi (choose local or cloud backend)
pulumi login  # For Pulumi Cloud (free for individuals)
# OR
pulumi login --local  # For local state management

# Initialize stack
pulumi stack init dev
```

### 2. Update Configuration
```bash
# Set your AWS region
pulumi config set aws:region us-east-1

# Set your SSH key pair name (IMPORTANT!)
pulumi config set tire-pressure-guide-aws:key_name tire-pressure-key

# Verify config
pulumi config
```

Or edit `Pulumi.dev.yaml`:
```yaml
config:
  aws:region: us-east-1
  tire-pressure-guide-aws:key_name: tire-pressure-key  # Your key name
  tire-pressure-guide-aws:instance_type: t2.micro
```

### 3. Deploy Infrastructure
```bash
# Preview changes
pulumi preview

# Deploy
pulumi up
# Review the changes and confirm with "yes"
```

Deployment takes ~5-10 minutes. Pulumi will:
1. Create VPC, subnet, internet gateway
2. Create security groups
3. Launch EC2 instance
4. Install Docker and Docker Compose
5. Clone repository and start services
6. Attach Elastic IP

### 4. Get Deployment Info
```bash
# View outputs
pulumi stack output

# Get specific values
pulumi stack output public_ip
pulumi stack output frontend_url
pulumi stack output backend_url
```

Example output:
```
frontend_url: http://54.123.45.67:3000
backend_url: http://54.123.45.67:8088
api_docs: http://54.123.45.67:8088/docs
ssh_command: ssh -i ~/.ssh/tire-pressure-key.pem ec2-user@54.123.45.67
```

## 🔧 Post-Deployment Configuration

### 1. Wait for Services to Start
The EC2 instance needs time to:
- Install Docker (~2 minutes)
- Clone repository (~30 seconds)
- Build and start containers (~3-5 minutes)

Check status:
```bash
# SSH into instance
ssh -i ~/.ssh/tire-pressure-key.pem ec2-user@$(pulumi stack output public_ip)

# Check Docker status
sudo systemctl status docker

# Check containers
docker ps

# View logs
cd tire_pressure_guide
docker-compose logs -f
```

### 2. Update GitHub Repository URL
The default user data script clones from GitHub. Update `__main__.py` line 172:
```python
git clone https://github.com/eduarde/tire_pressure_guide.git
```

Change to your repository URL if different.

### 3. Setup Custom Domain (Optional)

In your DNS provider, create A records:
```
api.yourdomain.com → [EC2 Elastic IP]
app.yourdomain.com → [EC2 Elastic IP]
```

Then update CORS settings in the EC2 instance.

## 🔍 Monitoring & Logs

### Check Application Status
```bash
# SSH into instance
ssh -i ~/.ssh/tire-pressure-key.pem ec2-user@$(pulumi stack output public_ip)

# Check running containers
docker ps

# View logs
cd tire_pressure_guide
docker-compose logs backend
docker-compose logs frontend

# Restart services
docker-compose restart
```

### Access Points
- **Frontend**: `http://[ELASTIC_IP]:3000`
- **Backend API**: `http://[ELASTIC_IP]:8088`
- **API Docs**: `http://[ELASTIC_IP]:8088/docs`
- **SSH**: `ssh -i ~/.ssh/tire-pressure-key.pem ec2-user@[ELASTIC_IP]`

## 🛠️ Management Commands

### Update Application
```bash
# SSH into instance
ssh -i ~/.ssh/tire-pressure-key.pem ec2-user@$(pulumi stack output public_ip)

# Update code
cd tire_pressure_guide
git pull origin main

# Rebuild and restart
docker-compose up -d --build
```

### Stop Services
```bash
cd tire_pressure_guide
docker-compose down
```

### View Resource Usage
```bash
# CPU and memory
docker stats

# Disk usage
df -h
docker system df
```

## 🗑️ Destroy Infrastructure

When you're done, clean up all resources:

```bash
cd infra/aws

# Destroy all resources
pulumi destroy
# Confirm with "yes"

# Remove stack (optional)
pulumi stack rm dev
```

This stops all charges and removes:
- EC2 instance
- Elastic IP
- Security groups
- VPC and networking

## 💡 Cost Optimization Tips

### Stay Within Free Tier
- Use only **1 t2.micro instance** (750 hours/month free)
- Keep storage under **30GB**
- Stay under **100GB data transfer/month**
- Stop instance when not in use: `aws ec2 stop-instances --instance-ids [ID]`

### After Free Tier Expires (12 months)
t2.micro costs ~$8.50/month:
- Consider **stopping at night** (50% savings)
- Use **Reserved Instances** (up to 40% savings)
- Switch to **t4g.micro ARM** (~30% cheaper)

### Monitor Costs
```bash
# Check current month charges
aws ce get-cost-and-usage \
  --time-period Start=2025-10-01,End=2025-10-31 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

## 🔒 Security Best Practices

### 1. Restrict SSH Access
Update security group in `__main__.py` to your IP only:
```python
cidr_blocks=["YOUR.IP.ADDRESS.HERE/32"],  # Instead of 0.0.0.0/0
```

### 2. Setup Firewall Rules
```bash
# SSH into instance
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 3. Setup SSL/HTTPS (Optional)
```bash
# Install certbot
sudo yum install -y certbot

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com
```

## 🐛 Troubleshooting

### Issue: Services not starting
```bash
# SSH into instance
ssh -i ~/.ssh/tire-pressure-key.pem ec2-user@$(pulumi stack output public_ip)

# Check user data execution
sudo cat /var/log/cloud-init-output.log

# Manually run setup if needed
cd /home/ec2-user/tire_pressure_guide
sudo docker-compose up -d
```

### Issue: Can't connect to EC2
- Verify security group allows your IP
- Check Elastic IP is attached: `aws ec2 describe-addresses`
- Verify key pair permissions: `chmod 400 ~/.ssh/tire-pressure-key.pem`

### Issue: Out of memory
t2.micro has only 1GB RAM. If containers crash:
```bash
# Enable swap
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Issue: High costs
Check what's running:
```bash
# List all EC2 instances
aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,State.Name,InstanceType]'

# Check for unattached Elastic IPs (these cost money!)
aws ec2 describe-addresses --query 'Addresses[?AssociationId==null]'
```

## 📚 Additional Resources

- [AWS Free Tier](https://aws.amazon.com/free/)
- [Pulumi AWS Documentation](https://www.pulumi.com/docs/clouds/aws/)
- [EC2 Pricing](https://aws.amazon.com/ec2/pricing/)
- [AWS Cost Calculator](https://calculator.aws/)

## 🆚 Comparison: EC2 vs Vercel

| Feature | AWS EC2 (This Setup) | Vercel |
|---------|---------------------|---------|
| **Cost** | $0-3/month (free tier) | $0/month |
| **Setup Time** | 15 minutes | 5 minutes |
| **Always-On** | ✅ Yes | ❌ Cold starts |
| **Full Control** | ✅ Yes | ❌ Limited |
| **SSL/HTTPS** | Manual setup | ✅ Automatic |
| **Scaling** | Manual | ✅ Automatic |
| **Best For** | Learning, full control | Production, simplicity |

**Recommendation**: Use **Vercel** for quick deployment and production. Use **EC2** for learning AWS, full control, or when you need always-on services without cold starts.
