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

DocApproval is a cloud-native, fully serverless application for uploading and approving internal documents. Employees upload files for review, while administrators can securely review, approve, or reject them with a single click.

The system uses **Amazon Cognito**, **API Gateway**, **AWS Lambda**, **Amazon S3**, **DynamoDB**, **SNS**, and **Amazon Textract** — with no traditional servers or EC2 instances.

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

**DocApproval** is a production-style serverless document approval workflow built entirely on **Amazon Web Services (AWS)**.

The platform provides a secure and simple workflow where:

- 👨‍💻 Employees upload documents for review.
- 👨‍💼 Administrators review pending documents.
- ✅ Administrators can approve documents.
- ❌ Administrators can reject documents.
- 📧 Employees receive email notifications about decisions.
- 📊 Employees can track the status of their submitted documents.
- 📄 Amazon Textract automatically extracts text from uploaded documents.

Role-based access is enforced end-to-end using **Amazon Cognito Groups** and **JWT authorization**, ensuring that employees and administrators only access the functionality appropriate for their role.

---

## 🏗️ Architecture

<p align="center">
  <img src="./ScreenShots/docapproval-architecture.png"
       alt="DocApproval AWS Architecture"
       width="900">
</p>

The application follows a fully serverless request flow:

1. 🔐 The user (**Admin** or **Employee**) signs in through the **Amazon Cognito Hosted UI**.
2. 🎫 Cognito issues a JWT (`id_token`) containing the user's group — `Admin` or `Employee`.
3. ⚛️ The React frontend reads the user's group from the token and renders the matching interface.
4. 🌐 All application requests are sent through **Amazon API Gateway**.
5. 🛡️ A JWT Authorizer validates the user's token before forwarding the request.
6. ⚡ API Gateway routes each request to the matching AWS Lambda function:
   - `upload-handler` — saves a new document to S3 and creates its record in DynamoDB.
   - `list-handler` — returns pending documents to the Admin with a presigned preview URL.
   - `decide-handler` — approves or rejects a document, moves the file in S3, updates DynamoDB, and publishes a notification to SNS.
   - `my-documents-handler` — returns an Employee's submitted documents with their current status.
7. ☁️ Uploading a file to S3 automatically triggers `textract-handler`.
8. 📄 Amazon Textract extracts the text content from the uploaded document.
9. 📧 Amazon SNS sends an instant email notification to the employee once their document is approved or rejected.

---

## 🖼️ Screenshots

### 🔐 1. Sign in with Amazon Cognito

<p align="center">
  <img src="./ScreenShots/cognito-hosted-ui-email.png"
       alt="Cognito Hosted UI"
       width="650">
</p>

Users authenticate securely through the **Amazon Cognito Hosted UI**.

---

### 👨‍💼 2. Admin — Pending Documents

<p align="center">
  <img src="./ScreenShots/admin-pending-documents-list.png"
       alt="Admin Pending Documents"
       width="850">
</p>

Administrators can view all pending documents and securely preview uploaded files using time-limited presigned URLs.

Administrators can then:

- 👁️ View the uploaded document.
- ✅ Approve the document.
- ❌ Reject the document.

---

### 👨‍💻 3. Employee — My Documents

<p align="center">
  <img src="./ScreenShots/employee-my-documents-approved-rejected.png"
       alt="Employee My Documents"
       width="850">
</p>

Employees can track all documents they have submitted and view their current status.

Possible statuses include:

- 🟡 `Pending`
- 🟢 `Approved`
- 🔴 `Rejected`

---

## ✨ Features

### 🔐 Role-Based Authentication & Authorization

- Authentication through **Amazon Cognito Hosted UI**.
- Role-based access using Cognito Groups.
- Supported roles:
  - 👨‍💼 `Admin`
  - 👨‍💻 `Employee`
- JWT-based authorization.
- Protected API routes through API Gateway.
- Each role receives access only to the appropriate application functionality.

### 📤 Employee Document Upload

Employees can:

- Upload internal documents.
- Add a document title.
- Add an optional description.
- Submit files for administrative review.

Uploaded files are securely stored in Amazon S3, while their metadata is stored in DynamoDB.

Newly uploaded documents automatically receive a:

```text
Pending
