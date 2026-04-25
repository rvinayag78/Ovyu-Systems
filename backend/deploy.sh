#!/usr/bin/env bash
set -euo pipefail
AWS_ACCOUNT_ID="860350045111"
AWS_REGION="us-west-2"
LAMBDA_FUNCTION="ovyu-api-production"
S3_BUCKET="ovyu-deployments-${AWS_ACCOUNT_ID}"
S3_KEY="ovyu-api-latest.zip"
PKG_DIR="/tmp/ovyu-lambda-pkg"
ZIP_FILE="/tmp/ovyu-lambda.zip"

echo "→ Installing dependencies for linux/x86_64..."
rm -rf "$PKG_DIR" "$ZIP_FILE"
mkdir -p "$PKG_DIR"
pip3 install \
  --upgrade \
  --platform manylinux2014_x86_64 \
  --target "$PKG_DIR" \
  --implementation cp \
  --python-version 3.12 \
  --only-binary=:all: \
  -r requirements-lambda.txt

echo "→ Packaging app..."
cp -r app "$PKG_DIR/"
cd "$PKG_DIR" && zip -r "$ZIP_FILE" . -q && cd -

echo "→ Uploading to S3..."
aws s3 cp "$ZIP_FILE" "s3://${S3_BUCKET}/${S3_KEY}" --region "$AWS_REGION"

echo "→ Updating Lambda..."
aws lambda update-function-code \
  --function-name "$LAMBDA_FUNCTION" \
  --s3-bucket "$S3_BUCKET" \
  --s3-key "$S3_KEY" \
  --region "$AWS_REGION"
aws lambda wait function-updated --function-name "$LAMBDA_FUNCTION" --region "$AWS_REGION"

echo "✓ Deploy complete"
