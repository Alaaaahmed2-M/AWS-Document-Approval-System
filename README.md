# 📋 DocApproval — Serverless Document Approval System
======================================================

<p align="center">
  <img src="https://img.shields.io/badge/AWS-Serverless-orange?style=for-the-badge&logo=amazonaws&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
  <img src="https://img.shields.io/badge/Amazon-Cognito-orange?style=for-the-badge&logo=amazonaws&logoColor=white"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge"/>
</p>

<p align="center">
  <strong>A fully serverless AWS document approval workflow with secure authentication, role-based access control, automated notifications, and intelligent text extraction.</strong>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#️-architecture)
- [Screenshots](#️-screenshots)
- [Features](#-features)
- [AWS Services](#️-aws-services-used)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Deployment Steps](#-deployment-steps)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Cost Estimate](#-cost-estimate)
- [Cleanup](#-cleanup)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## 🎯 Overview

**DocApproval** is a cloud-native, fully serverless document approval system built entirely on **Amazon Web Services (AWS)**.

The platform allows employees to upload internal documents for review while administrators can securely review, approve, or reject submitted files.

Every document follows a clear workflow:

```text
Employee
   │
   ▼
🔐 Amazon Cognito
   │
   ▼
⚛️ React Frontend
   │
   ▼
🌐 API Gateway
   │
   ▼
⚡ AWS Lambda
   │
   ├──────────────► ☁️ Amazon S3
   │
   ├──────────────► 🗄️ DynamoDB
   │
   └──────────────► 📧 Amazon SNS
                          │
                          ▼
                    Employee Email

☁️ S3 Upload
   │
   ▼
📄 Amazon Textract
   │
   ▼
📝 Automatic Text Extraction
