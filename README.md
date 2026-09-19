# 📋 DocApproval — Serverless Document Approval System

**DocApproval** is a cloud-native, fully serverless application for uploading and approving internal documents. Employees upload files for review; admins approve or reject them with a single click. Built entirely on AWS — Amazon Cognito for role-based authentication, API Gateway + Lambda for backend processing, S3 + DynamoDB for storage, SNS for instant email notifications, and Textract for automatic text extraction — **with zero traditional servers or EC2**.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Architecture](#️-architecture)
- [Screenshots](#️-screenshots)
- [Features](#-features)
- [AWS Services](#️-aws-services-used)
- [Project Structure](#-project-structure)
- [Deployment Steps](#-deployment-steps)
- [Testing](#-testing)
- [Troubleshooting](#️-troubleshooting)
- [Cost Estimate](#-cost-estimate)
- [Cleanup](#-cleanup)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## 🎯 Overview

DocApproval is a production-style serverless workflow tool built entirely on AWS. Every document goes through a clear lifecycle: **uploaded** by an employee, **reviewed** by an admin, and **resolved** as approved or rejected — with the employee notified by email and able to track the status at any time.

Role-based access is enforced end-to-end using Cognito groups and JWT authorization, so employees and admins each see only the screen relevant to them. 🔐

---

## 🏗️ Architecture

<p align="center">
  <img src="ScreenShots/docapproval-architecture.png" alt="DocApproval Architecture" width="750">
</p>

The application follows a fully serverless request flow:

1. 🔑 The user (**Admin** or **Employee**) signs in through the Cognito Hosted UI.
2. 🪪 Cognito issues a JWT (`id_token`) that carries the user's group — `Admin` or `Employee`.
3. ⚛️ The React frontend reads the group from the token and renders the matching view.
4. 🌐 All requests go through **API Gateway**, where a JWT Authorizer validates the token before forwarding the request.
5. ⚙️ API Gateway routes each request to the matching Lambda function:
   - `upload-handler` — saves a new document to S3 and creates its record in DynamoDB
   - `list-handler` — returns all pending documents to the Admin, with a presigned preview URL for each
   - `decide-handler` — approves or rejects a document, moves the file in S3, updates DynamoDB, and publishes to SNS
   - `my-documents-handler` — returns an Employee's own documents with their current status
6. 📄 Uploading a file to S3 automatically triggers `textract-handler`, which extracts the text content of the document.
7. 📧 SNS sends an instant email to the employee once their document is approved or rejected.

---

## 🖼️ Screenshots

**1. Sign in with Cognito**
<p align="center">
  <img src="ScreenShots/cognito-hosted-ui-email.png" alt="Cognito Hosted UI" width="700">
</p>

**2. Admin reviews pending documents**
<p align="center">
  <img src="ScreenShots/admin-pending-documents-list.png" alt="Admin — Pending Documents" width="700">
</p>

**3. Employee tracks the decision**
<p align="center">
  <img src="ScreenShots/employee-my-documents-approved-rejected.png" alt="Employee — My Documents" width="700">
</p>

---

## ✨ Features

- 🔐 Role-based access control via Cognito groups (Admin / Employee) — no separate login pages needed
- 📤 Employees upload documents with a title and optional description
- 👀 Admins review all pending documents with a secure, time-limited preview link before deciding
- ✅❌ One-click Approve / Reject, with the file automatically moved to the matching S3 folder
- 📊 Employees can track every document they've submitted and its current status (Pending / Approved / Rejected) from a dedicated tab
- 📧 Instant email notification on every decision via SNS
- 🔎 Automatic text extraction from uploaded documents via Amazon Textract
- 🛡️ Every API route is protected by a JWT Authorizer tied to Cognito

---

## ⚙️ AWS Services Used

| Service | Resource Name | Purpose |
|---|---|---|
| 🔑 Amazon Cognito | User Pool + Hosted UI | Sign-in / sign-out, and Admin / Employee group membership |
| 🌐 Amazon API Gateway | `docapproval-api` (HTTP API) | Exposes `POST /documents`, `GET /documents/pending`, `POST /documents/decide`, `GET /documents/mine` |
| ⚙️ AWS Lambda | `upload-handler`, `list-handler`, `decide-handler`, `my-documents-handler` (Python 3.12) | Upload, review, decide, and track documents |
| ⚙️ AWS Lambda | `textract-handler` (Python 3.12) | Triggered by S3 on upload; extracts text from the document |
| 🗄️ Amazon S3 | `docapproval-serverless` | Stores document files under `pending/`, `approved/`, `rejected/` |
| 🗃️ Amazon DynamoDB | `DocApproval-Documents` | Stores document metadata: title, description, status, S3 key, uploaded by |
| 📧 Amazon SNS | `docapproval-notifications` | Sends an email to the employee when their document is approved or rejected |
| 🔎 Amazon Textract | — | Extracts text content from uploaded documents |
| 🛡️ AWS IAM | `docapproval-lambda-role`, `DocApprovalS3Access` | Grants Lambda functions access to S3 and DynamoDB |

---

## 📁 Project Structure

```
DocApproval/
├── ScreenShots/
│   ├── docapproval-architecture.png
│   ├── cognito-hosted-ui-email.png
│   ├── admin-pending-documents-list.png
│   └── employee-my-documents-approved-rejected.png
├── Frontend/
│   ├── App.js
│   ├── Login.js
│   ├── Upload.js
│   ├── Admin.js
│   ├── MyDocuments.js
│   └── index.css
├── Lambda_Functions/
│   ├── upload-handler/lambda_function.py
│   ├── list-handler/lambda_function.py
│   ├── decide-handler/lambda_function.py
│   ├── my-documents-handler/lambda_function.py
│   └── textract-handler/lambda_function.py
├── public/
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## 🚀 Deployment Steps

### Prerequisites
- An AWS account
- AWS CLI configured (`aws configure`)
- Node.js and npm (for the React frontend)

### 1️⃣ Create the Cognito User Pool
- Create a User Pool with an app client (Hosted UI enabled).
- Create two groups: `Admin` and `Employee`.
- Add the app's URL to both **Allowed callback URLs** and **Allowed sign-out URLs**.

### 2️⃣ Create the DynamoDB table
- Table name: `DocApproval-Documents`
- Partition key: `documentId` (String)

### 3️⃣ Create the S3 bucket
- Bucket name: `docapproval-serverless`
- No public access needed — files are served through presigned URLs.

### 4️⃣ Create the SNS topic
- Topic name: `docapproval-notifications`
- Add an email subscription and confirm it from your inbox.

### 5️⃣ Create the IAM role
- Role name: `docapproval-lambda-role`
- Attach S3 read/write access and basic Lambda execution permissions.

### 6️⃣ Deploy the Lambda functions
- Create `upload-handler`, `list-handler`, `decide-handler`, `my-documents-handler`, and `textract-handler` (Python 3.12), using `docapproval-lambda-role`.
- Add an S3 trigger on the bucket for `textract-handler`.

### 7️⃣ Configure API Gateway
- Create an HTTP API `docapproval-api`.
- Add the four routes listed above, each integrated with its matching Lambda function.
- Attach a JWT Authorizer backed by the Cognito User Pool to every route.
- Enable CORS for your frontend's origin.
- Deploy the API.

### 8️⃣ Configure and run the frontend
- Update `API_URL`, `cognitoDomain`, and `clientId` in `Frontend/App.js` and `Frontend/Admin.js`.
- Run `npm install` then `npm start`.

---

## 🧪 Testing

**Full Flow Checklist**

| Action | Expected Result |
|---|---|
| Sign in as Employee | Upload tab appears |
| Upload a document | Appears under "My Documents" with status **Pending** |
| Sign in as Admin | Document appears under "Pending documents" with a **View file** link |
| Click **Approve** | Document disappears from the pending list; file moves to `approved/` in S3 |
| Click **Reject** | File moves to `rejected/` in S3; status updates in DynamoDB |
| Check employee's email | Notification received via SNS |
| Sign in as Employee again | "My Documents" tab shows the updated status |

---

## 🛠️ Troubleshooting

| Issue | Possible Cause | Fix |
|---|---|---|
| Admin sees `403` on every request | User not added to the `Admin` group in Cognito | Add the user to the group and sign in again to refresh the token |
| "Something went wrong while updating this document" | The document's file doesn't exist in S3 (test/seed data) | Delete stale items from DynamoDB or re-upload a real file |
| Signing out logs the user straight back in | Sign out only cleared local tokens, not the Cognito session | Redirect to Cognito's `/logout` endpoint with `client_id` and `logout_uri`, not just `removeUser()` |
| View file shows `NoSuchKey` | S3 key stored in DynamoDB has no matching object in the bucket | Confirm the file was actually uploaded to S3, not just recorded in DynamoDB |
| `403 Forbidden` on API calls | CORS not enabled, or JWT Authorizer missing on the route | Enable CORS on the API and attach the authorizer to every route, then redeploy |
| No email received after a decision | SNS subscription not confirmed | Check inbox/spam for the confirmation email and confirm it |

---

## 💰 Cost Estimate

| Service | Free Tier Limit | Expected Usage | Cost |
|---|---|---|---|
| Lambda | 1M requests/month | ~500 | $0 |
| API Gateway | 1M requests/month | ~500 | $0 |
| DynamoDB | 25GB + 200M requests | < 1MB | $0 |
| S3 | 5GB storage | < 1MB | $0 |
| SNS | 1,000 emails/month | ~100 | $0 |
| Textract | 1,000 pages/month (first 3 months) | ~50 | $0 |
| Cognito | 50,000 MAUs | A few users | $0 |

**💵 Total estimated monthly cost: $0.00**

---

## 🧹 Cleanup

To avoid any future charges, delete all resources in this order:

1. 🌐 **API Gateway** → Delete `docapproval-api`
2. ⚙️ **Lambda** → Delete all five functions
3. 🗄️ **S3** → Empty the bucket → Delete `docapproval-serverless`
4. 🗃️ **DynamoDB** → Delete `DocApproval-Documents`
5. 📧 **SNS** → Delete subscription → Delete `docapproval-notifications`
6. 🔑 **Cognito** → Delete the User Pool and app client
7. 🛡️ **IAM** → Delete `docapproval-lambda-role` and its attached policy

---

## 🔮 Future Improvements

- [ ] Add a rejection reason field so employees know why a document was rejected
- [ ] Add a CloudWatch dashboard for upload/approval analytics
- [ ] Support multiple approvers per document
- [ ] Add SES so admins can reply to the employee directly from the app
- [ ] Store the extracted Textract text alongside the document for search
- [ ] Add pagination for large document lists

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
