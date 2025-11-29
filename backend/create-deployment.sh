#!/bin/bash

# Create deployment package for Elastic Beanstalk

echo "Creating deployment package..."

# Create deploy directory
mkdir -p deploy

# Copy JAR file
cp target/convene-api-0.0.1-SNAPSHOT.jar deploy/

# Copy Procfile
cp Procfile deploy/

# Copy .ebextensions folder
cp -r .ebextensions deploy/

# Create ZIP file (using Python zipfile if zip command not available)
if command -v zip &> /dev/null; then
    cd deploy
    zip -r ../convene-api-deploy.zip .
    cd ..
else
    # Use Python to create ZIP
    python3 -c "
import zipfile
import os
from pathlib import Path

with zipfile.ZipFile('convene-api-deploy.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk('deploy'):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, 'deploy')
            zipf.write(file_path, arcname)
"
fi

echo "Deployment package created: convene-api-deploy.zip"
echo ""
echo "Files included:"
ls -lh deploy/
echo ""
echo "To deploy:"
echo "1. Upload convene-api-deploy.zip to Elastic Beanstalk"
echo "2. Or use: eb deploy (if using EB CLI)"

