# EventHub AWS Deployment Guide

## Overview
EventHub is deployed on AWS with the following architecture:
- **Frontend**: Next.js on Vercel or AWS Amplify
- **Backend**: Node.js/Express on Elastic Beanstalk
- **Database**: AWS RDS (PostgreSQL/MySQL)
- **Storage**: AWS S3 for images
- **Authentication**: AWS Cognito
- **Email**: AWS SES
- **Monitoring**: CloudWatch

## Prerequisites
- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Node.js 18+ installed
- Vercel account (optional, for frontend hosting)

## Step 1: Database Setup (AWS RDS)

### Create RDS Database
\`\`\`bash
# Using AWS Console
1. Go to RDS > Create database
2. Select PostgreSQL (or MySQL)
3. DB instance class: db.t4g.micro (Free tier eligible)
4. Allocate storage: 20 GB
5. Set Master username: admin
6. Set Master password: [secure password]
7. Create database

# Get endpoint after creation and save for later
\`\`\`

### Run Database Schema
\`\`\`bash
# Connect to RDS
psql -h <your-rds-endpoint> -U admin -d eventhub -f scripts/init-database.sql

# Or use MySQL
mysql -h <your-rds-endpoint> -u admin -p eventhub < scripts/init-database.sql
\`\`\`

## Step 2: AWS Secrets Manager

Store sensitive configuration:

\`\`\`bash
aws secretsmanager create-secret \
  --name eventhub/db \
  --secret-string '{
    "username":"admin",
    "password":"your-password",
    "engine":"postgres",
    "host":"your-rds-endpoint",
    "port":5432,
    "dbname":"eventhub"
  }'
\`\`\`

## Step 3: AWS S3 for Images

\`\`\`bash
# Create bucket
aws s3 mb s3://eventhub-images-prod

# Enable CORS
cat > cors.json << EOF
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
EOF

aws s3api put-bucket-cors --bucket eventhub-images-prod --cors-configuration file://cors.json
\`\`\`

## Step 4: AWS Cognito Setup

\`\`\`bash
# Create User Pool
aws cognito-idp create-user-pool --pool-name EventHubPool

# Create User Pool Client
aws cognito-idp create-user-pool-client \
  --user-pool-id <pool-id> \
  --client-name EventHubWeb
\`\`\`

## Step 5: Backend Deployment (Elastic Beanstalk)

\`\`\`bash
# Initialize EB
eb init -p "Node.js 18" eventhub --region us-east-1

# Create environment
eb create eventhub-env

# Deploy
eb deploy

# Set environment variables
eb setenv \
  DATABASE_URL="postgresql://..." \
  JWT_SECRET="your-secret" \
  AWS_BUCKET="eventhub-images-prod"
\`\`\`

## Step 6: Frontend Deployment

### Option A: Vercel (Recommended)
\`\`\`bash
vercel
\`\`\`

### Option B: AWS Amplify
\`\`\`bash
npm install -g @aws-amplify/cli
amplify init
amplify publish
\`\`\`

## Environment Variables

Create `.env.local`:

\`\`\`
# Database
DATABASE_URL=postgresql://user:pass@host:5432/eventhub

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET=eventhub-images-prod
AWS_REGION=us-east-1

# AWS Cognito
COGNITO_USER_POOL_ID=your-pool-id
COGNITO_CLIENT_ID=your-client-id
COGNITO_REGION=us-east-1

# AWS SES
SES_EMAIL=noreply@eventhub.com

# API
NEXT_PUBLIC_API_URL=https://api.eventhub.com
\`\`\`

## Monitoring & Logging

\`\`\`bash
# View CloudWatch logs
aws logs tail /aws/elasticbeanstalk/eventhub-env --follow

# Create CloudWatch alarm
aws cloudwatch put-metric-alarm \
  --alarm-name eventhub-error-rate \
  --metric-name 5XXError \
  --threshold 10 \
  --evaluation-periods 1
\`\`\`

## Scaling Configuration

Update `.ebextensions/scaling.config`:

\`\`\`yaml
option_settings:
  aws:elasticbeanstalk:environment:process:default:
    MaxSize: 4
    MinSize: 1
    SurgeCapacity: 2
    HealthyThreshold: 3
    UnhealthyThreshold: 2
\`\`\`

## Backup Strategy

\`\`\`bash
# Enable automated backups for RDS
aws rds modify-db-instance \
  --db-instance-identifier eventhub \
  --backup-retention-period 7
\`\`\`

## Troubleshooting

### Database Connection Issues
\`\`\`bash
# Test connection
psql -h <endpoint> -U admin -d eventhub -c "SELECT 1;"
\`\`\`

### S3 Upload Issues
- Check IAM permissions
- Verify CORS configuration
- Check bucket policies

### Cognito Integration
- Verify User Pool ID and Client ID
- Check callback URLs
- Enable hosted UI if needed
