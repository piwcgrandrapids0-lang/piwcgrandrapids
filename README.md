# PIWC Grand Rapids Church Website

A complete, modern church website for **The Church of Pentecost, PIWC Grand Rapids** (Detroit District). Built with React, Node.js, AI-powered chatbot, and designed for Azure deployment.

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Quick Start](#-quick-start)
4. [Documentation](#-documentation)
5. [Church Information](#-church-information)
6. [Project Structure](#-project-structure)
7. [Deployment](#-deployment)
8. [Adding Collaborators](#-adding-collaborators-to-the-repository)
9. [Support](#-support)

---

## 🌟 Features

### Frontend Features
- ✅ **Modern, Responsive Design** - Works beautifully on all devices
- ✅ **15 Complete Pages** - Home, I'm New, About, Beliefs, Mission & Vision, Leadership, Ministries, Watch, Gallery, Events, Give, Contact, Location & Times, Login, Admin Dashboard
- ✅ **Dark/Light Mode** - Toggle with smooth transitions
- ✅ **AI-Powered Chatbot** - Gemini API integration with 50+ pre-loaded FAQs
- ✅ **Photo Gallery** - Display 18 beautiful images from services and events with 7 category filters
- ✅ **Admin Dashboard** - Content management for authorized users
- ✅ **Contact Forms** - Email notifications with professional HTML templates
- ✅ **Sermon & Events** - Display and manage church content

### Backend Features
- ✅ **RESTful API** - Express.js backend with organized routes
- ✅ **JWT Authentication** - Secure admin access
- ✅ **Email Service** - Nodemailer for contact form notifications
- ✅ **AI Chatbot** - Gemini AI with comprehensive knowledge base
- ✅ **Church Info Utilities** - Centralized church data management

### Key Highlights
- 🎨 **Church Colors** - Blue (#003366), Yellow (#FFD700), White
- 📱 **Mobile-First** - Optimized for all screen sizes
- 🤖 **Smart Chatbot** - Pre-loaded with church-specific answers
- 🔒 **Secure** - JWT authentication, protected routes
- ☁️ **Azure-Ready** - Full deployment configuration included
- 📧 **Email Notifications** - Automatic emails for contact forms
- 🌗 **Theme Toggle** - Dark/light mode with localStorage persistence

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management (Auth, Theme)
- **CSS3** - Custom styling with CSS variables

### Backend
- **Node.js 18+** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Gemini AI API** - Chatbot intelligence
- **Nodemailer** - Email service
- **CORS** - Cross-origin resource sharing

### Deployment
- **Azure Static Web Apps** - Frontend hosting
- **Azure App Service** - Backend hosting
- **Azure Cosmos DB** - Database (production)
- **Azure Blob Storage** - Media storage (production)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Azure account (for deployment)
- Gemini API key (for chatbot)

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment

Create `.env` file in `backend/` directory:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Gemini API Configuration
GEMINI_API_KEY=your-gemini-api-key-here

# Email Configuration (for contact form)
SMTP_SERVICE=gmail
SMTP_USER=piwcgrandrapids0@gmail.com
SMTP_PASS=your-app-password-here

# Church Information
CHURCH_EMAIL=piwcgrandrapids0@gmail.com
CHURCH_PHONE=(616) 123-4567

# Azure Configuration (for production)
AZURE_STORAGE_CONNECTION_STRING=your-azure-storage-connection-string
AZURE_COSMOS_DB_ENDPOINT=your-cosmos-db-endpoint
AZURE_COSMOS_DB_KEY=your-cosmos-db-key
```

### Step 3: Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Server runs on http://localhost:5001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# App opens at http://localhost:3000
```

### Step 4: Access the Website

- **Website**: http://localhost:3000
- **API Health Check**: http://localhost:5001/api/health
- **Admin Login**: 
  - Email: `check Google doc`
  - Password: `check Google doc`
  - **⚠️ Change these in production!**

---

## 📚 Documentation

Complete guides for setup, deployment, and administration:

| Guide | Description |
|-------|-------------|
| **[SETUP.md](SETUP.md)** | Local development setup and configuration |
| **[AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md)** | Complete Azure deployment guide |
| **[ADMIN_GUIDE.md](ADMIN_GUIDE.md)** | Admin dashboard features and usage |
| **README.md** | This file - project overview |

**Quick Links:**
- 🚀 [Local Setup](SETUP.md) - Get started in 5 minutes
- ☁️ [Deploy to Azure](AZURE_DEPLOYMENT.md) - Production hosting
- 🔧 [Admin Features](ADMIN_GUIDE.md) - Manage your website

---

## ⛪ Church Information

All church information is centralized in `backend/utils/churchInfo.js`. Update once and changes propagate throughout the entire website!

**Current Details:**
- **Name**: The Church of Pentecost USA, Inc. - PIWC Grand Rapids
- **Address**: 7003 28th Ave, Hudsonville, MI 49426
- **Phone**: (616) 123-4567
- **Email**: piwcgrandrapids0@gmail.com
- **Service Times**: Sunday 12:30 PM, Friday 7:00 PM (Online)

**To Update**: Edit `backend/utils/churchInfo.js` and changes will automatically update across:
- Chatbot responses
- Footer, Contact page, Location & Times
- API endpoints

**For detailed customization**: See [SETUP.md](SETUP.md)

---

## 📁 Project Structure

```
piwcgrandrapids/
├── frontend/                    # React application
│   ├── public/                  # Static files
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── logo.png
│   ├── src/
│   │   ├── assets/
│   │   │   └── images/         # Logo and images
│   │   ├── components/
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   ├── Chatbot/        # AI chatbot
│   │   │   ├── ThemeToggle/    # Dark/light mode toggle
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   ├── AuthContext.js  # Authentication state
│   │   │   └── ThemeContext.js # Theme state
│   │   ├── pages/              # All page components
│   │   │   ├── Home.js
│   │   │   ├── ImNew.js
│   │   │   ├── AboutUs.js
│   │   │   ├── OurBeliefs.js
│   │   │   ├── MissionVision.js
│   │   │   ├── Leadership.js
│   │   │   ├── Ministries.js
│   │   │   ├── Watch.js
│   │   │   ├── Gallery.js
│   │   │   ├── Events.js
│   │   │   ├── Give.js
│   │   │   ├── Contact.js
│   │   │   ├── LocationTimes.js
│   │   │   ├── Login.js
│   │   │   └── AdminDashboard.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
├── backend/                     # Express API server
│   ├── middleware/
│   │   └── auth.js             # JWT authentication
│   ├── routes/
│   │   ├── auth.js             # Login/verify
│   │   ├── chatbot.js          # AI chatbot
│   │   ├── contact.js          # Contact forms
│   │   ├── prayers.js          # Prayer requests
│   │   ├── sermons.js          # Sermon CRUD
│   │   ├── events.js           # Event CRUD
│   │   └── gallery.js          # Photo gallery & uploads
│   ├── utils/
│   │   ├── churchInfo.js       # Central church data
│   │   ├── chatbotKnowledge.js # FAQ library
│   │   ├── visitorHelper.js    # Visitor assistance
│   │   └── emailService.js     # Email functionality
│   ├── server.js
│   ├── env.example.txt
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Deployment

### Azure Deployment (Recommended)

This project is configured for Microsoft Azure with:
- ✅ **Frontend**: Azure Static Web Apps
- ✅ **Backend**: Azure App Service
- ✅ **Storage**: Azure Blob Storage for images
- ✅ **Cost**: ~$15-$25/month

**📖 Complete Deployment Guide**: See [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md)

#### Quick Start

1. **Install Azure CLI**:
   ```bash
   # macOS
   brew install azure-cli
   
   # Windows: Download from https://aka.ms/installazurecliwindows
   ```

2. **Login to Azure**:
   ```bash
   az login
   ```

3. **Run Deployment Script**:
   ```bash
   # See AZURE_DEPLOYMENT.md for complete deployment commands
   # Includes: Resource Group, Storage Account, App Service, Static Web App
   ```

4. **Configure Environment Variables**:
   - Set Azure Storage connection string
   - Configure SMTP for emails
   - Add Gemini API key
   - See `.env.example` for all required variables

**Full step-by-step instructions**: [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md)

### Cost Estimate (Azure)

| Service | Monthly Cost |
|---------|-------------|
| Static Web Apps (Free Tier) | $0 |
| App Service (B1) | $13 |
| Blob Storage | $1-$5 |
| Bandwidth | $0-$5 |
| **Total** | **~$15-$25/month** |

---

## 🤝 Adding Collaborators to the Repository

To allow team members to **pull and push** to this repository, the repository owner needs to add them as collaborators:

### For Repository Owners/Admins

1. **Navigate to Repository Settings**
   - Go to: https://github.com/piwcgrandrapids0-lang/piwcgrandrapids
   - Click **Settings** (gear icon) at the top-right
   - ⚠️ *Note: You must be the owner or have admin permissions to see this option*

2. **Access Collaborators Section**
   - In the left sidebar, click **Collaborators and teams**
   - You may be prompted to enter your GitHub password for security

3. **Add New Collaborator**
   - Click the **Add people** button (green button)
   - Enter the person's GitHub username or email address
   - Click **Add [username] to this repository**

4. **Set Permissions**
   - **Read**: View and clone only (cannot push)
   - **Write**: Can pull, push, and manage issues ✅ **Recommended for contributors**
   - **Admin**: Full access including settings (use carefully)

5. **Send Invitation**
   - Click **Add [username] to piwcgrandrapids**
   - GitHub will send an email invitation
   - The invitation will also appear in their GitHub notifications

### For New Collaborators

When you receive a collaboration invitation:

1. **Accept the Invitation**
   - Check your email for: *"[username] has invited you to collaborate on the piwcgrandrapids repository"*
   - Click **View invitation** → **Accept invitation**
   - OR go to https://github.com/notifications and accept from there

2. **Verify Access**
   - Go to the repository: https://github.com/piwcgrandrapids0-lang/piwcgrandrapids
   - You should now be able to clone, pull, and push

3. **Clone and Start Contributing**
   ```bash
   git clone https://github.com/piwcgrandrapids0-lang/piwcgrandrapids.git
   cd piwcgrandrapids
   ```

You're now ready to contribute! See [Quick Start](#-quick-start) for setup instructions.

---

## 📄 License

This project is licensed under the terms specified in the LICENSE file.

---

## 📞 Support

For issues or questions:

**Email:** piwcgrandrapids0@gmail.com  
**Phone:** (616) 123-4567  
**Instagram:** [@piwc_grandrapids](https://www.instagram.com/piwc_grandrapids/)  
**Facebook:** [PIWC Grand Rapids](https://www.facebook.com/thechurchofpentecostgrandrapids)

---

**Built with ❤️ for PIWC Grand Rapids**  
*The Church of Pentecost USA, Inc. - Detroit District*

**Last Updated**: November 11, 2025 | **Version**: 1.0.0
