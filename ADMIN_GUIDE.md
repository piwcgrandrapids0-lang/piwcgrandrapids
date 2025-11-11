# 🔐 ADMIN GUIDE - PIWC Grand Rapids Website

**Complete guide for managing the church website without touching code**

---

## 📋 Table of Contents

1. [Getting Started](#-getting-started)
2. [Logging In](#-logging-in)
3. [Admin Dashboard Overview](#-admin-dashboard-overview)
4. [Managing Photo Gallery](#-managing-photo-gallery)
5. [Editing Website Content](#-editing-website-content)
6. [Managing Events](#-managing-events)
7. [Managing Sermons (Watch Page)](#-managing-sermons-watch-page)
8. [Viewing Messages & Prayers](#-viewing-messages--prayers)
9. [Admin Settings (Password & Logout)](#-admin-settings-password--logout)
10. [Troubleshooting](#-troubleshooting)
11. [Best Practices](#-best-practices)

---

## 🚀 Getting Started

### Admin Login Credentials

| Field | Value |
|-------|-------|
| **Username** | `check Google doc` |
| **Password** | `check Google doc` |
| **Login URL** | `http://localhost:3000/login` (development)<br>`https://yourwebsite.com/login` (production) |

⚠️ **IMPORTANT**: Change the default password after first login for security!

---

## 🔑 Logging In

### Step 1: Navigate to Login Page

1. Open your web browser
2. Go to `http://localhost:3000/login` (or your live website URL + `/login`)
3. You'll see the login form

### Step 2: Enter Credentials

1. **Username Field**: Enter `check Google doc` (NOT your email address)
2. **Password Field**: Enter `check Google doc`
3. Click "Login" button

### Common Login Issues

| Problem | Solution |
|---------|----------|
| "Invalid credentials" | Make sure you use username `check Google doc`, not email |
| "Server error" | Check that backend server is running |
| Page not loading | Clear browser cache (`Ctrl+Shift+R` or `Cmd+Shift+R`) |

---

## 📊 Admin Dashboard Overview

Once logged in, you'll see **6 main tabs** with full control over the website:

### 📸 **Photo Gallery Tab**
- Upload new photos from services and events
- Delete old photos
- Organize by 7 categories (Sunday Services, Events, Youth, Worship, Community, Special)
- See preview before uploading

### 📝 **Website Content Tab**
- Edit homepage hero section
- Update service times (Sunday & Friday)
- Change contact information
- Modify about us content
- Update footer information
- Changes reflect instantly on the website

### 📅 **Events Tab**
- Create new church events
- Edit existing events
- Delete past events
- Categorize events (Worship, Prayer, Youth, Outreach, etc.)
- Set dates, times, and locations

### 🎥 **Sermons/Watch Tab**
- Add YouTube sermon videos
- Edit sermon details
- Delete old sermons
- Auto-converts YouTube URLs to embed format
- Organize by series and date

### 💬 **Messages & Prayers Tab**
- View contact form submissions
- Read prayer requests
- See urgent prayer needs (highlighted)
- Access user email addresses for replies
- Track message timestamps

### ⚙️ **Settings Tab**
- Change admin password
- View account information
- Security tips
- Logout option

---

## 📸 Managing Photo Gallery

### Uploading a New Photo

#### Step 1: Go to Gallery Tab
1. Click on "📸 Photo Gallery" tab in admin dashboard
2. Scroll to "Upload New Photo" section

#### Step 2: Fill Out Form

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| **Photo Title** | ✅ Yes | Descriptive title for the photo | "Sunday Morning Worship November 17" |
| **Category** | ✅ Yes | Select from dropdown | Sunday Services, Events, Youth, etc. |
| **Date** | ✅ Yes | Date photo was taken | 2025-11-17 |
| **Description** | ❌ No | Optional details about the photo | "Amazing worship time with the congregation" |

#### Step 3: Upload Image

**Method 1: Drag & Drop**
1. Open the photo file on your computer
2. Drag it into the drop zone (large dashed box)
3. You'll see a preview of the image

**Method 2: Choose File**
1. Click "Choose File" button
2. Browse your computer
3. Select the image file
4. Click "Open"

**Image Requirements:**
- ✅ **Format**: JPG, PNG, WebP, or GIF
- ✅ **Max Size**: 5MB
- ✅ **Recommended Size**: 1920x1080 pixels (Full HD)
- ✅ **Orientation**: Landscape works best

#### Step 4: Submit
1. Review all fields
2. Click "📤 Upload Photo" button
3. Wait for "✅ Image uploaded successfully!" message
4. Photo appears instantly in the gallery below

---

### Gallery Categories

Choose the right category for better organization:

| Category | When to Use |
|----------|-------------|
| **⛪ Sunday Services** | Regular worship services, communion, offerings |
| **🎉 Church Events** | Special events, picnics, celebrations |
| **👥 Youth Ministry** | Youth gatherings, Bible studies, youth events |
| **🎵 Worship & Praise** | Choir performances, worship team, music ministry |
| **🤝 Community Outreach** | Food drives, community service, outreach programs |
| **✨ Special Occasions** | Baptisms, weddings, anniversaries, dedications |

---

### Deleting a Photo

1. Scroll down to "Existing Photos" section
2. Find the photo you want to delete
3. Click "🗑️ Delete" button on the photo card
4. Confirm deletion in the popup
5. Photo is removed instantly

⚠️ **Warning**: Deletion is permanent and cannot be undone!

---

## 📝 Editing Website Content

### Available Content Sections

| Section | What You Can Edit |
|---------|-------------------|
| 🏠 **Homepage Hero** | Main welcome message, title, subtitle |
| ⏰ **Service Times** | Sunday & Friday service times and descriptions |
| 📞 **Contact Info** | Phone, email, physical address |
| ℹ️ **About Us** | Mission, vision, and about description |
| 📄 **Footer** | Tagline, social media links |

---

### Editing Homepage Hero

**What appears here**: The large welcome message visitors see first

#### Steps:
1. Click "📝 Website Content" tab
2. Click "🏠 Homepage Hero" in left sidebar
3. Edit fields:
   - **Title**: Main headline (e.g., "Welcome to PIWC Grand Rapids")
   - **Subtitle**: Secondary text (e.g., "The Church of Pentecost USA, Inc.")
   - **Description**: Welcome paragraph
4. Click "💾 Save Changes"
5. You'll see "✅ Saved successfully!"

**Changes appear**: Homepage immediately after save

---

### Updating Service Times

**What appears here**: Service times on homepage, footer, and location page

#### Steps:
1. Click "📝 Website Content" tab
2. Click "⏰ Service Times" in left sidebar
3. Two sections to edit:

**Sunday Service:**
- **Time**: e.g., "12:30 PM"
- **Type**: e.g., "In-Person"
- **Description**: Brief service description

**Friday Prayer Meeting:**
- **Time**: e.g., "7:00 PM EST"
- **Type**: e.g., "Online"
- **Description**: Brief meeting description

4. Click "💾 Save Changes"

**Changes appear**: Homepage, footer, and all pages instantly

---

### Changing Contact Information

**What appears here**: Contact page, footer, and throughout the site

#### Steps:
1. Click "📝 Website Content" tab
2. Click "📞 Contact Info" in left sidebar
3. Edit fields:

**Basic Info:**
- **Phone Number**: e.g., "(616) 123-4567"
- **Email Address**: e.g., "piwcgrandrapids0@gmail.com"

**Address:**
- **Street**: e.g., "7003 28th Ave"
- **City**: e.g., "Hudsonville"
- **State**: e.g., "MI"
- **ZIP Code**: e.g., "49426"

4. Click "💾 Save Changes"

**Changes appear**: Contact page, footer, maps, and directions instantly

---

### Editing About Us Content

**What appears here**: About Us page

#### Steps:
1. Click "📝 Website Content" tab
2. Click "ℹ️ About Us" in left sidebar
3. Edit fields:
   - **Mission Statement**: Your church's mission
   - **Vision Statement**: Your church's vision
   - **About Description**: Detailed church description
4. Click "💾 Save Changes"

**Changes appear**: About page instantly

---

### Updating Footer Content

**What appears here**: Bottom of every page on the website

#### Steps:
1. Click "📝 Website Content" tab
2. Click "📄 Footer" in left sidebar
3. Edit fields:
   - **Tagline**: Footer motto/slogan
   - **Facebook URL**: Full Facebook page link
   - **Instagram URL**: Full Instagram page link
4. Click "💾 Save Changes"

**Changes appear**: Every page footer instantly

---

## 💬 Viewing Messages & Prayers

### Contact Messages

**What these are**: Messages sent via the "Contact Us" form

#### Steps to View:
1. Click "💬 Messages & Prayers" tab
2. Click "📧 Contact Messages" sub-tab
3. You'll see all messages with:
   - Sender name
   - Email address (clickable to reply)
   - Phone number (if provided)
   - Subject
   - Full message
   - Date received

#### How to Reply:
1. Click the email address
2. Your email client opens automatically
3. Compose your reply
4. Send

---

### Prayer Requests

**What these are**: Prayer requests submitted via the website

#### Steps to View:
1. Click "💬 Messages & Prayers" tab
2. Click "🙏 Prayer Requests" sub-tab
3. You'll see all requests with:
   - Name
   - Email address (clickable)
   - Phone number (if provided)
   - Subject
   - Prayer request details
   - Date received
   - **URGENT** badge (if marked urgent)

#### Urgent Requests:
- Highlighted with red border
- "URGENT" badge displayed
- Needs immediate attention

---

## 📅 Managing Events

The Events tab allows you to create, edit, and delete church events that appear on the Events page.

### Adding a New Event

1. **Click the Events Tab** (📅 icon) in the Admin Dashboard
2. **Click "+ Add Event"** button
3. **Fill out the form**:
   - **Event Title**: Name of the event (e.g., "Youth Night")
   - **Category**: Select from dropdown
     - General Event
     - Worship Service
     - Prayer Meeting
     - Youth Event
     - Community Outreach
     - Special Occasion
   - **Date**: Select event date
   - **Time**: Enter event time (e.g., "7:00 PM")
   - **Location**: Where the event takes place
   - **Description**: Detailed description of the event
4. **Click "➕ Create Event"**

### Editing an Event

1. Find the event in the list
2. Click "✏️ Edit" button
3. Make your changes
4. Click "💾 Update Event"

### Deleting an Event

1. Find the event in the list
2. Click "🗑️ Delete" button
3. Confirm deletion

### Event Categories Explained

| Category | Use For |
|----------|---------|
| **General Event** | Regular church gatherings |
| **Worship Service** | Special worship services |
| **Prayer Meeting** | Prayer-focused events |
| **Youth Event** | Youth ministry activities |
| **Community Outreach** | Outreach and service events |
| **Special Occasion** | Holidays, anniversaries, etc. |

### Tips for Events

- ✅ Add events at least 2 weeks in advance
- ✅ Use clear, descriptive titles
- ✅ Include all important details in description
- ✅ Double-check dates and times
- ✅ Delete past events regularly to keep list current

---

## 🎥 Managing Sermons (Watch Page)

The Sermons tab controls what videos appear on the Watch page. Add YouTube videos from your church services.

### Adding a New Sermon

1. **Click the Sermons/Watch Tab** (🎥 icon)
2. **Click "+ Add Sermon"** button
3. **Fill out the form**:
   - **Sermon Title**: Name of the sermon
   - **Speaker**: Who preached (e.g., "Pastor John Doe")
   - **Date**: When it was preached
   - **Series**: (Optional) Sermon series name
   - **YouTube Video URL**: Paste the full YouTube URL
   - **Description**: Brief summary of the sermon
4. **Click "➕ Add Sermon"**

### YouTube URL Formats Accepted

All these formats work - the system automatically converts them:

```
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
https://www.youtube.com/embed/VIDEO_ID
```

### Editing a Sermon

1. Find the sermon in the list
2. Click "✏️ Edit" button
3. Make your changes
4. Click "💾 Update Sermon"

### Deleting a Sermon

1. Find the sermon in the list
2. Click "🗑️ Delete" button
3. Confirm deletion

### Tips for Sermons

- ✅ Upload sermons regularly (weekly recommended)
- ✅ Use consistent naming (e.g., "The Power of Prayer - Week 1")
- ✅ Add series names for multi-part messages
- ✅ Write engaging descriptions
- ✅ Make sure YouTube videos are set to "Public" or "Unlisted"
- ✅ Test videos after adding to ensure they play

---

## ⚙️ Admin Settings (Password & Logout)

The Settings tab allows you to change your admin password and view account information.

### Changing Your Password

**IMPORTANT**: Change the default password (`check Google doc`) immediately for security!

1. **Click the Settings Tab** (⚙️ icon)
2. **Find the "Change Password" section**
3. **Fill out the form**:
   - **Current Password**: Enter `check Google doc` (or your current password)
   - **New Password**: Enter a strong password (min 6 characters)
   - **Confirm New Password**: Re-enter the new password
4. **Click "🔐 Change Password"**
5. You'll be logged out and need to log in again with your new password

### Password Requirements

- ✅ **Minimum 6 characters**
- ✅ Must be different from current password
- ✅ Passwords must match

### Tips for Strong Passwords

- ✅ Use at least 8-12 characters
- ✅ Mix uppercase and lowercase letters
- ✅ Include numbers
- ✅ Include special characters (!@#$%^&*)
- ✅ Don't use common words or church name
- ✅ Don't share password with anyone

**Example Strong Passwords**:
- `Church#2025!PIWC`
- `GodIsGood@789`
- `Worship!#Minister2024`

### Logging Out

There are two ways to logout:

#### Method 1: Settings Tab
1. Go to Settings tab
2. Scroll to "Logout" section
3. Click "🚪 Logout from Admin Dashboard"
4. Confirm logout

#### Method 2: Header Button
1. Click "Logout" button in the top-right of Admin Dashboard
2. You'll be redirected to the homepage

### Account Information

The Settings tab shows:
- **Role**: Administrator
- **Username**: admin
- **Access Level**: Full Access
- **Status**: Active (🟢 green indicator)

### Security Tips

Follow these best practices to keep your admin account secure:

1. ✅ **Use a strong, unique password**
2. ✅ **Change your password regularly** (every 3-6 months)
3. ✅ **Never share your admin credentials**
4. ✅ **Always logout when done**
5. ✅ **Use a secure internet connection** (avoid public WiFi for admin tasks)
6. ✅ **Clear browser history** after using public computers

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### "Changes not showing on website"

**Solutions:**
1. Hard refresh the page: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Clear browser cache
3. Check that you clicked "Save Changes"
4. Try a different browser

#### "Upload failed - file too large"

**Solutions:**
1. Image must be under 5MB
2. Compress image using:
   - [TinyPNG](https://tinypng.com/)
   - [Squoosh](https://squoosh.app/)
3. Reduce image dimensions
4. Convert to JPG format

#### "Invalid credentials" when logging in

**Solutions:**
1. Username is `admin` (not your email)
2. Password is `admin123` (or your changed password)
3. Check for spaces before/after username
4. Try copy-pasting credentials

#### "Server error" messages

**Solutions:**
1. Check backend server is running
2. Verify network connection
3. Contact technical support

#### Can't see uploaded photo in gallery

**Solutions:**
1. Refresh the page
2. Check if upload showed success message
3. Verify image file was valid
4. Check browser console for errors

---

## ✅ Best Practices

### Photo Management

1. **Optimize Before Upload**
   - Use [TinyPNG](https://tinypng.com/) to compress images
   - Target 200-500KB file size
   - Maintain good quality (80-90%)

2. **Use Descriptive Titles**
   - ✅ Good: "Sunday Worship Service - November 17, 2025"
   - ❌ Bad: "IMG_1234.jpg"

3. **Choose Correct Category**
   - Helps visitors find specific types of photos
   - Makes gallery organization easier

4. **Add Descriptions**
   - Provides context
   - Helps with SEO
   - Makes photos more meaningful

5. **Regular Updates**
   - Upload new photos weekly or after major events
   - Remove outdated photos
   - Keep gallery fresh and current

---

### Content Management

1. **Keep It Concise**
   - Short, clear sentences
   - Easy to read
   - Mobile-friendly

2. **Update Regularly**
   - Review content monthly
   - Keep service times current
   - Update contact info if changed

3. **Test Changes**
   - After saving, visit the actual page
   - Check on mobile device
   - Ensure everything looks good

4. **Save Often**
   - Click "Save Changes" after each section
   - Don't edit multiple sections before saving
   - Watch for success messages

---

### Security

1. **Change Default Password**
   - Use strong password (12+ characters)
   - Mix uppercase, lowercase, numbers, symbols
   - Don't share password

2. **Logout When Done**
   - Always click "Logout" button
   - Especially on shared computers
   - Prevents unauthorized access

3. **Regular Reviews**
   - Check for unusual activity
   - Review uploaded photos
   - Monitor contact messages

---

## 📞 Getting Help

### Technical Support

If you encounter issues not covered in this guide:

1. **Check README.md** - Comprehensive technical documentation
2. **Contact Developer** - For code-related issues
3. **Azure Support** - For hosting issues (production)

### Quick Reference Card

**Login**: `check Google doc` / `check Google doc`  
**Admin URL**: `/login`  
**Max Image Size**: 5MB  
**Supported Formats**: JPG, PNG, WebP, GIF  

---

## 🎉 Congratulations!

You now have complete control over your church website content!

**Remember:**
- ✅ All changes are instant
- ✅ No coding required
- ✅ Safe to experiment
- ✅ Changes can be reverted
- ✅ Help is available

---

**Last Updated**: November 11, 2025  
**Version**: 1.0  
**For**: PIWC Grand Rapids Website Admin Panel

