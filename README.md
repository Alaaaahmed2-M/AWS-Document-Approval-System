# 📋 DocApproval — Serverless Document Approval System
======================================================

<p align="center">
  <img src="https://img.shields.io/badge/AWS-Serverless-orange?style=for-the-badge&logo=amazonaws&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
  <img src="https://img.shields.io/badge/Amazon-Cognito-orange?style=for-the-badge&logo=amazonaws&logoColor=white"/>
  <img src="https://img.shields.io/badge/Serverless-100%25-black?style=for-the-badge&logo=serverless&logoColor=white"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge"/>
</p>

<p align="center">
  <strong>A fully serverless AWS document approval workflow with secure authentication, role-based access control, automated notifications, and intelligent text extraction.</strong>
</p>

DocApproval is a cloud-native, fully serverless application for uploading and approving internal documents. Employees upload files for review, while administrators can securely review, approve, or reject them with a single click.

It uses **Amazon Cognito**, **API Gateway**, **AWS Lambda**, **Amazon S3**, **DynamoDB**, **SNS**, and **Amazon Textract** — with no traditional servers or EC2 instances.

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

## 🎯 Overview

**DocApproval** is a production-style serverless document approval system built entirely on **Amazon Web Services (AWS)**.

The platform provides a secure document workflow where:

- 👨‍💻 Employees upload internal documents for review.
- 👨‍💼 Administrators review pending documents.
- 👁️ Administrators securely preview uploaded files.
- ✅ Administrators can approve documents.
- ❌ Administrators can reject documents.
- 📧 Employees receive email notifications about decisions.
- 📊 Employees can track the status of their submitted documents.
- 📄 Amazon Textract automatically extracts text from uploaded documents.

Every document follows a clear lifecycle:

```text
📤 Employee Upload
        │
        ▼
   🟡 Pending
        │
        ├──────────────► ✅ Approved
        │
        └──────────────► ❌ Rejected
