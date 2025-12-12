/**
 * Chatbot Knowledge Base Library
 * Pre-loaded answers for common church questions
 * Organized by category for easy maintenance
 */

const { churchInfo } = require('./churchInfo');
const fs = require('fs');
const path = require('path');

// Helper function to get content from file
const getContent = () => {
  try {
    const contentFilePath = path.join(__dirname, '../data/content.json');
    const data = fs.readFileSync(contentFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading content for chatbot:', error);
    return null;
  }
};

// Helper function to get pastor name from content
const getPastorName = (content) => {
  if (content?.leadership?.leaders) {
    const leadPastor = content.leadership.leaders.find(member => member.isLeadPastor);
    if (leadPastor) return leadPastor.name;
  }
  // Also check for 'team' in case structure changes
  if (content?.leadership?.team) {
    const leadPastor = content.leadership.team.find(member => member.isLeadPastor);
    if (leadPastor) return leadPastor.name;
  }
  return churchInfo.leadership.pastor.name; // Fallback
};

// Helper function to get pastor email from content
const getPastorEmail = (content) => {
  if (content?.leadership?.leaders) {
    const leadPastor = content.leadership.leaders.find(member => member.isLeadPastor);
    if (leadPastor && leadPastor.email) return leadPastor.email;
  }
  // Also check for 'team' in case structure changes
  if (content?.leadership?.team) {
    const leadPastor = content.leadership.team.find(member => member.isLeadPastor);
    if (leadPastor && leadPastor.email) return leadPastor.email;
  }
  return churchInfo.leadership.pastor.contact; // Fallback
};

// Helper function to get phone from content
const getPhone = (content) => {
  return content?.contact?.phone || churchInfo.contact.phone;
};

// Helper function to get email from content
const getEmail = (content) => {
  return content?.contact?.email || churchInfo.contact.email;
};

// Helper function to get address from content
const getAddress = (content) => {
  if (content?.contact?.address) {
    const addr = content.contact.address;
    return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}`;
  }
  return churchInfo.address.full;
};

// Helper function to get service times from content
const getServiceTimes = (content) => {
  return {
    sunday: content?.services?.sunday?.time || churchInfo.services.sunday.time,
    friday: content?.services?.friday?.time || churchInfo.services.friday.time
  };
};

// Build knowledge base dynamically using content
const buildKnowledgeBase = (content) => {
  const pastorName = getPastorName(content);
  const pastorEmail = getPastorEmail(content);
  const phone = getPhone(content);
  const email = getEmail(content);
  const address = getAddress(content);
  const serviceTimes = getServiceTimes(content);

  return {
  // Service Times & Schedule
  serviceTimes: {
    keywords: ['service', 'time', 'when', 'schedule', 'worship', 'meeting'],
    answers: {
      general: `We have two regular services:

📅 **Sunday Worship Service**
⏰ ${serviceTimes.sunday}
📍 In-person at ${address}

📅 **Friday Prayer Meeting**
⏰ ${serviceTimes.friday}
💻 Online (Virtual)

Come join us!`,
      
      sunday: `Our Sunday worship service is at **${serviceTimes.sunday}** at ${address}. We have Spirit-filled worship, powerful preaching, and warm fellowship. Everyone is welcome!`,
      
      friday: `Our Friday prayer meeting is at **${serviceTimes.friday}** and it's **online**. It's a powerful time of intercession and seeking God's face together.`,
      
      online: `Yes! Our Friday prayer meetings at ${serviceTimes.friday} are online. Our Sunday services at ${serviceTimes.sunday} are in-person at our Hudsonville location.`
    }
  },

  // Location & Directions
  location: {
    keywords: ['location', 'where', 'address', 'directions', 'find', 'map'],
    answers: {
      general: `We're located at:
📍 **${address}**

**Directions:**
- From Grand Rapids: Take US-196 W, exit at 28th Ave
- From Holland: Take US-196 E, exit at 28th Ave
- Free parking available on-site

[Get Directions](${churchInfo.address.googleMapsUrl})`,
      
      parking: `We have **free parking** available on-site at ${content?.contact?.address?.street || churchInfo.address.street}. Our parking team will help guide you to available spots when you arrive.`,
      
      fromGrandRapids: `From Grand Rapids: Take US-196 West toward Holland, exit at 28th Ave in Hudsonville. Turn right onto 28th Ave. The church will be on your right. About 20 minutes from downtown Grand Rapids.`
    }
  },

  // First-Time Visitors
  visitors: {
    keywords: ['new', 'first time', 'visiting', 'visitor', 'never been', 'what to expect'],
    answers: {
      general: `**Welcome! We're so glad you're interested in visiting!** 🎉

Here's what to expect:
✅ Service starts at 12:30 PM on Sundays
✅ Dress comfortably - come as you are!
✅ Free parking with friendly parking attendants
✅ Greeters at the door to welcome you
✅ Service lasts about 2 hours
✅ Kids programs available during service

**First-time visitor?** Our welcome team would love to meet you and answer any questions. Just look for someone with a name tag at the entrance!`,
      
      whatToExpect: `**What to Expect at PIWC Grand Rapids:**

1️⃣ **Warm Welcome** - Our greeters will welcome you with a smile
2️⃣ **Inspiring Worship** - Contemporary and traditional songs
3️⃣ **Biblical Teaching** - Practical, life-changing messages
4️⃣ **Fellowship** - Connect with friendly people
5️⃣ **Duration** - About 2 hours total

**Arrive 10-15 minutes early** to find parking and get settled. See you Sunday!`
    }
  },

  // Kids & Family
  kids: {
    keywords: ['kid', 'child', 'children', 'baby', 'nursery', 'family', 'youth', 'teenager'],
    answers: {
      general: `Yes! We have **PIWC Kids** programs for children of all ages:

👶 **Nursery** (0-2 years)
🎨 **Preschool** (3-5 years)
📚 **Elementary** (6-12 years)
🎸 **Youth Ministry** (13-18 years)

All programs run during the Sunday service. Your children will have fun while learning about Jesus in a safe, loving environment with trained volunteers.`,
      
      safety: `**Child Safety is our priority!**
✅ Background-checked volunteers
✅ Secure check-in/check-out system
✅ Age-appropriate rooms
✅ Trained childcare staff
✅ Clean, safe facilities

Parents can attend service with peace of mind knowing their children are well cared for.`
    }
  },

  // Dress Code
  dressCode: {
    keywords: ['wear', 'dress', 'attire', 'clothes', 'outfit', 'formal', 'casual'],
    answers: {
      general: `**Come as you are!** 👔👗

We have a mix of dress styles:
- Some dress formally (suits, dresses)
- Others dress casually (jeans, nice shirt)
- The most important thing is that you're comfortable!

**Our focus is on your heart, not your outfit.** You'll see a variety of styles and everyone is welcome.`
    }
  },

  // Online Services
  online: {
    keywords: ['online', 'stream', 'livestream', 'watch', 'virtual', 'zoom', 'video'],
    answers: {
      general: `**Online Options:**

🙏 **Friday Prayer Meeting** - 7:00 PM EST (Online)
- Virtual prayer and worship
- Interactive via Zoom/online platform

📺 **Sunday Service** - In-person only
- However, we archive sermons on our Watch page
- Can't make it? Catch up on previous messages anytime!

**Social Media:**
📱 Instagram: [@piwc_grandrapids](${churchInfo.contact.instagram})
📘 Facebook: [PIWC Grand Rapids](${churchInfo.contact.facebook})`
    }
  },

  // Contact Information
  contact: {
    keywords: ['contact', 'phone', 'email', 'call', 'reach', 'talk', 'speak'],
    answers: {
      general: `**Get in Touch:**

📞 **Phone:** ${phone}
📧 **Email:** ${email}
📍 **Address:** ${address}

**Social Media:**
📱 Instagram: ${churchInfo.contact.instagram}
📘 Facebook: ${churchInfo.contact.facebook}

We typically respond within 24-48 hours. Looking forward to hearing from you!`
    }
  },

  // Pastor & Leadership
  pastor: {
    keywords: ['pastor', 'minister', 'reverend', 'leader', 'priest', 'preacher'],
    answers: {
      general: `Our Resident Pastor is **${pastorName}**. He has been serving our congregation with passion and dedication, bringing powerful biblical teaching and pastoral care.

Want to connect with Pastor? 
📧 Email: ${pastorEmail}
📞 Call the church office: ${phone}

You can also meet him in person after Sunday service!`
    }
  },

  // Giving & Donations
  giving: {
    keywords: ['give', 'donate', 'offering', 'tithe', 'money', 'contribution'],
    answers: {
      general: `**Giving Options:**

💻 **Online** - Visit our website's Give page
💵 **In-Person** - During Sunday service
✉️ **Mail** - Send to: ${address}

**As a first-time guest, you are NOT expected to give.** Giving is an act of worship for our members, but visitors should never feel pressured.

All donations are tax-deductible. We're a 501(c)(3) organization.`
    }
  },

  // Beliefs & Denomination
  beliefs: {
    keywords: ['believe', 'belief', 'doctrine', 'faith', 'pentecost', 'denomination'],
    answers: {
      general: `**About The Church of Pentecost:**

✝️ We are a **Pentecostal** denomination
🌍 Founded in Ghana in 1953
🌎 Over **4 million members** in 100+ nations
📖 We believe in the Bible as God's inspired Word
🕊️ We emphasize the work of the Holy Spirit
❤️ We focus on evangelism, holiness, and discipleship

**Core Beliefs:**
- Salvation through Jesus Christ alone
- Baptism of the Holy Spirit
- Divine healing
- Second coming of Christ

Learn more on our Beliefs page!`
    }
  },

  // Ministries & Getting Involved
  ministries: {
    keywords: ['ministry', 'ministries', 'serve', 'volunteer', 'get involved', 'join', 'participate'],
    answers: {
      general: `**Get Connected at PIWC Grand Rapids!**

We have ministries for everyone:

👶 **PIWC Kids** - Children's ministry
🎸 **Youth Ministry** - Teens & young adults
👨 **Men's Ministry** - Brotherhood & discipleship
👩 **Women's Ministry** - Fellowship & growth
🎵 **Worship Team** - Music ministry
🙏 **Prayer Ministry** - Intercession
🌍 **Outreach** - Community service & missions

**Want to get involved?**
1. Attend a Sunday service
2. Talk to our Connect team
3. Fill out a connection card

Everyone has a place to serve!`
    }
  },

  // COVID/Safety
  safety: {
    keywords: ['covid', 'safe', 'safety', 'mask', 'social distance', 'clean', 'sanitize'],
    answers: {
      general: `**Health & Safety:**

✅ Clean, well-maintained facilities
✅ Hand sanitizer available
✅ Following local health guidelines
✅ Spacious sanctuary for comfortable seating

We want everyone to feel safe and comfortable during service. If you have specific health concerns, please contact us and we'll be happy to help!`
    }
  },

  // Baptism & Membership
  membership: {
    keywords: ['baptism', 'baptize', 'member', 'membership', 'join church', 'become member'],
    answers: {
      general: `**Interested in Baptism or Membership?**

🌊 **Water Baptism**
- For believers who have accepted Christ
- By immersion
- Scheduled throughout the year

👥 **Church Membership**
- Attend our membership class
- Learn about our beliefs and vision
- Become part of the church family

**Next Steps:**
1. Attend services regularly
2. Talk to Pastor or church leadership
3. Express your interest

Contact us: ${email} | ${phone}`
    }
  }
  };
};

/**
 * Search knowledge base for relevant answer
 * Prioritizes categories with more keyword matches and better relevance
 */
function searchKnowledge(query, content = null) {
  // Get content if not provided
  if (!content) {
    content = getContent();
  }
  
  // Build knowledge base with current content
  const knowledgeBase = buildKnowledgeBase(content);
  
  const lowerQuery = query.toLowerCase();
  const queryWords = lowerQuery.split(/\s+/);
  let bestMatch = null;
  let bestScore = 0;
  
  // Search through all categories and score matches
  for (const [category, data] of Object.entries(knowledgeBase)) {
    let score = 0;
    let matchedKeywords = [];
    let exactWordMatches = 0;
    
    // Count how many keywords match and their importance
    data.keywords.forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase();
      
      if (lowerQuery.includes(lowerKeyword)) {
        // Check if it's an exact word match (not just substring)
        const isExactWordMatch = queryWords.some(word => word === lowerKeyword);
        
        if (isExactWordMatch) {
          // Exact word matches get much higher scores
          score += lowerKeyword.length * 3;
          exactWordMatches++;
        } else {
          // Substring matches get base score
          score += lowerKeyword.length;
        }
        
        matchedKeywords.push(keyword);
      }
    });
    
    // Bonus for multiple keyword matches (indicates higher relevance)
    if (matchedKeywords.length > 1) {
      score += matchedKeywords.length * 5;
    }
    
    // Update best match if this category has a higher score
    if (score > bestScore && data.answers.general) {
      bestScore = score;
      bestMatch = {
        category,
        answer: data.answers.general,
        hasMore: Object.keys(data.answers).length > 1,
        matchedKeywords,
        exactWordMatches
      };
    }
  }
  
  return bestMatch;
}

/**
 * Get all FAQs for a category
 */
function getCategoryFAQs(category, content = null) {
  if (!content) {
    content = getContent();
  }
  const knowledgeBase = buildKnowledgeBase(content);
  return knowledgeBase[category] || null;
}

/**
 * Get quick action responses
 */
function getQuickActions(content = null) {
  if (!content) {
    content = getContent();
  }
  const knowledgeBase = buildKnowledgeBase(content);
  return {
    'Service Times': knowledgeBase.serviceTimes.answers.general,
    'Location': knowledgeBase.location.answers.general,
    'I\'m New': knowledgeBase.visitors.answers.general,
    'Kids Programs': knowledgeBase.kids.answers.general,
    'Contact Us': knowledgeBase.contact.answers.general
  };
}

module.exports = {
  buildKnowledgeBase,
  searchKnowledge,
  getCategoryFAQs,
  getQuickActions
};

