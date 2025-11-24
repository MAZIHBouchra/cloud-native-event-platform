# AWS S3 Integration Setup Guide

This guide explains how to set up and use AWS S3 for storing event images in the Convene platform.

## Architecture Overview

- **Storage**: AWS S3 for image storage
- **CDN**: AWS CloudFront (optional, for better performance)
- **Backend**: Spring Boot service with AWS SDK
- **Security**: IAM roles (recommended) or access keys

## Prerequisites

1. AWS Account
2. AWS CLI installed and configured (optional)
3. S3 bucket created

## Step 1: Create S3 Bucket

### Using AWS Console:
1. Go to S3 in AWS Console
2. Click "Create bucket"
3. Bucket name: `adrayApp-images-bucket` (or your preferred name)
4. Region: Choose your region (e.g., `us-east-1`)
5. **Block Public Access Settings**:
   - **Uncheck "Block all public access"** (or uncheck only the settings you need)
   - **Recommended**: Uncheck only "Block public access to buckets and objects granted through any public bucket or access point policies"
   - Check the acknowledgment checkbox
   - This allows public read access via bucket policy (which we'll set up next)
6. Click "Create bucket"

**Important**: We'll use a bucket policy (not ACLs) for public access, which is more secure and easier to manage.

### Using AWS CLI:
```bash
aws s3 mb s3://adrayapp-images-bucket --region us-east-1
```

## Step 2: Configure Bucket Policy (Public Read Access)

After creating the bucket, configure the bucket policy for public read access:

1. Go to your bucket in S3 Console
2. Click on the **"Permissions"** tab
3. Scroll down to **"Bucket policy"**
4. Click **"Edit"** and paste this policy (replace `convene-event-images` with your bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::adrayapp-images-bucket/*"
    }
  ]
}
```

5. Click **"Save changes"**

**What this does**: Allows anyone to read (view) images from your bucket, but only your backend (with proper credentials) can upload/delete.

**Security Note**: 
- ✅ **Safe**: Public read access for images is fine for event photos
- ✅ **Secure**: Write access remains private (only your backend can upload)
- 🔒 **Better Option**: For production, consider CloudFront with signed URLs for additional security

## Step 3: Enable CORS (if uploading from browser)

Add CORS configuration to your bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

## Step 4: Configure AWS Credentials

### Option A: Environment Variables (Development)
```bash
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_REGION=us-east-1
```

### Option B: Application Properties (Development)
Add to `application.properties`:
```properties
aws.s3.bucket-name=convene-event-images
aws.s3.region=us-east-1
aws.s3.access-key=your-access-key
aws.s3.secret-key=your-secret-key
aws.s3.cloudfront-url=https://your-cloudfront-url.cloudfront.net
```

### Option C: IAM Role (Production - Recommended)
When deploying to AWS (EC2, Elastic Beanstalk, ECS), use IAM roles instead of access keys:
1. Create an IAM role with S3 permissions
2. Attach the role to your EC2 instance or service
3. Remove access-key and secret-key from configuration
4. The SDK will automatically use the IAM role credentials

## Step 5: IAM Permissions

The IAM user/role needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::convene-event-images/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::convene-event-images"
    }
  ]
}
```

## Step 6: Optional - Set Up CloudFront

For better performance and CDN capabilities:

1. Create a CloudFront distribution
2. Origin: Your S3 bucket
3. Set `aws.s3.cloudfront-url` in application.properties
4. Images will be served via CloudFront URL instead of S3 URL

## API Usage

### Upload Image Endpoint

**POST** `/api/images/upload`

**Request:**
- Content-Type: `multipart/form-data`
- Parameters:
  - `file`: Image file (required)
  - `folder`: Folder name in S3 (optional, default: "events")

**Response:**
```json
{
  "url": "https://convene-event-images.s3.us-east-1.amazonaws.com/events/uuid.jpg",
  "message": "Image uploaded successfully"
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:8080/api/images/upload \
  -F "file=@event-image.jpg" \
  -F "folder=events"
```

**Example using JavaScript (Frontend):**
```javascript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('folder', 'events');

const response = await fetch('/api/images/upload', {
  method: 'POST',
  body: formData
});

const data = await response.json();
const imageUrl = data.url;
```

## Integration with Event Creation

When creating an event:

1. Upload image first using `/api/images/upload`
2. Get the image URL from response
3. Include the URL in the event creation request

## File Validation

- **Allowed types**: Images only (image/*)
- **Max file size**: 5MB
- **Supported formats**: JPEG, PNG, GIF, WebP

## Security Best Practices

1. **Use IAM Roles** instead of access keys in production
2. **Enable CloudFront** with signed URLs for private images
3. **Validate file types** on both client and server
4. **Set file size limits** (currently 5MB)
5. **Use bucket policies** to restrict access
6. **Enable S3 versioning** for backup/recovery
7. **Enable S3 lifecycle policies** to archive old images

## Troubleshooting

### Error: "S3 client is not configured"
- Check that AWS credentials are set
- Verify `aws.s3.access-key` and `aws.s3.secret-key` in application.properties
- Or ensure IAM role is attached (for AWS deployments)

### Error: "Access Denied"
- Check IAM permissions
- Verify bucket policy allows public read (if needed)
- Check bucket region matches configuration

### Images not loading
- Verify bucket policy allows public read
- Check CORS configuration if uploading from browser
- Verify CloudFront distribution is active (if using CloudFront)

## Cost Optimization

- Use S3 Intelligent-Tiering for automatic cost optimization
- Set up lifecycle policies to move old images to Glacier
- Use CloudFront caching to reduce S3 requests
- Enable S3 Transfer Acceleration for faster uploads (optional)

