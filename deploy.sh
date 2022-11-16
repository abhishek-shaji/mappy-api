#!/usr/bin/env bash
docker build -t mappy-api-image . &&
docker tag mappy-api-image:latest 764061193499.dkr.ecr.eu-west-2.amazonaws.com/mappy-api:latest &&
ACCOUNT_ID=$(aws sts get-caller-identity --profile mappy | jq -r ".Account") &&
aws ecr get-login-password --region eu-west-2 --profile mappy | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.eu-west-2.amazonaws.com" &&
docker push 764061193499.dkr.ecr.eu-west-2.amazonaws.com/mappy-api:latest &&
cd infrastructure || exit &&
eb deploy mappy-api-prod