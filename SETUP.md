# PIWC Grand Rapids Website - Setup Guide

**The Church of Pentecost - Grand Rapids, Michigan**

🎉 Welcome! the complete church website is ready to launch!

---

## 📋 What's Included

✅ Complete React frontend with 14 pages  
✅ Node.js/Express backend with RESTful API  
✅ AI-powered chatbot with Gemini integration  
✅ Admin dashboard for content management  
✅ JWT authentication system  
✅ Email contact form with notifications  
✅ Photo gallery management  
✅ Responsive design for all devices  
✅ Azure deployment configuration  

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

Open Terminal/Command Prompt:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment Variables

Create a file named `.env` in the **backend** folder:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this

# AI Chatbot (Required for chatbot to work)
GEMINI_API_KEY=your-gemini-api-key-here

# Email Configuration (Optional - for contact form)
SMTP_SERVICE=gmail
SMTP_USER=piwcgrandrapids0@gmail.com
SMTP_PASS=your-gmail-app-password

# Church Information
CHURCH_EMAIL=piwcgrandrapids0@gmail.com
CHURCH_PHONE=(616) 123-4567
```

### Step 3: Start the Servers

**Open TWO terminal windows:**

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
You should see: `✅ Server running on port 5001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Your browser should automatically open to `http://localhost:3000`

### Step 4: Access the Website

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001/api/health
- **Admin Dashboard**: http://localhost:3000/login

**Default Admin Credentials:**
- Username: `check Google doc`
- Password: `check Google doc`

⚠️ **IMPORTANT:** Change these credentials before deploying to production!

---

## 📄 Available Pages

### Public Pages
- `/` - Home page with hero section
- `/im-new` - First-time visitor information
- `/about` - Church history and values
- `/beliefs` - Statement of faith
- `/mission-vision` - Church mission and goals
- `/leadership` - Meet the pastoral team
- `/ministries` - Ministry programs
- `/watch` - Sermon video archive
- `/gallery` - Photo gallery with categories
- `/events` - Church calendar
- `/give` - Online giving information
- `/contact` - Contact form
- `/location-times` - Location and service times

### Admin Pages
- `/login` - Admin login page
- `/admin` - Admin dashboard (protected)

---

## 🔑 Getting Required API Keys

### 1. Gemini API Key (Required for Chatbot)

**Steps:**
1. Go to https://ai.google.dev/
2. Click **"Get API Key"** or **"Get Started"**
3. Sign in with your Google account
4. Create a new project (if prompted)
5. Click **"Create API Key"**
6. Copy the API key
7. Paste it in `backend/.env` as `GEMINI_API_KEY`

**Cost:** Free tier available with generous limits

### 2. Gmail App Password (Optional - for Contact Form Emails)

**Steps:**
1. Go to https://myaccount.google.com/security
2. Enable **"2-Step Verification"** (if not already enabled)
3. Go to https://myaccount.google.com/apppasswords
4. Select app: **"Mail"**
5. Select device: **"Other (Custom name)"**
6. Enter name: **"PIWC Website"**
7. Click **"Generate"**
8. Copy the 16-character password
9. Paste it in `backend/.env` as `SMTP_PASS`

**Note:** Use the app password, NOT your regular Gmail password!

---

## 🤖 Testing the Chatbot

1. Start both servers (backend and frontend)
2. Look for the **red chat icon** in the bottom-right corner
3. Click to open the chatbot
4. Try these sample questions:
   - "When is your service?"
   - "Where are you located?"
   - "Do you have a kids program?"
   - "Who is the pastor?"
   - "What should I wear to church?"
   - "How can I get involved?"

The chatbot has **50+ pre-loaded FAQs** covering:
- Service times and location
- First-time visitor info
- Kids and family programs
- Beliefs and theology
- Ministry opportunities
- And more!

---

## 📁 Project Structure

```
piwcgrandrapids/
├── frontend/                  # React application
│   ├── src/
│   │   ├── pages/            # All website pages (14 pages)
│   │   ├── components/       # Reusable components
│   │   │   ├── layout/       # Navbar, Footer
│   │   │   ├── Chatbot/      # AI chatbot component
│   │   │   └── ThemeToggle/  # Dark/light mode
│   │   ├── context/          # State management
│   │   │   ├── AuthContext.js
│   │   │   └── ThemeContext.js
│   │   └── assets/           # Images, styles
│   └── package.json
│
├── backend/                   # Express API server
│   ├── routes/               # API endpoints
│   │   ├── auth.js           # Authentication
│   │   ├── chatbot.js        # AI chatbot
│   │   ├── contact.js        # Contact form
│   │   ├── gallery.js        # Photo gallery
│   │   ├── events.js         # Events CRUD
│   │   └── sermons.js        # Sermons CRUD
│   ├── middleware/           # Auth middleware
│   ├── utils/                # Helper functions
│   │   ├── churchInfo.js     # Church data
│   │   ├── chatbotKnowledge.js  # FAQ library
│   │   └── azureStorage.js   # Azure Blob Storage
│   ├── server.js             # Main server file
│   └── package.json
│
├── README.md                 # Project overview
├── SETUP.md                  # This file
├── AZURE_DEPLOYMENT.md       # Azure deployment guide
└── ADMIN_GUIDE.md           # Admin dashboard guide
```

---

## 📸 Image Management

### Development (Local Storage)
By default, images upload to `backend/uploads/` - no additional configuration needed.

### Production (Azure Blob Storage)
For production deployment with cloud storage:
```env
AZURE_STORAGE_CONNECTION_STRING=your-azure-connection-string
AZURE_STORAGE_CONTAINER_NAME=church-images
```

See [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md) for complete Azure setup.

---

## 🎨 Customization

### Update Church Information
Edit `backend/utils/churchInfo.js`:
```javascript
const churchInfo = {
  name: "Church Name",
  address: {
    street: "123 Main St",
    city: "City",
    state: "MI",
    zip: "12345"
  },
  contact: {
    phone: "(123) 456-7890",
    email: "your@email.com"
  }
};
```

### Change Theme Colors
Edit `frontend/src/index.css`:
```css
:root {
  --primary-blue: #003366;
  --primary-yellow: #FFD700;
  --primary-white: #FFFFFF;
}
```

### Add Church Logo
1. Save logo as `frontend/src/assets/images/church-logo.png`
2. Edit `frontend/src/components/layout/Navbar.js`
3. Uncomment the logo import and component

---

## 🔐 Security

### Change Default Admin Credentials
**Important:** Change the default admin password before deploying!

Default credentials (for development only):
- Email: `check Google doc`
- Password: `check Google doc`

Change in admin dashboard settings or update `backend/routes/auth.js`

---

## 📚 Documentation

- **Local Setup**: This file (SETUP.md)
- **Azure Deployment**: [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md)
- **Admin Features**: [ADMIN_GUIDE.md](ADMIN_GUIDE.md)
- **Project Overview**: [README.md](README.md)

---

## ✅ Customization Checklist

Before going live, update these:

**Church Information:**
- [ ] Church name and branding
- [ ] Service times and location (edit `backend/utils/churchInfo.js`)
- [ ] Contact information (phone, email, social media)
- [ ] About Us content

**Visual Elements:**
- [ ] Church logo (add to `frontend/src/assets/images/church-logo.png`)
- [ ] Church building photo (homepage hero image)
- [ ] Leadership photos and bios
- [ ] Ministry photos and descriptions
- [ ] Colors and styling (edit `frontend/src/index.css`)

**Content:**
- [ ] Add real sermon videos (YouTube URLs)
- [ ] Create upcoming events
- [ ] Upload gallery photos
- [ ] Customize chatbot responses (edit `backend/utils/chatbotKnowledge.js`)

**Security:**
- [ ] Change admin login credentials (in Admin Dashboard → Settings)
- [ ] Update `JWT_SECRET` to a secure random string
- [ ] Configure Gmail app password for emails

**Deployment:**
- [ ] Purchase domain name
- [ ] Set up Azure account
- [ ] Follow [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md)

---

## 🆘 Common Issues & Solutions

### Issue: "Port 5001 is already in use"

**Solution:**
```bash
# macOS/Linux
lsof -ti:5001 | xargs kill -9

# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Or use a different port in .env:
PORT=5002
```

### Issue: "Port 3000 is already in use"

**Solution:**
```bash
# Start frontend on different port
cd frontend
PORT=3001 npm start
```

### Issue: "Cannot find module" or "Module not found"

**Solution:**
```bash
# Delete node_modules and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Chatbot not responding

**Solution:**
1. Check `GEMINI_API_KEY` is set in `backend/.env`
2. Verify API key is valid at https://ai.google.dev/
3. Check backend console for errors
4. Restart backend server

### Issue: Backend won't start

**Solution:**
1. Verify `.env` file exists in `backend/` directory
2. Check all required variables are set
3. Run `npm install` to ensure dependencies are installed
4. Check backend console for specific error messages

### Issue: Admin login fails

**Solution:**
1. Verify backend is running on port 5001
2. Use correct credentials: `check Google doc` / `check Google doc`
3. Clear browser cache and cookies
4. Check browser console (F12) for errors
5. Verify `JWT_SECRET` is set in `.env`

### Issue: Emails not sending

**Solution:**
1. Verify you're using Gmail **app password**, not regular password
2. Ensure 2-Step Verification is enabled on your Gmail account
3. Check `SMTP_USER` and `SMTP_PASS` are correctly set in `.env`
4. Restart backend server after changing `.env`
5. Check backend console for email errors

### Issue: Images not uploading

**Solution:**
1. Check `backend/uploads/` directory exists
2. Verify folder has write permissions
3. Check backend console for upload errors
4. Ensure multer is installed: `npm list multer`

### Issue: Pages showing 404 errors

**Solution:**
1. Verify both backend and frontend are running
2. Check `frontend/package.json` has `"proxy": "http://localhost:5001"`
3. Clear browser cache
4. Restart both servers

---

## 🎯 Next Steps

### 1. Explore the Website
- Click through all pages
- Test the chatbot
- Try the contact form
- Test admin login and dashboard

### 2. Customize Content
- Update church information in `backend/utils/churchInfo.js`
- Replace placeholder images with real photos
- Add your church logo
- Customize colors and branding

### 3. Add Content
- Upload sermon videos to Watch page
- Create events in the Events page
- Add leadership bios and photos
- Upload gallery photos

### 4. Test Everything
- Test all forms (contact, prayer requests)
- Test chatbot responses
- Test admin dashboard features
- Test on mobile devices

### 5. Deploy to Production
- Follow [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md) for cloud hosting
- Set up custom domain
- Configure SSL/HTTPS (automatic with Azure)
- Test live site thoroughly

---

## 📚 Documentation

| Guide | Description |
|-------|-------------|
| **[README.md](README.md)** | Complete project overview and features |
| **[SETUP.md](SETUP.md)** | This file - local development setup |
| **[AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md)** | Azure cloud deployment guide |
| **[ADMIN_GUIDE.md](ADMIN_GUIDE.md)** | Admin dashboard usage guide |

---

## ⚠️ Important Notes

### Security
- ⚠️ Change admin password before going live
- 🔐 Never commit `.env` file to Git (already in `.gitignore`)
- 🔑 Keep `JWT_SECRET` and API keys secure
- 🌐 Always use HTTPS in production

### Images
- 📸 All current images are placeholders
- 📷 Use high-quality photos of your actual church
- 🗜️ Optimize images for web (compress before uploading)
- 📏 Recommended sizes: Hero images (1920x1080px), Logos (200x200px)

### API Keys
- 🔑 Get Gemini API key from https://ai.google.dev/
- 🔒 Keep all API keys secret and secure
- 📊 Monitor usage to avoid unexpected charges
- 💰 Gemini has a generous free tier

### Costs
- ☁️ Azure hosting: ~$15-25/month (with free Static Web App tier) or Free option 
- 🌐 Domain name: ~$10-15/year
- 🤖 Gemini AI: Free tier available, paid tiers if needed
- 📧 Email: Free with Gmail

---

## 🛠️ Support & Maintenance

### Regular Tasks

**Weekly:**
- Check prayer requests and contact messages (Admin Dashboard)
- Respond to contact form submissions
- Update events calendar

**Monthly:**
- Add new sermons to Watch page
- Upload new gallery photos
- Update ministry information
- Review chatbot performance

**Quarterly:**
- Update dependencies: `npm update`
- Review and refresh content
- Check for broken links
- Update leadership information

---

## 📞 Getting Help

**Documentation:**
- Full documentation in `README.md`
- Azure deployment guide in `AZURE_DEPLOYMENT.md`
- Admin features guide in `ADMIN_GUIDE.md`

**Support:**
- Email: piwcgrandrapids0@gmail.com
- Phone: (616) 123-4567

**Online Resources:**
- React Documentation: https://react.dev/
- Express.js Guide: https://expressjs.com/
- Azure Docs: https://docs.microsoft.com/azure
- Gemini AI: https://ai.google.dev/

---

✅ **You're all set!** Start the servers and explore the new church website!

Questions? Check the documentation or contact us at piwcgrandrapids0@gmail.com

---

**Built with ❤️ for PIWC Grand Rapids**  
*The Church of Pentecost USA, Inc. - Detroit District*  
*Grand Rapids, Michigan*

**Last Updated**: November 11, 2025

