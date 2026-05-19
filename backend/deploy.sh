#!/usr/bin/env bash
set -euo pipefail

ENV="${1:-production}"   # usage: ./deploy.sh [staging|production]

AWS_PROFILE="ovyu"
AWS_ACCOUNT_ID="860350045111"
AWS_REGION="us-west-2"
S3_BUCKET="ovyu-deployments-${AWS_ACCOUNT_ID}"
PKG_DIR="/tmp/ovyu-lambda-pkg"

export AWS_PROFILE

if [ "$ENV" = "staging" ]; then
  LAMBDA_FUNCTION="ovyu-api-staging"
  S3_KEY="ovyu-api-staging-latest.zip"
else
  LAMBDA_FUNCTION="ovyu-api-production"
  S3_KEY="ovyu-api-latest.zip"
fi

ZIP_FILE="/tmp/ovyu-lambda-${ENV}.zip"

echo "→ Deploying to: $ENV ($LAMBDA_FUNCTION)"

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

echo "→ Updating Lambda ($LAMBDA_FUNCTION)..."
aws lambda update-function-code \
  --function-name "$LAMBDA_FUNCTION" \
  --s3-bucket "$S3_BUCKET" \
  --s3-key "$S3_KEY" \
  --region "$AWS_REGION"
aws lambda wait function-updated --function-name "$LAMBDA_FUNCTION" --region "$AWS_REGION"

echo "✓ Deploy complete → $ENV"
