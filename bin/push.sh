#!/bin/bash

version=$(cat ./version)

# 1. enter docker image name
read -r -p "enter your image name: " image_name
echo "$(date +%Y-%m-%d" "%H:%M:%S)" "[enter image name - '$image_name'] - done"

# 2. enter registry domain
read -r -p "enter your registry domain (default to Dockerhub): " domain
echo "$(date +%Y-%m-%d" "%H:%M:%S)" "[enter domain - '$domain'] - done"

# 3. login docker
read -r -p "enter your docker username: " username
read -r -s -p "enter your docker password: " password

docker login -u="$username" -p="$password" "$domain"
echo "$(date +%Y-%m-%d" "%H:%M:%S)" '[login docker hub account] - done'

# 4. build and push docker image
docker buildx build --platform=linux/arm/v7,linux/amd64 --push -t "$image_name" .;
docker buildx build --platform=linux/arm/v7,linux/amd64 --push -t "$image_name":v"$version" .;
echo "$(date +%Y-%m-%d" "%H:%M:%S)" '[build and push image] - done'

# 5. logout docker
docker logout

echo "$(date +%Y-%m-%d" "%H:%M:%S)" '[docker logout] - done'