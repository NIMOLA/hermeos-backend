#!/bin/bash

# VPS Setup Script for Hermeos Proptech (Ubuntu)

# 1. Update system
sudo apt-get update
sudo apt-get upgrade -y

# 2. Install Docker
sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 3. Setup folders
mkdir -p ~/hermeos/backend
mkdir -p ~/hermeos/nginx

# 4. Install Nginx
sudo apt-get install -y nginx

# 5. Setup SSL (Certbot)
sudo apt-get install -y certbot python3-certbot-nginx

echo "VPS Environment Ready!"
echo "Next step: Copy your backend code to ~/hermeos/backend and run 'docker compose up -d'"
