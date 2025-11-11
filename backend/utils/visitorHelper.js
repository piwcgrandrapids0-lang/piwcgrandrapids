/**
 * Visitor Helper Utility Library
 * Specialized functions for helping new visitors
 * Provides context-aware assistance and guidance
 */

const { churchInfo } = require('./churchInfo');

/**
 * Generate personalized welcome message for visitors
 */
function generateWelcomeMessage(visitorContext = {}) {
  const { isFirstTime, hasKids, interest } = visitorContext;
  
  let message = `Welcome to PIWC Grand Rapids! 🎉\n\n`;
  
  if (isFirstTime) {
    message += `We're so excited you're interested in visiting! Here's what you need to know:\n\n`;
  }
  
  message += `**Sunday Service:**\n`;
  message += `⏰ ${churchInfo.services.sunday.time}\n`;
  message += `📍 ${churchInfo.address.full}\n\n`;
  
  if (hasKids) {
    message += `**Great news!** We have PIWC Kids programs for children during the service. Your kids will be safe and have fun!\n\n`;
  }
  
  message += `**What to Expect:**\n`;
  message += `- Dress comfortably (come as you are!)\n`;
  message += `- Service lasts about 2 hours\n`;
  message += `- Friendly greeters will welcome you\n`;
  message += `- Free parking available\n\n`;
  
  if (interest) {
    message += `**You mentioned interest in ${interest}** - We'd love to connect you with that ministry!\n\n`;
  }
  
  message += `Have more questions? Just ask! 😊`;
  
  return message;
}

/**
 * Get directions based on starting location
 */
function getDirectionsFrom(location) {
  const directions = {
    'grand rapids': {
      route: 'US-196 West toward Holland',
      exit: '28th Ave in Hudsonville',
      time: 'About 20 minutes',
      details: 'Take US-196 W, exit at 28th Ave, turn right. Church on your right.'
    },
    'holland': {
      route: 'US-196 East toward Grand Rapids',
      exit: '28th Ave in Hudsonville',
      time: 'About 15 minutes',
      details: 'Take US-196 E, exit at 28th Ave, turn left. Church on your right.'
    },
    'jenison': {
      route: 'Chicago Dr/M-45',
      exit: '28th Ave',
      time: 'About 10 minutes',
      details: 'Take Chicago Dr west, turn left on 28th Ave. Church on your left.'
    },
    'default': {
      route: 'Use GPS navigation',
      address: churchInfo.address.full,
      time: 'Varies',
      details: `Navigate to ${churchInfo.address.full}. Free parking on-site.`
    }
  };
  
  const locationKey = location.toLowerCase().replace(/\s+/g, ' ').trim();
  return directions[locationKey] || directions['default'];
}

/**
 * Get arrival checklist for first-time visitors
 */
function getArrivalChecklist() {
  return {
    before: [
      {
        time: '15 minutes before',
        task: 'Arrive early for parking',
        tip: 'Gives you time to find a spot and walk in comfortably'
      },
      {
        time: '10 minutes before',
        task: 'Check in kids (if applicable)',
        tip: 'Visit the PIWC Kids check-in area'
      },
      {
        time: '5 minutes before',
        task: 'Find a seat',
        tip: 'Ushers can help you find seating'
      }
    ],
    during: [
      {
        task: 'Enjoy worship',
        tip: 'Feel free to participate as you\'re comfortable'
      },
      {
        task: 'Listen to the message',
        tip: 'Take notes if you like!'
      },
      {
        task: 'No pressure to give',
        tip: 'Offering is for members, not guests'
      }
    ],
    after: [
      {
        task: 'Grab refreshments',
        tip: 'Usually available in fellowship hall'
      },
      {
        task: 'Meet the pastor',
        tip: 'He loves connecting with new faces!'
      },
      {
        task: 'Pick up kids',
        tip: 'Get a report on how they did'
      },
      {
        task: 'Fill out connection card',
        tip: 'Helps us follow up and answer questions'
      }
    ]
  };
}

/**
 * Answer common "What if" questions
 */
function answerWhatIf(scenario) {
  const scenarios = {
    'late': {
      question: "What if I'm running late?",
      answer: "No problem! Come in quietly and an usher will help you find a seat. We'd rather you come late than not at all! 😊"
    },
    'alone': {
      question: "What if I come alone?",
      answer: "Many people come alone! Our greeters and welcome team will make sure you feel welcomed. You'll also meet friendly people who'd love to chat during fellowship time."
    },
    'baby cries': {
      question: "What if my baby cries during service?",
      answer: "We have a nursery for infants and young children! But if you prefer to keep your baby with you, we have a cry room where you can still hear the service."
    },
    'dont like it': {
      question: "What if I don't like it?",
      answer: "We hope you'll love it, but we understand church fit is important! No pressure to come back. But we'd love to hear your feedback to understand how we can improve."
    },
    'know nobody': {
      question: "What if I don't know anybody?",
      answer: "You're about to! Our greeters, ushers, and welcome team are specifically there to help new faces feel at home. We'll introduce you around if you'd like."
    },
    'not pentecostal': {
      question: "What if I'm not Pentecostal?",
      answer: "You're still welcome! Many of our members come from different backgrounds. We focus on Jesus and biblical teaching. Come check us out and see if it's a good fit!"
    }
  };
  
  const scenarioKey = scenario.toLowerCase();
  
  // Find matching scenario
  for (const [key, value] of Object.entries(scenarios)) {
    if (scenarioKey.includes(key.replace(' ', ''))) {
      return value;
    }
  }
  
  return {
    question: "Have a concern?",
    answer: `Feel free to contact us directly at ${churchInfo.contact.email} or ${churchInfo.contact.phone}. We're here to help! 😊`
  };
}

/**
 * Get ministry recommendations based on interests
 */
function recommendMinistry(interests = []) {
  const ministryMap = {
    'kids': 'PIWC Kids - Children\'s ministry with age-appropriate programs',
    'children': 'PIWC Kids - Children\'s ministry with age-appropriate programs',
    'youth': 'Youth Ministry - Dynamic programs for teens and young adults',
    'teen': 'Youth Ministry - Dynamic programs for teens and young adults',
    'men': 'Men\'s Ministry - Brotherhood, accountability, and spiritual growth',
    'women': 'Women\'s Ministry - Fellowship, prayer, and discipleship for women',
    'music': 'Worship Team - Use your musical gifts to lead worship',
    'worship': 'Worship Team - Use your musical gifts to lead worship',
    'prayer': 'Intercessory Prayer - Stand in the gap through prayer',
    'serve': 'Multiple opportunities! Ushering, hospitality, tech, and more',
    'outreach': 'Outreach & Missions - Share the Gospel locally and globally',
    'missions': 'Outreach & Missions - Share the Gospel locally and globally'
  };
  
  const recommendations = [];
  
  interests.forEach(interest => {
    const key = interest.toLowerCase();
    for (const [keyword, ministry] of Object.entries(ministryMap)) {
      if (key.includes(keyword)) {
        if (!recommendations.includes(ministry)) {
          recommendations.push(ministry);
        }
      }
    }
  });
  
  if (recommendations.length === 0) {
    return "We have ministries for all ages and interests! Contact us to find your perfect fit.";
  }
  
  return `Based on your interests, you might enjoy:\n\n${recommendations.map(r => `• ${r}`).join('\n')}`;
}

/**
 * Generate follow-up actions for visitors
 */
function suggestNextSteps(visitorStage) {
  const stages = {
    'considering': [
      '1. Check out our "I\'m New" page on the website',
      '2. Watch a sermon online to get a feel for our teaching',
      '3. Plan to visit this Sunday at 12:30 PM',
      '4. Arrive 15 minutes early for a stress-free experience'
    ],
    'visited once': [
      '1. Come back this Sunday - second visit is usually more comfortable!',
      '2. Fill out a connection card to stay in touch',
      '3. Meet with a pastor or staff member if you have questions',
      '4. Explore our ministries to find where you fit'
    ],
    'regular attendee': [
      '1. Consider joining a small group or ministry',
      '2. Attend our membership class to learn more',
      '3. Look for ways to serve and get involved',
      '4. Connect with other members for deeper relationships'
    ],
    'ready to commit': [
      '1. Speak with a pastor about membership',
      '2. Attend our membership class',
      '3. Consider baptism if you haven\'t been baptized',
      '4. Find a ministry team to serve on'
    ]
  };
  
  return stages[visitorStage] || stages['considering'];
}

module.exports = {
  generateWelcomeMessage,
  getDirectionsFrom,
  getArrivalChecklist,
  answerWhatIf,
  recommendMinistry,
  suggestNextSteps
};

