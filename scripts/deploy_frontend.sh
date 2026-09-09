#!/bin/bash

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

BRANCH_PATH="$(dirname "$0")/../branch.txt"

if [ -f "$BRANCH_PATH" ]; then
  BRANCH_NAME=$(cat "$BRANCH_PATH")
  echo "Detected branch from $BRANCH_PATH: $BRANCH_NAME"
else
  echo "$BRANCH_PATH not found. Defaulting to dev"
  BRANCH_NAME="dev"
fi

if [ "$BRANCH_NAME" = "master" ]; then
  IMAGE_NAME="react-app"
  CONTAINER_NAME="react-app"
  s3_BUCKET_PATH="s3://ri8fit-dev-artifacts/frontend/.env"
else
  IMAGE_NAME="react-app-dev"
  CONTAINER_NAME="react-app-dev"
  s3_BUCKET_PATH="s3://ri8fit-dev-artifacts/frontend-dev/.env"
fi

echo "Deploying for branch: $BRANCH_NAME"
echo "Using image: $IMAGE_NAME"

# Pull and deploy the Docker image
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com


if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "Stopping and removing the existing container..."
  docker stop "$CONTAINER_NAME"
  docker rm "$CONTAINER_NAME"
  docker rmi -f $(docker images -q "$ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/$IMAGE_NAME:latest") || true
  docker pull $ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/$IMAGE_NAME:latest
  aws s3 cp $s3_BUCKET_PATH /home/ubuntu
  ls -al /home/ubuntu
else
  echo "No existing container named '$CONTAINER_NAME' found. Skipping removal."
fi
docker run -d -p 3000:3000 --env-file /home/ubuntu/.env --name "$CONTAINER_NAME" $ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/$IMAGE_NAME:latest
