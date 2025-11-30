const nodemailer = require('nodemailer');
const { churchInfo } = require('./churchInfo');

/**
 * Email Service for PIWC Grand Rapids
 * Sends notifications for contact form submissions and prayer requests
 */

// Create transporter (configure with your email service)
const createTransporter = () => {
  // For Gmail, you'll need to use an App Password
  // For other services, adjust accordingly
  
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('Email credentials not configured. Emails will not be sent.');
    return null;
  }

  return nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

/**
 * Send contact form notification to church email
 */
async function sendContactFormEmail(formData) {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('Email not sent - credentials not configured');
    console.log('Contact form data:', formData);
    return { success: false, reason: 'Email not configured' };
  }

  const { name, email, phone, subject, message } = formData;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: churchInfo.contact.email, // Send to church email
    replyTo: email, // Allow replying directly to the person
    subject: `📬 New Contact Form: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #003366; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
          .info-row { margin: 15px 0; padding: 12px; background: white; border-left: 4px solid #FFD700; }
          .label { font-weight: bold; color: #003366; }
          .message-box { background: white; padding: 20px; margin: 20px 0; border: 1px solid #ddd; border-radius: 5px; }
          .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Submission</h2>
            <p style="margin: 0;">PIWC Grand Rapids Website</p>
          </div>
          
          <div class="content">
            <div class="info-row">
              <span class="label">From:</span> ${name}
            </div>
            
            <div class="info-row">
              <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
            </div>
            
            ${phone ? `
            <div class="info-row">
              <span class="label">Phone:</span> <a href="tel:${phone}">${phone}</a>
            </div>
            ` : ''}
            
            <div class="info-row">
              <span class="label">Subject:</span> ${subject}
            </div>
            
            <div class="message-box">
              <h3 style="margin-top: 0; color: #003366;">Message:</h3>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e6f0ff; border-radius: 5px;">
              <p style="margin: 5px 0;"><strong>Received:</strong> ${new Date().toLocaleString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </div>
          
          <div class="footer">
            <p>This email was sent from the PIWC Grand Rapids website contact form.</p>
            <p>Reply to this email to respond directly to ${name}.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
New Contact Form Submission - PIWC Grand Rapids

From: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
Subject: ${subject}

Message:
${message}

Received: ${new Date().toLocaleString()}

---
Reply to this email to respond directly to ${name}.
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Contact form email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending contact form email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send prayer request notification to church email
 */
async function sendPrayerRequestEmail(prayerData) {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('Email not sent - credentials not configured');
    console.log('Prayer request data:', prayerData);
    return { success: false, reason: 'Email not configured' };
  }

  const { name, email, phone, subject, message, isUrgent } = prayerData;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: churchInfo.contact.email,
    replyTo: email,
    subject: `${isUrgent ? 'URGENT' : ''} Prayer Request: ${subject || 'From ' + name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${isUrgent ? '#C41E3A' : '#003366'}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
          .info-row { margin: 15px 0; padding: 12px; background: white; border-left: 4px solid #FFD700; }
          .label { font-weight: bold; color: #003366; }
          .prayer-box { background: white; padding: 20px; margin: 20px 0; border: 1px solid #ddd; border-radius: 5px; }
          .urgent-badge { background: #C41E3A; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; margin: 10px 0; }
          .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Prayer Request</h2>
            ${isUrgent ? '<div class="urgent-badge">URGENT REQUEST</div>' : ''}
            <p style="margin: 0;">PIWC Grand Rapids Website</p>
          </div>
          
          <div class="content">
            <div class="info-row">
              <span class="label">From:</span> ${name}
            </div>
            
            <div class="info-row">
              <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
            </div>
            
            ${phone ? `
            <div class="info-row">
              <span class="label">Phone:</span> <a href="tel:${phone}">${phone}</a>
            </div>
            ` : ''}
            
            ${subject ? `
            <div class="info-row">
              <span class="label">Subject:</span> ${subject}
            </div>
            ` : ''}
            
            <div class="prayer-box">
              <h3 style="margin-top: 0; color: #003366;">Prayer Request:</h3>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e6f0ff; border-radius: 5px;">
              <p style="margin: 5px 0;"><strong>Received:</strong> ${new Date().toLocaleString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              ${isUrgent ? '<p style="margin: 5px 0; color: #C41E3A;"><strong>This is marked as URGENT</strong></p>' : ''}
            </div>
          </div>
          
          <div class="footer">
            <p>This prayer request was submitted through the PIWC Grand Rapids website.</p>
            <p>Reply to this email to respond directly to ${name}.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
New Prayer Request - PIWC Grand Rapids
${isUrgent ? '\nURGENT REQUEST\n' : ''}

From: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
${subject ? `Subject: ${subject}` : ''}

Prayer Request:
${message}

Received: ${new Date().toLocaleString()}
${isUrgent ? '\nThis is marked as URGENT' : ''}

---
Reply to this email to respond directly to ${name}.
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Prayer request email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending prayer request email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send confirmation email to the person who submitted the form
 */
async function sendConfirmationEmail(toEmail, name, type = 'contact') {
  const transporter = createTransporter();
  
  if (!transporter) {
    return { success: false, reason: 'Email not configured' };
  }

  const isPrayer = type === 'prayer';

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: toEmail,
    subject: `${isPrayer ? '🙏' : '✅'} We Received Your ${isPrayer ? 'Prayer Request' : 'Message'} - PIWC Grand Rapids`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #003366; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
          .footer { background: #003366; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
          .btn { background: #FFD700; color: #003366; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; margin: 15px 0; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">${isPrayer ? '🙏' : '✅'} Thank You!</h1>
          </div>
          
          <div class="content">
            <p>Hello ${name},</p>
            
            <p>Thank you for reaching out to PIWC Grand Rapids! We have received your ${isPrayer ? 'prayer request' : 'message'} and will ${isPrayer ? 'lift you up in prayer' : 'respond as soon as possible'}.</p>
            
            ${isPrayer ? `
              <p>Your prayer request is important to us. Our prayer team will be interceding on your behalf.</p>
              
              <blockquote style="border-left: 4px solid #FFD700; padding-left: 15px; margin: 20px 0; font-style: italic; color: #666;">
                "The prayer of a righteous person is powerful and effective." - James 5:16
              </blockquote>
            ` : `
              <p>We typically respond within 24-48 hours. If your matter is urgent, please call us at ${churchInfo.contact.phone}.</p>
            `}
            
            <p><strong>Church Information:</strong></p>
            <ul style="list-style: none; padding: 0;">
              <li>📍 ${churchInfo.address.full}</li>
              <li>📞 ${churchInfo.contact.phone}</li>
              <li>📧 ${churchInfo.contact.email}</li>
            </ul>
            
            <p><strong>Service Times:</strong></p>
            <ul style="list-style: none; padding: 0;">
              <li>🕐 Sunday: ${churchInfo.services.sunday.time} (${churchInfo.services.sunday.type})</li>
              <li>🙏 Friday: ${churchInfo.services.friday.time} (${churchInfo.services.friday.type})</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${churchInfo.contact.website}" class="btn">Visit Our Website</a>
            </div>
          </div>
          
          <div class="footer">
            <p style="margin: 5px 0;"><strong>PIWC Grand Rapids</strong></p>
            <p style="margin: 5px 0;">The Church of Pentecost - Detroit District</p>
            <p style="margin: 5px 0; font-size: 12px;">Where Faith Meets Fellowship</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to:', toEmail);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendContactFormEmail,
  sendPrayerRequestEmail,
  sendConfirmationEmail
};

