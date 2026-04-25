#!/usr/bin/env bash
set -euo pipefail
AWS_ACCOUNT_ID="860350045111"
AWS_REGION="us-west-2"
ECR_REPO="ovyu-api"
IMAGE_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:latest"
LAMBDA_FUNCTION="ovyu-api-production"

aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
docker build --platform linux/amd64 -t "$ECR_REPO" .
docker tag "$ECR_REPO:latest" "$IMAGE_URI"
docker push "$IMAGE_URI"
aws lambda update-function-code --function-name "$LAMBDA_FUNCTION" --image-uri "$IMAGE_URI" --region "$AWS_REGION"
aws lambda wait function-updated --function-name "$LAMBDA_FUNCTION" --region "$AWS_REGION"
echo "✓ Deploy complete"
