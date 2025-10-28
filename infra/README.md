# 🏗️ Infrastructure & Deployment

This directory contains deployment configurations for the Tire Pressure Guide application.

## 📁 Directory Structure

```
infra/
├── README.md                   # This file
└── aws/
    ├── README.md              # AWS EC2 deployment guide
    ├── Pulumi.yaml            # Pulumi project configuration
    ├── Pulumi.dev.yaml        # Development stack configuration
    ├── requirements.txt       # Python dependencies
    ├── __main__.py            # Infrastructure as code (Python SDK)
    └── .gitignore             # Git ignore patterns
```

## 🚀 Deployment Option: AWS EC2 with Pulumi

Deploy both frontend and backend on a **single AWS EC2 instance** with minimal cost.

### 💰 Cost
- **$0-3/month** (free within AWS free tier)
- Uses **t2.micro** instance (free tier eligible: 750 hours/month)
- Elastic IP (free when attached)
- 20GB storage (well within 30GB free tier)

### ⚡ Features
- ✅ Single EC2 instance running both services via Docker Compose
- ✅ Always-on (no cold starts)
- ✅ Full control over infrastructure
- ✅ Elastic IP for static public IP
- ✅ Auto-setup with user data script
- ✅ Infrastructure as Code with Pulumi Python SDK

### 📖 Quick Start

```bash
# Navigate to AWS infrastructure directory
cd infra/aws

# Install dependencies
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure Pulumi
pulumi login
pulumi stack init dev
pulumi config set aws:region us-east-1
pulumi config set tire-pressure-guide-aws:key_name your-key-pair-name

# Deploy
pulumi up
```

See [aws/README.md](./aws/README.md) for detailed instructions.

## 🆚 Deployment Comparison

| Platform | Cost/Month | Setup Time | Cold Starts | Control | SSL | Best For |
|----------|-----------|------------|-------------|---------|-----|----------|
| **AWS EC2** (this) | $0-3 | 15 min | ❌ No | ✅ Full | Manual | Learning AWS, full control |
| **Vercel** | $0 | 5 min | ⚠️ Yes | ❌ Limited | ✅ Auto | Quick deployment, production |

## 📚 Documentation

- **[AWS EC2 Deployment](./aws/README.md)** - Complete guide for deploying on AWS EC2 with Pulumi Python SDK

## 🔗 Useful Links

- [Pulumi Documentation](https://www.pulumi.com/docs/)
- [Pulumi AWS Provider](https://www.pulumi.com/docs/clouds/aws/)
- [AWS Free Tier](https://aws.amazon.com/free/)
- [AWS EC2 Pricing](https://aws.amazon.com/ec2/pricing/)

## 💡 When to Use Each Option

### Use AWS EC2 When:
- You want to learn AWS infrastructure
- You need full control over the server
- You want always-on services (no cold starts)
- You're comfortable with server management
- You have AWS free tier available

### Use Vercel When:
- You want the quickest deployment
- You don't want to manage servers
- You need automatic SSL/HTTPS
- You want zero configuration
- Cold starts are acceptable

---

**Current Setup**: This repository uses **AWS EC2 with Pulumi Python SDK** for infrastructure as code deployment.
