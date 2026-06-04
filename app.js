/* ==========================================
   RUCHI FOOTBALL EVENT 2026 - SHARED STATE
   ========================================== */

// --- Global State ---
const state = {
  user: {
    name: "",
    phone: "",
    email: "",
    location: "",
    jerseyNumber: 10, // User favorite jersey number
    supportingCountry: "",
    registered: false,
    personalBest: {
      penalty: 0
    }
  },
  
  // Hardcoded Top Scorers (Fidelity & Simulation)
  individualLeaderboard: [
    { rank: 1, name: "Mbappé Fanatic", country: "France", flag: "🇫🇷", score: 4100, isUser: false },
    { rank: 2, name: "Samba Striker", country: "Brazil", flag: "🇧🇷", score: 3850, isUser: false },
    { rank: 3, name: "Messi Magic", country: "Argentina", flag: "🇦🇷", score: 3600, isUser: false },
    { rank: 4, name: "Three Lions", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: 3200, isUser: false },
    { rank: 5, name: "El Matador", country: "Spain", flag: "🇪🇸", score: 2950, isUser: false },
    { rank: 6, name: "Nippon Blue", country: "Japan", flag: "🇯🇵", score: 2700, isUser: false },
    { rank: 7, name: "Deutscher Kaiser", country: "Germany", flag: "🇩🇪", score: 2450, isUser: false },
    { rank: 8, name: "Star Spangled", country: "USA", flag: "🇺🇸", score: 2200, isUser: false },
    { rank: 9, name: "Koke Goal", country: "Spain", flag: "🇪🇸", score: 1900, isUser: false },
    { rank: 10, name: "Gaucho Kid", country: "Argentina", flag: "🇦🇷", score: 1750, isUser: false },
    { rank: 11, name: "Seleção Wizard", country: "Brazil", flag: "🇧🇷", score: 1600, isUser: false },
    { rank: 12, name: "Paris Express", country: "France", flag: "🇫🇷", score: 1400, isUser: false },
    { rank: 13, name: "London Calling", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: 1250, isUser: false },
    { rank: 14, name: "Berlin Engine", country: "Germany", flag: "🇩🇪", score: 1100, isUser: false },
    { rank: 15, name: "Yankee Doodle", country: "USA", flag: "🇺🇸", score: 950, isUser: false }
  ],
  
  // Country stand-alone scores
  countryLeaderboard: [
    { rank: 1, country: "Brazil", flag: "🇧🇷", score: 15200, supporters: 120 },
    { rank: 2, country: "Argentina", flag: "🇦🇷", score: 14800, supporters: 110 },
    { rank: 3, country: "France", flag: "🇫🇷", score: 13100, supporters: 90 },
    { rank: 4, country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: 12450, supporters: 85 },
    { rank: 5, country: "Germany", flag: "🇩🇪", score: 11900, supporters: 80 },
    { rank: 6, country: "Spain", flag: "🇪🇸", score: 10500, supporters: 75 },
    { rank: 7, country: "Japan", flag: "🇯🇵", score: 9800, supporters: 68 },
    { rank: 8, country: "USA", flag: "🇺🇸", score: 8900, supporters: 60 }
  ],

  // AI Photo Gallery Submissions (synchronized in localStorage)
  galleryItems: []
};

// --- Country Flag Emoji Helper ---
const countryFlags = {
  "Argentina": "🇦🇷",
  "Brazil": "🇧🇷",
  "Germany": "🇩🇪",
  "France": "🇫🇷",
  "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Spain": "🇪🇸",
  "Japan": "🇯🇵",
  "USA": "🇺🇸"
};

const countryFlagCDN = {
  "Argentina": "ar",
  "Brazil": "br",
  "Germany": "de",
  "France": "fr",
  "England": "gb-eng",
  "Spain": "es",
  "Japan": "jp",
  "USA": "us"
};

const storagePrefix = "ruchi_event_";
const legacyStoragePrefix = "ru" + "cchi_event_";
const countryBaseScores = state.countryLeaderboard.map(country => ({ ...country }));
const languageStorageKey = `${storagePrefix}language`;
let currentLanguage = localStorage.getItem(languageStorageKey) || "en";

const bnText = {
  "Register Now": "এখনই রেজিস্টার করুন",
  "Dashboard": "ড্যাশবোর্ড",
  "Home": "হোম",
  "Campaign": "ক্যাম্পেইন",
  "Register": "রেজিস্টার",
  "Games": "গেমস",
  "Leaderboard": "লিডারবোর্ড",
  "Photo Booth": "ফটো বুথ",
  "AI Photo Booth": "এআই ফটো বুথ",
  "Locked": "লকড",
  "Profile": "প্রোফাইল",
  "Standings": "স্ট্যান্ডিংস",
  "Booth": "বুথ",
  "Score for Your Nation": "আপনার দেশের জন্য স্কোর করুন",
  "Lead the Board": "লিডারবোর্ডে এগিয়ে যান",
  "Register, support your favorite country, play exciting games, earn points, and lead your team to the top of the global standings.": "রেজিস্টার করুন, পছন্দের দেশকে সাপোর্ট করুন, মজার গেম খেলুন, পয়েন্ট অর্জন করুন এবং আপনার দলকে গ্লোবাল স্ট্যান্ডিংসের শীর্ষে তুলুন।",
  "Register Now âš¡": "এখনই রেজিস্টার করুন",
  "Explore Games ðŸŽ®": "গেমস দেখুন",
  "Days": "দিন",
  "Hrs": "ঘণ্টা",
  "Min": "মিনিট",
  "Sec": "সেকেন্ড",
  "Campaign Journey": "ক্যাম্পেইন জার্নি",
  "Follow these simple steps to play, support your team, and win awesome sports rewards.": "খেলতে, আপনার দলকে সাপোর্ট করতে এবং দারুণ স্পোর্টস রিওয়ার্ড জিততে এই সহজ ধাপগুলো অনুসরণ করুন।",
  "Register": "রেজিস্টার",
  "Fill out your details to activate your player card.": "আপনার প্লেয়ার কার্ড চালু করতে তথ্য পূরণ করুন।",
  "Select Country": "দেশ বাছাই করুন",
  "Support a World Cup 2026 team visually.": "ওয়ার্ল্ড কাপ ২০২৬-এর একটি দলকে সাপোর্ট করুন।",
  "Play Games": "গেম খেলুন",
  "Play the Penalty Shootout Challenge.": "পেনাল্টি শুটআউট চ্যালেঞ্জ খেলুন।",
  "Earn Points": "পয়েন্ট অর্জন করুন",
  "Score goals and gather coins to stack up points.": "গোল করে পয়েন্ট বাড়ান।",
  "Score goals to stack up your personal best score.": "গোল করে আপনার পার্সোনাল বেস্ট স্কোর বাড়ান।",
  "Leaderboards": "লিডারবোর্ড",
  "Climb individual ranks and push your team higher.": "নিজের র‍্যাঙ্ক বাড়ান এবং দলকে আরও ওপরে তুলুন।",
  "Generate styled campaign cards and share them.": "স্টাইলিশ ক্যাম্পেইন কার্ড বানিয়ে শেয়ার করুন।",
  "Win Rewards": "রিওয়ার্ড জিতুন",
  "Top scorers score real Ruchi merchandise!": "টপ স্কোরাররা জিতবেন আসল রুচি মার্চেন্ডাইজ!",
  "Learn More & View Rewards ðŸ†": "আরও জানুন ও রিওয়ার্ড দেখুন",
  "Frequently Asked Questions": "সচরাচর জিজ্ঞাসা",
  "Got questions about the Ruchi Campaign? Here is everything you need to know.": "রুচি ক্যাম্পেইন নিয়ে প্রশ্ন আছে? প্রয়োজনীয় সব তথ্য এখানে।",
  "How do I register?": "আমি কীভাবে রেজিস্টার করব?",
  "Can I change my supporting country?": "আমি কি সাপোর্ট করা দেশ বদলাতে পারব?",
  "How are scores calculated?": "স্কোর কীভাবে হিসাব করা হয়?",
  "How many attempts can I make?": "আমি কতবার চেষ্টা করতে পারব?",
  "Contact Information": "যোগাযোগের তথ্য",
  "Bringing fans closer to the action of the FIFA World Cup 2026. Register, compete, play, and win with Ruchi Football Fever.": "ফিফা ওয়ার্ল্ড কাপ ২০২৬-এর উত্তেজনার আরও কাছে ভক্তদের নিয়ে আসছে রুচি ফুটবল ফিভার। রেজিস্টার করুন, প্রতিযোগিতা করুন, খেলুন এবং জিতুন।",
  "© 2026 Ruchi Football Campaign. All rights reserved.": "© ২০২৬ রুচি ফুটবল ক্যাম্পেইন। সর্বস্বত্ব সংরক্ষিত।",
  "The Campaign Journey": "ক্যাম্পেইন জার্নি",
  "Your path to soccer glory and exclusive rewards. Learn how you can play and lead your team to the top.": "ফুটবল গৌরব আর এক্সক্লুসিভ রিওয়ার্ডের পথে আপনার যাত্রা। কীভাবে খেলবেন এবং দলকে শীর্ষে তুলবেন, জেনে নিন।",
  "Campaign Reward Pools": "ক্যাম্পেইন রিওয়ার্ড পুল",
  "Top 3 Scorers (Campaign Finalists)": "টপ ৩ স্কোরার (ক্যাম্পেইন ফাইনালিস্ট)",
  "Exclusive Ruchi Golden Football, Customized Official Team Jersey with gold stitching, and VIP pass to the Football Event 2026 Finals.": "এক্সক্লুসিভ রুচি গোল্ডেন ফুটবল, গোল্ড স্টিচিংসহ কাস্টমাইজড অফিসিয়াল টিম জার্সি এবং ফুটবল ইভেন্ট ২০২৬ ফাইনালের ভিআইপি পাস।",
  "Country Supporters Draw": "কান্ট্রি সাপোর্টার্স ড্র",
  "When the tournament ends, 50 random registered supporters of the #1 ranked country on our Leaderboard will win official sports merch sets.": "টুর্নামেন্ট শেষে লিডারবোর্ডে #১ র‍্যাঙ্ক করা দেশের ৫০ জন র‍্যান্ডম রেজিস্টার্ড সাপোর্টার জিতবেন অফিসিয়াল স্পোর্টস মার্চ সেট।",
  "Weekly Leaderboard Triumphs": "সাপ্তাহিক লিডারবোর্ড বিজয়",
  "The highest scorer of each week receives a branded Ruchi soccer jersey and matching professional goalkeeper gloves.": "প্রতি সপ্তাহের সর্বোচ্চ স্কোরার পাবেন ব্র্যান্ডেড রুচি সকার জার্সি এবং ম্যাচিং প্রফেশনাল গোলকিপার গ্লাভস।",
  "Register & Play Now ðŸ†": "এখনই রেজিস্টার করে খেলুন",
  "Explore arcade ðŸŽ®": "আর্কেড দেখুন",
  "Register & Play": "রেজিস্টার করুন ও খেলুন",
  "Unlock access to the games, choose your country, and record your high scores.": "গেমে অ্যাক্সেস আনলক করুন, দেশ বাছাই করুন এবং আপনার হাই স্কোর রেকর্ড করুন।",
  "Full Name": "পূর্ণ নাম",
  "Phone Number": "ফোন নম্বর",
  "Email Address": "ইমেইল ঠিকানা",
  "Area / Location": "এলাকা / লোকেশন",
  "Choose Your Jersey Number": "আপনার জার্সি নম্বর বাছাই করুন",
  "Choose your team": "আপনার দল বাছাই করুন",
  "Every point you earn will support this country in the standings.": "আপনার অর্জিত প্রতিটি পয়েন্ট স্ট্যান্ডিংসে এই দেশকে সাপোর্ট করবে।",
  "Support": "সাপোর্ট",
  "I accept the terms and conditions of Ruchi Football Fever 2026 campaign.": "আমি রুচি ফুটবল ফিভার ২০২৬ ক্যাম্পেইনের শর্তাবলি মেনে নিচ্ছি।",
  "Complete Registration & Play": "রেজিস্ট্রেশন সম্পন্ন করে খেলুন",
  "Jersey": "জার্সি",
  "Edit Details âœï¸": "তথ্য এডিট করুন",
  "Ruchi Photobooth": "রুচি ফটোবুথ",
  "Ruchi Gallery": "রুচি গ্যালারি",
  "Event Arcade": "ইভেন্ট আর্কেড",
  "Challenge yourself in high-octane mini-game, rack up points, and support your nation's rank.": "রোমাঞ্চকর মিনি-গেমে নিজেকে চ্যালেঞ্জ করুন, পয়েন্ট তুলুন এবং আপনার দেশের র‍্যাঙ্কে সাপোর্ট দিন।",
  "Back to Dashboard": "ড্যাশবোর্ডে ফিরুন",
  "Action": "অ্যাকশন",
  "Penalty Shootout Challenge": "পেনাল্টি শুটআউট চ্যালেঞ্জ",
  "Step up to the penalty spot! Take on the goalkeeper, target the corners of the goal net, and fire shots past the defender within the 30-second time limit.": "পেনাল্টি স্পটে দাঁড়ান! গোলকিপারকে ফাঁকি দিন, গোল নেটের কর্নার টার্গেট করুন এবং ৩০ সেকেন্ডের মধ্যে শট নিন।",
  "Time Limit: 30 seconds": "সময় সীমা: ৩০ সেকেন্ড",
  "Each goal scores 100 points": "প্রতিটি গোলে ১০০ পয়েন্ট",
  "Top corner goals score 150 points (Bonus!)": "টপ কর্নার গোলে ১৫০ পয়েন্ট (বোনাস!)",
  "Goalkeeper saves block your streak": "গোলকিপারের সেভ আপনার স্ট্রিক থামাবে",
  "Play Penalty Challenge âš½": "পেনাল্টি চ্যালেঞ্জ খেলুন",
  "Ready to Shoot?": "শট নিতে প্রস্তুত?",
  "Use your mouse/touch to aim and click on the goal openings. Beat the goalkeeper before time runs out!": "মাউস/টাচ দিয়ে লক্ষ্য করুন এবং গোলের খোলা জায়গায় ক্লিক করুন। সময় শেষ হওয়ার আগে গোলকিপারকে হারান!",
  "Kick Off ðŸš€": "কিক অফ",
  "Game Finished!": "গেম শেষ!",
  "Your Score": "আপনার স্কোর",
  "Country Boost": "দেশের বুস্ট",
  "Play Again ðŸ”„": "আবার খেলুন",
  "Standings ðŸ“Š": "স্ট্যান্ডিংস",
  "AI Photo Booth ðŸ“¸": "এআই ফটো বুথ",
  "Live Scoreboards": "লাইভ স্কোরবোর্ড",
  "Watch individuals clash for top scorer glory, and see which nation leads the global charts.": "টপ স্কোরারের লড়াই দেখুন এবং কোন দেশ গ্লোবাল চার্টে এগিয়ে আছে তা জানুন।",
  "Top 15 Scorers": "টপ ১৫ স্কোরার",
  "Top Countries": "টপ দেশ",
  "Rank": "র‍্যাঙ্ক",
  "Player": "প্লেয়ার",
  "Supporting Team": "সাপোর্টিং টিম",
  "Total Score": "মোট স্কোর",
  "Country": "দেশ",
  "Combined Score & Progress": "সম্মিলিত স্কোর ও প্রগ্রেস",
  "Supporters": "সাপোর্টার",
  "Fans": "ফ্যান",
  "Transform your look into a premium campaign poster. Put on your country colors, stand under stadium lights, and share the hype.": "আপনার লুককে প্রিমিয়াম ক্যাম্পেইন পোস্টারে রূপ দিন। দেশের রঙে স্টেডিয়াম লাইটের নিচে দাঁড়ান এবং হাইপ শেয়ার করুন।",
  "Choose Photo Source": "ছবির সোর্স বাছাই করুন",
  "Upload Image": "ছবি আপলোড করুন",
  "Use Camera": "ক্যামেরা ব্যবহার করুন",
  "Snap Photo ðŸ“¸": "ছবি তুলুন",
  "Select Poster Template": "পোস্টার টেমপ্লেট বাছাই করুন",
  "Stadium Champion": "স্টেডিয়াম চ্যাম্পিয়ন",
  "Country Fan Poster": "কান্ট্রি ফ্যান পোস্টার",
  "Football Jersey": "ফুটবল জার্সি",
  "Trophy Celeb": "ট্রফি সেলিব্রেশন",
  "Match Day Card": "ম্যাচ ডে কার্ড",
  "Process & Render": "প্রসেস ও রেন্ডার",
  "Generate AI Football Photo âœ¨": "এআই ফুটবল ছবি তৈরি করুন",
  "Upload a photo or snap a picture and select a theme template to see your premium AI campaign poster generated here.": "একটি ছবি আপলোড করুন বা ছবি তুলুন, তারপর থিম টেমপ্লেট বাছাই করুন। আপনার প্রিমিয়াম এআই ক্যাম্পেইন পোস্টার এখানে দেখা যাবে।",
  "Download Poster ðŸ’¾": "পোস্টার ডাউনলোড করুন",
  "Add to Gallery ðŸ“£": "গ্যালারিতে যোগ করুন",
  "Social Fan Gallery": "সোশ্যাল ফ্যান গ্যালারি",
  "Check out campaign cards created by supporters worldwide. Filter by country and like your favorites!": "বিশ্বজুড়ে সাপোর্টারদের তৈরি ক্যাম্পেইন কার্ড দেখুন। দেশ অনুযায়ী ফিল্টার করুন এবং পছন্দেরগুলোতে লাইক দিন!",
  "All Countries": "সব দেশ",
  "Arena Locked": "আর্কেড লকড",
  "Access to the Event Arcade mini-games is restricted to registered campaign players.": "ইভেন্ট আর্কেড মিনি-গেমে অ্যাক্সেস শুধু রেজিস্টার্ড ক্যাম্পেইন প্লেয়ারদের জন্য।",
  "Save your scores to the live leaderboard": "আপনার স্কোর লাইভ লিডারবোর্ডে সেভ করুন",
  "Represent your country in national standings": "ন্যাশনাল স্ট্যান্ডিংসে আপনার দেশকে প্রতিনিধিত্ব করুন",
  "Enter weekly draws for official merchandise": "অফিসিয়াল মার্চেন্ডাইজের সাপ্তাহিক ড্রতে অংশ নিন",
  "Register Now & Unlock âš¡": "রেজিস্টার করে আনলক করুন",
  "Photo Booth Locked": "ফটো বুথ লকড",
  "Access to the AI Fan Photo Booth is restricted to registered campaign players.": "এআই ফ্যান ফটো বুথে অ্যাক্সেস শুধু রেজিস্টার্ড ক্যাম্পেইন প্লেয়ারদের জন্য।",
  "Generate premium customized country team jersey posters": "প্রিমিয়াম কাস্টমাইজড কান্ট্রি টিম জার্সি পোস্টার তৈরি করুন",
  "Post your cards live to the shared Social Fan Gallery": "শেয়ারড সোশ্যাল ফ্যান গ্যালারিতে আপনার কার্ড পোস্ট করুন",
  "Download HD posters with custom jersey numbers": "কাস্টম জার্সি নম্বরসহ এইচডি পোস্টার ডাউনলোড করুন",
  "Enter your full name": "আপনার পূর্ণ নাম লিখুন",
  "Enter your phone number": "আপনার ফোন নম্বর লিখুন",
  "Enter your email": "আপনার ইমেইল লিখুন",
  "e.g. Dhaka, Bangladesh": "যেমন: ঢাকা, বাংলাদেশ",
  "Enter your favorite jersey number (1-99)": "আপনার পছন্দের জার্সি নম্বর লিখুন (১-৯৯)"
};

function translate(value) {
  if (currentLanguage !== "bn") return value;
  return bnText[value] || value;
}

window.t = translate;
window.getAppLanguage = () => currentLanguage;

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function initLanguageSupport() {
  document.documentElement.lang = currentLanguage === "bn" ? "bn" : "en";
  document.body.classList.toggle("lang-bn", currentLanguage === "bn");
  injectLanguageToggle();
  applyPageTranslations();
}

function injectLanguageToggle() {
  const navbar = document.getElementById("navbar");
  const cta = navbar ? navbar.querySelector(".nav-cta") : null;
  if (!navbar || !cta || navbar.querySelector(".language-toggle")) return;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "language-toggle";
  toggle.setAttribute("aria-label", "Switch language");
  toggle.addEventListener("click", () => {
    currentLanguage = currentLanguage === "bn" ? "en" : "bn";
    localStorage.setItem(languageStorageKey, currentLanguage);
    window.location.reload();
  });
  navbar.insertBefore(toggle, cta);
  syncLanguageToggle();
}

function syncLanguageToggle() {
  const toggle = document.querySelector(".language-toggle");
  if (!toggle) return;
  toggle.textContent = currentLanguage === "bn" ? "EN" : "বাংলা";
  toggle.setAttribute("aria-pressed", currentLanguage === "bn" ? "true" : "false");
}

function applyPageTranslations() {
  if (currentLanguage !== "bn") return;

  const textNodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "CANVAS", "SVG"].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      return normalizeText(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });

  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach(node => {
    const original = normalizeText(node.nodeValue);
    const translated = bnText[original];
    if (translated) node.nodeValue = node.nodeValue.replace(original, translated);
  });

  document.querySelectorAll("input[placeholder], textarea[placeholder]").forEach(input => {
    const placeholder = input.getAttribute("placeholder");
    if (bnText[placeholder]) input.setAttribute("placeholder", bnText[placeholder]);
  });

  const title = normalizeText(document.title);
  if (bnText[title]) document.title = bnText[title];
}

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  loadStateFromLocalStorage();
  initLanguageSupport();
  initCountdown();
  renderLeaderboards();
  injectDesktopNav();
  initNavbarScroll();
  setupInitialGalleryMockURLs();
  syncNavbarProfileButton();
  enhanceInteractiveControls();
  initParallax();
  initScrollReveal();
  syncSportsTicker();
  checkRouteGuards();
  injectMobileBottomNav();
  applyPageTranslations();
});

// --- Sync Navbar Profile Button ---
function syncNavbarProfileButton() {
  const ctaContainer = document.querySelector(".nav-cta");
  if (ctaContainer) {
    if (state.user.registered) {
      ctaContainer.innerHTML = `
        <a href="registration.html" class="btn btn-secondary" style="padding: 10px 20px; font-size: 0.85rem;">${translate("Dashboard")}</a>
      `;
    } else {
      ctaContainer.innerHTML = `
        <a href="registration.html" class="btn btn-primary" style="padding: 10px 20px; font-size: 0.85rem;">${translate("Register Now")}</a>
      `;
    }
  }
  
  // Also sync the home page hero action button if it exists
  const heroActions = document.querySelector(".hero-actions");
  if (heroActions) {
    const regBtn = heroActions.querySelector("a[href='registration.html']");
    if (regBtn) {
      if (state.user.registered) {
        regBtn.innerText = translate("Dashboard");
      } else {
        regBtn.innerText = translate("Register Now");
      }
    }
  }
}

function injectDesktopNav() {
  const navbar = document.getElementById("navbar");
  if (!navbar || navbar.querySelector(".nav-links")) return;

  const currentFile = getCurrentFileName();
  const links = [
    { href: "index.html", label: translate("Home") },
    { href: "campaign.html", label: translate("Campaign") },
    { href: "registration.html", label: state.user.registered ? translate("Dashboard") : translate("Register") },
    { href: "games.html", label: translate("Games"), locked: !state.user.registered },
    { href: "leaderboard.html", label: translate("Leaderboard") },
    { href: "photobooth.html", label: translate("Photo Booth"), locked: !state.user.registered }
  ];

  const navList = document.createElement("ul");
  navList.className = "nav-links";
  navList.setAttribute("aria-label", "Primary navigation");
  navList.innerHTML = links.map(link => {
    const active = currentFile === link.href ? "active" : "";
    const ariaCurrent = active ? ` aria-current="page"` : "";
    const lock = link.locked ? `<span class="nav-lock" aria-label="Registration required">${translate("Locked")}</span>` : "";
    return `<li><a href="${link.href}" class="${active}"${ariaCurrent}>${link.label}${lock}</a></li>`;
  }).join("");

  const cta = navbar.querySelector(".nav-cta");
  navbar.insertBefore(navList, cta || null);
}

function refreshDesktopNav() {
  const navList = document.querySelector(".nav-links");
  if (navList) navList.remove();
  injectDesktopNav();
}

function getCurrentFileName() {
  const currentPath = window.location.pathname;
  return currentPath.substring(currentPath.lastIndexOf("/") + 1) || "index.html";
}

function showToast(message, type = "info") {
  const existing = document.querySelector(".app-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `app-toast toast-${type}`;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.textContent = translate(message);
  document.body.appendChild(toast);

  window.setTimeout(() => toast.classList.add("show"), 10);
  window.setTimeout(() => {
    toast.classList.remove("show");
    window.setTimeout(() => toast.remove(), 250);
  }, 3200);
}

function enhanceInteractiveControls() {
  document.querySelectorAll(".country-card, .booth-opt-btn, .theme-card").forEach(card => {
    if (!card.hasAttribute("tabindex")) card.setAttribute("tabindex", "0");
    if (!card.hasAttribute("role")) card.setAttribute("role", "button");
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.click();
      }
    });
  });
}

function getStoredValue(key) {
  return localStorage.getItem(`${storagePrefix}${key}`) || localStorage.getItem(`${legacyStoragePrefix}${key}`);
}

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn("Stored campaign data could not be loaded.", error);
    return fallback;
  }
}

function sanitizeText(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// --- Countdown Timer ---
function initCountdown() {
  if (!document.getElementById("days")) return; // Only run if countdown elements exist (Home Page)
  
  // Set date 30 days from now for demonstration purposes
  const countdownDate = new Date();
  countdownDate.setDate(countdownDate.getDate() + 30);
  
  const updateTimer = () => {
    const now = new Date().getTime();
    const distance = countdownDate - now;
    
    if (distance < 0) {
      clearInterval(interval);
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById("days").innerText = String(days).padStart(2, "0");
    document.getElementById("hours").innerText = String(hours).padStart(2, "0");
    document.getElementById("minutes").innerText = String(minutes).padStart(2, "0");
    document.getElementById("seconds").innerText = String(seconds).padStart(2, "0");
  };
  
  updateTimer();
  const interval = setInterval(updateTimer, 1000);
}

// --- Local Storage Management ---
function saveStateToLocalStorage() {
  localStorage.setItem(`${storagePrefix}user`, JSON.stringify(state.user));
  localStorage.setItem(`${storagePrefix}gallery`, JSON.stringify(state.galleryItems));
  
  // Also store leaderboard updates
  localStorage.setItem(`${storagePrefix}individuals`, JSON.stringify(state.individualLeaderboard));
  localStorage.setItem(`${storagePrefix}countries`, JSON.stringify(state.countryLeaderboard));
}

function loadStateFromLocalStorage() {
  const data = getStoredValue("user");
  if (data) {
    const storedUser = safeJsonParse(data, state.user);
    state.user = {
      ...state.user,
      ...storedUser,
      personalBest: {
        ...state.user.personalBest,
        ...(storedUser.personalBest || {})
      }
    };
    if (state.user.registered) {
      showRegistrationSuccess();
      updateArcadeHUDPersonalBest();
    }
  }
  
  const galleryData = getStoredValue("gallery");
  if (galleryData) {
    state.galleryItems = safeJsonParse(galleryData, []);
  }
  
  const indBoard = getStoredValue("individuals");
  if (indBoard) {
    state.individualLeaderboard = safeJsonParse(indBoard, state.individualLeaderboard);
  }
  
  const cntBoard = getStoredValue("countries");
  if (cntBoard) {
    state.countryLeaderboard = safeJsonParse(cntBoard, state.countryLeaderboard);
  }
}

// --- Registration Logic ---
window.selectCountry = function(element) {
  // Remove selected class from all cards
  const cards = document.querySelectorAll(".country-card");
  cards.forEach(c => c.classList.remove("selected"));
  
  // Select current
  element.classList.add("selected");
  const countryName = element.getAttribute("data-country");
  
  // Set hidden input
  const hiddenInput = document.getElementById("selected-country-val");
  if (hiddenInput) hiddenInput.value = countryName;
  showToast(currentLanguage === "bn" ? `${countryName} আপনার দল হিসেবে বাছাই করা হয়েছে।` : `${countryName} selected as your team.`, "success");
};

// Avatar upload removed, Jersey Number field added instead

window.handleRegistration = function(event) {
  event.preventDefault();
  
  const name = sanitizeText(document.getElementById("reg-name").value);
  const phone = sanitizeText(document.getElementById("reg-phone").value);
  const email = sanitizeText(document.getElementById("reg-email").value);
  const location = sanitizeText(document.getElementById("reg-location").value);
  const jerseyNumber = document.getElementById("reg-jersey").value;
  const country = document.getElementById("selected-country-val").value;
  
  if (!country) {
    showToast(currentLanguage === "bn" ? "প্রথমে একটি সাপোর্টিং দেশ বাছাই করুন।" : "Please select a supporting country first.", "error");
    return;
  }

  if (!name || !phone || !email || !location) {
    showToast(currentLanguage === "bn" ? "রেজিস্ট্রেশনের সব ঘর পূরণ করুন।" : "Please complete all registration fields.", "error");
    return;
  }
  
  const wasAlreadyRegistered = state.user.registered;
  
  state.user.name = name;
  state.user.phone = phone;
  state.user.email = email;
  state.user.location = location;
  state.user.jerseyNumber = Math.min(99, Math.max(1, parseInt(jerseyNumber, 10) || 10));
  state.user.supportingCountry = country;
  state.user.registered = true;
  
  saveStateToLocalStorage();
  showRegistrationSuccess();
  updateLeaderboardScores();
  syncNavbarProfileButton();
  refreshDesktopNav();
  syncSportsTicker();
  
  if (wasAlreadyRegistered) {
    showToast(currentLanguage === "bn" ? "প্রোফাইলের তথ্য সফলভাবে আপডেট হয়েছে।" : "Profile details updated successfully.", "success");
  } else {
    showToast(currentLanguage === "bn" ? "রেজিস্ট্রেশন সেভ হয়েছে। আপনার ড্যাশবোর্ড প্রস্তুত।" : "Registration saved. Your dashboard is ready.", "success");
  }
  
  // Remove locks dynamically
  const bottomNav = document.querySelector(".mobile-bottom-nav");
  if (bottomNav) bottomNav.remove();
  injectMobileBottomNav();
  
  // Smooth scroll
  const successCard = document.getElementById("registration-success");
  if (successCard) successCard.scrollIntoView({ behavior: 'smooth' });
};

window.editRegistrationDetails = function() {
  const successCard = document.getElementById("registration-success");
  const regCard = document.getElementById("registration-card");
  if (!successCard || !regCard) return;
  
  successCard.style.display = "none";
  regCard.style.display = "block";
  
  // Show and update subpage-header
  const subpageHeader = document.querySelector(".subpage-header");
  if (subpageHeader) {
    subpageHeader.style.display = "block";
    const headerTitle = document.getElementById("reg-header-title");
    const headerDesc = document.getElementById("reg-header-desc");
    if (headerTitle) headerTitle.innerText = currentLanguage === "bn" ? "আপনার প্রোফাইল এডিট করুন" : "Edit Your Profile";
    if (headerDesc) headerDesc.innerText = currentLanguage === "bn" ? "আপনার তথ্য, পছন্দের জার্সি নম্বর এবং সাপোর্টিং টিম আপডেট করুন।" : "Update your details, favorite jersey number, and supporting team.";
  }
  
  const regSection = document.getElementById("registration");
  if (regSection) {
    regSection.classList.remove("dashboard-fullscreen");
    regSection.style.paddingTop = "50px";
  }
  
  // Pre-fill form fields
  document.getElementById("reg-name").value = state.user.name || "";
  document.getElementById("reg-phone").value = state.user.phone || "";
  document.getElementById("reg-email").value = state.user.email || "";
  document.getElementById("reg-location").value = state.user.location || "";
  document.getElementById("reg-jersey").value = state.user.jerseyNumber || 10;
  
  const hiddenCountry = document.getElementById("selected-country-val");
  if (hiddenCountry) {
    hiddenCountry.value = state.user.supportingCountry || "";
  }
  
  // Highlight the selected country card in the UI
  const cards = document.querySelectorAll(".country-card");
  cards.forEach(c => {
    if (c.getAttribute("data-country") === state.user.supportingCountry) {
      c.classList.add("selected");
    } else {
      c.classList.remove("selected");
    }
  });
  
  // Check the terms checkbox
  const termsCheckbox = document.getElementById("reg-terms");
  if (termsCheckbox) {
    termsCheckbox.checked = true;
  }
  
  // Update the submit button text
  const submitBtn = document.getElementById("reg-submit-btn");
  if (submitBtn) {
    submitBtn.innerText = currentLanguage === "bn" ? "তথ্য সেভ করে ফিরুন" : "Save Details & Return";
  }
  
  // Smooth scroll to header
  if (subpageHeader) {
    subpageHeader.scrollIntoView({ behavior: 'smooth' });
  } else {
    regCard.scrollIntoView({ behavior: 'smooth' });
  }
};

function showRegistrationSuccess() {
  const regCard = document.getElementById("registration-card");
  const successCard = document.getElementById("registration-success");
  if (!regCard || !successCard) return;
  
  regCard.style.display = "none";
  successCard.style.display = "block";
  
  // Hide subpage-header (Register & Play)
  const subpageHeader = document.querySelector(".subpage-header");
  if (subpageHeader) {
    subpageHeader.style.display = "none";
  }
  
  const regSection = document.getElementById("registration");
  if (regSection) {
    regSection.classList.add("dashboard-fullscreen");
    regSection.style.paddingTop = "110px";
  }
  
  document.getElementById("player-card-name").innerText = state.user.name;
  const flag = countryFlags[state.user.supportingCountry] || "⚽";
  document.getElementById("player-card-team").innerText = `${flag} ${state.user.supportingCountry}`;
  
  const cardJersey = document.getElementById("player-card-jersey");
  if (cardJersey) cardJersey.innerText = `#${state.user.jerseyNumber}`;
  
  // Reset form submit button text
  const submitBtn = document.getElementById("reg-submit-btn");
  if (submitBtn) {
    submitBtn.innerText = translate("Complete Registration & Play");
  }
}


function updateArcadeHUDPersonalBest() {
  const pbPenalty = document.getElementById("personal-best-penalty");
  if (pbPenalty) pbPenalty.innerText = `PB: ${state.user.personalBest.penalty}`;
}

// --- Leaderboard Recalculation ---
function updateLeaderboardScores() {
  if (!state.user.registered) return;
  
  const userTotalScore = state.user.personalBest.penalty;
  const flag = countryFlags[state.user.supportingCountry] || "⚽";
  
  // 1. Update/Add Individual Leaderboard
  const userRowIndex = state.individualLeaderboard.findIndex(p => p.isUser === true);
  
  if (userRowIndex !== -1) {
    state.individualLeaderboard[userRowIndex].score = userTotalScore;
    state.individualLeaderboard[userRowIndex].name = state.user.name + " (You)";
    state.individualLeaderboard[userRowIndex].country = state.user.supportingCountry;
    state.individualLeaderboard[userRowIndex].flag = flag;
  } else {
    state.individualLeaderboard.push({
      rank: 0, // calculated below
      name: state.user.name + " (You)",
      country: state.user.supportingCountry,
      flag: flag,
      score: userTotalScore,
      isUser: true
    });
  }
  
  // Sort leaderboard descending
  state.individualLeaderboard.sort((a, b) => b.score - a.score);
  
  // Re-assign ranks
  state.individualLeaderboard.forEach((player, idx) => {
    player.rank = idx + 1;
  });
  
  // 2. Rebuild country scores from stable base values plus the user's current contribution.
  const refreshedCountries = countryBaseScores.map(country => ({ ...country }));
  const countryIndex = refreshedCountries.findIndex(c => c.country === state.user.supportingCountry);
  if (countryIndex !== -1) {
    const currentContribution = state.user.personalBest.penalty || 0;
    refreshedCountries[countryIndex].score += Math.floor(currentContribution / 10);
    refreshedCountries[countryIndex].supporters += 1;
    
    // Sort and re-rank
    state.countryLeaderboard = refreshedCountries.sort((a, b) => b.score - a.score);
    state.countryLeaderboard.forEach((c, idx) => {
      c.rank = idx + 1;
    });
  }
  
  saveStateToLocalStorage();
  renderLeaderboards();
}

window.switchLeaderboard = function(tab) {
  const tabs = document.querySelectorAll(".leaderboard-tab-btn");
  if (tabs.length === 0) return;
  
  tabs.forEach(t => {
    t.classList.remove("active");
    t.setAttribute("aria-selected", "false");
  });
  
  const panels = document.querySelectorAll(".leaderboard-panel");
  panels.forEach(p => {
    p.classList.remove("active");
    p.setAttribute("hidden", "");
  });
  
  if (tab === "individual") {
    tabs[0].classList.add("active");
    tabs[0].setAttribute("aria-selected", "true");
    const panel = document.getElementById("panel-individual");
    if (panel) {
      panel.classList.add("active");
      panel.removeAttribute("hidden");
    }
  } else {
    tabs[1].classList.add("active");
    tabs[1].setAttribute("aria-selected", "true");
    const panel = document.getElementById("panel-country");
    if (panel) {
      panel.classList.add("active");
      panel.removeAttribute("hidden");
    }
  }
};

function renderLeaderboards() {
  const indBody = document.getElementById("individual-leaderboard-body");
  const cntBody = document.getElementById("country-leaderboard-body");
  
  if (!indBody && !cntBody) return; // Not on standings page
  
  if (indBody) {
    const isUserInTop15 = state.individualLeaderboard.slice(0, 15).some(p => p.isUser);
    if (!isUserInTop15 && state.user.registered) {
      const userItem = state.individualLeaderboard.find(p => p.isUser);
      if (userItem) {
        const displayBoard = state.individualLeaderboard.slice(0, 14);
        displayBoard.push(userItem);
        renderLeaderboardPanel("individual", displayBoard);
      }
    } else {
      renderLeaderboardPanel("individual", state.individualLeaderboard.slice(0, 15));
    }
  }
  
  if (cntBody) {
    renderLeaderboardPanel("country", state.countryLeaderboard);
  }
}

function renderLeaderboardPanel(type, data) {
  if (type === "individual") {
    const tbody = document.getElementById("individual-leaderboard-body");
    if (!tbody) return;
    tbody.innerHTML = "";
    
    data.forEach(item => {
      const row = document.createElement("tr");
      if (item.isUser) row.classList.add("user-row");
      
      let rankClass = "";
      if (item.rank === 1) rankClass = "rank-1";
      else if (item.rank === 2) rankClass = "rank-2";
      else if (item.rank === 3) rankClass = "rank-3";
      
      row.className = rankClass;
      
      const flagCode = countryFlagCDN[item.country] || "ar";
      const jerseyBadgeVal = item.isUser ? state.user.jerseyNumber : "10";
      const playerName = escapeHtml(item.name);
      const countryName = escapeHtml(item.country);
      
      row.innerHTML = `
        <td><span class="rank-badge">${item.rank}</span></td>
        <td>
          <div class="player-info">
            <span class="player-jersey-badge" style="background: var(--primary-neon); color: var(--text-dark); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 3px 6px rgba(0,0,0,0.3);">#${jerseyBadgeVal}</span>
            <span>${playerName}</span>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="https://flagcdn.com/w40/${flagCode}.png" alt="${countryName}" style="height: 16px; width: 24px; border-radius: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); object-fit: cover;">
            <span>${countryName}</span>
          </div>
        </td>
        <td class="score-col" style="text-align: right;">${item.score}</td>
      `;
      tbody.appendChild(row);
    });
  } else {
    const tbody = document.getElementById("country-leaderboard-body");
    if (!tbody) return;
    tbody.innerHTML = "";
    
    const maxScore = Math.max(...data.map(c => c.score));
    
    data.forEach(item => {
      const row = document.createElement("tr");
      let rankClass = "";
      if (item.rank === 1) rankClass = "rank-1";
      else if (item.rank === 2) rankClass = "rank-2";
      else if (item.rank === 3) rankClass = "rank-3";
      
      row.className = rankClass;
      const progressPercent = Math.min(100, Math.floor((item.score / maxScore) * 100));
      const flagCode = countryFlagCDN[item.country] || "ar";
      const countryName = escapeHtml(item.country);
      
      row.innerHTML = `
        <td><span class="rank-badge">${item.rank}</span></td>
        <td>
          <div class="country-info" style="display: flex; align-items: center; gap: 8px;">
            <img src="https://flagcdn.com/w40/${flagCode}.png" alt="${countryName}" style="height: 16px; width: 24px; border-radius: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); object-fit: cover;">
            <span>${countryName}</span>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center; justify-content: center;">
            <span style="font-family: var(--font-display); font-weight: 700; width: 60px;">${item.score}</span>
            <div class="score-progress-wrap" style="flex-grow: 1;">
              <div class="score-progress-bar" style="width: ${progressPercent}%;"></div>
            </div>
          </div>
        </td>
        <td style="text-align: right; color: var(--text-gray); font-weight: 700;">${item.supporters} ${translate("Fans")}</td>
      `;
      tbody.appendChild(row);
    });
  }
}

// --- Navigation Active Page Highlight ---
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }, { passive: true });
}


// --- Score Submission Callback ---
window.onGameFinished = function(gameKey, score) {
  let hasBeatenPB = false;
  if (gameKey === "penalty") {
    if (score > state.user.personalBest.penalty) {
      state.user.personalBest.penalty = score;
      hasBeatenPB = true;
    }
  }
  
  if (hasBeatenPB) {
    saveStateToLocalStorage();
    updateArcadeHUDPersonalBest();
    updateLeaderboardScores();
  }
  
  const boost = Math.floor(score / 10);
  
  // Update result overlay elements
  const resTitle = document.getElementById("result-title");
  const resUserScore = document.getElementById("result-user-score");
  const resCountryBoost = document.getElementById("result-country-boost");
  
  if (resTitle) resTitle.innerText = currentLanguage === "bn" ? "পেনাল্টি চ্যালেঞ্জ সম্পন্ন!" : "Penalty Challenge Completed!";
  if (resUserScore) resUserScore.innerText = score;
  if (resCountryBoost) resCountryBoost.innerText = `+${boost}`;
  
  const resNotice = document.getElementById("result-leaderboard-notice");
  if (resNotice) {
    if (state.user.registered) {
      const userRank = state.individualLeaderboard.findIndex(p => p.isUser) + 1;
      resNotice.innerHTML = `
        ${currentLanguage === "bn" ? "আপনার বর্তমান গ্লোবাল র‍্যাঙ্ক" : "You are currently ranked"} <span style='color: var(--primary-neon);'>#${userRank}</span>${currentLanguage === "bn" ? "!" : " globally!"}<br>
        ${currentLanguage === "bn" ? "মোট স্কোর" : "Total Score"}: ${state.user.personalBest.penalty} ${currentLanguage === "bn" ? "পয়েন্ট" : "pts"}
      `;
    } else {
      resNotice.innerHTML = `
        <span style='color: var(--accent-red);'>${currentLanguage === "bn" ? "স্কোর লিডারবোর্ডে সেভ হয়নি!" : "Score not saved to leaderboard!"}</span><br>
        <a href='registration.html' style='color: var(--primary-neon); text-decoration: underline;'>${currentLanguage === "bn" ? "এখানে রেজিস্টার করুন" : "Register here"}</a> ${currentLanguage === "bn" ? "আপনার দেশের জন্য স্কোর জমা দিতে।" : "to submit scores for your country!"}
      `;
    }
  }
  
  const resOverlay = document.getElementById("game-result-overlay");
  if (resOverlay) resOverlay.style.display = "flex";
};

// --- FAQ Accordions ---
window.toggleFaq = function(header) {
  const item = header.parentElement;
  const isActive = item.classList.contains("active");
  
  const items = document.querySelectorAll(".faq-item");
  items.forEach(i => i.classList.remove("active"));
  
  if (!isActive) {
    item.classList.add("active");
  }
};

// --- Social Gallery Mock Data Setup ---
function setupInitialGalleryMockURLs() {
  const m1 = document.getElementById("mock-gall-1");
  const m2 = document.getElementById("mock-gall-2");
  const m3 = document.getElementById("mock-gall-3");
  
  if (m1) m1.src = "assets/images/stadium_hero.png";
  if (m2) m2.src = "assets/images/stadium_hero.png";
  if (m3) m3.src = "assets/images/stadium_hero.png";
  
  const grid = document.getElementById("gallery-grid");
  if (grid) {
    renderGalleryGrid();
  }
}

window.toggleLike = function(btn) {
  btn.classList.toggle("liked");
  const countSpan = btn.querySelector(".like-count");
  if (!countSpan) return;
  
  let count = parseInt(countSpan.innerText);
  if (btn.classList.contains("liked")) {
    count++;
  } else {
    count--;
  }
  countSpan.innerText = count;
};

window.filterGallery = function(country) {
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.classList.remove("active");
    if (btn.innerText.includes(country) || (country === "all" && btn.innerText.includes("All"))) {
      btn.classList.add("active");
    }
  });
  
  const galleryItems = document.querySelectorAll(".gallery-item");
  galleryItems.forEach(item => {
    if (country === "all" || item.getAttribute("data-country") === country) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
};

// --- High-Performance Parallax ---
function initParallax() {
  // Skip parallax on mobile — it causes scroll jank on weaker GPUs
  if (window.innerWidth <= 768) return;

  const backgrounds = document.querySelectorAll(".hero-parallax-bg");
  if (backgrounds.length === 0) return;
  
  let ticking = false;
  
  const updatePosition = () => {
    backgrounds.forEach(bg => {
      const parent = bg.parentElement;
      const rect = parent.getBoundingClientRect();
      // Only animate if the section is within the viewport bounds
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const yOffset = (window.scrollY - parent.offsetTop) * 0.4;
        bg.style.transform = `translate3d(0, ${yOffset}px, 0)`;
      }
    });
    ticking = false;
  };
  
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updatePosition);
      ticking = true;
    }
  }, { passive: true });
  
  // Initial frame
  updatePosition();
}

// --- Scroll Reveal with Intersection Observer ---
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal-item");
  if (revealElements.length === 0) return;
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: "0px 0px -30px 0px"
  });
  
  revealElements.forEach(el => observer.observe(el));
}

// --- Sports Ticker Customization ---
function syncSportsTicker() {
  const track = document.getElementById("ticker-track");
  if (!track) return;
  
  if (state.user.registered) {
    const flag = countryFlags[state.user.supportingCountry] || "⚽";
    const userBest = state.user.personalBest.penalty;
    const items = Array.from(track.querySelectorAll(".ticker-item"));
    
    if (items.length === 0) return;
    
    // Clear any previous custom elements
    track.querySelectorAll(".user-ticker-item").forEach(el => el.remove());
    
    const playerUpdateText = currentLanguage === "bn"
      ? `👤 প্লেয়ার স্ট্যাটস: ${state.user.name.toUpperCase()} (জার্সি #${state.user.jerseyNumber}) - টিম ${state.user.supportingCountry.toUpperCase()} ${flag} - স্কোর: ${userBest} পয়েন্ট`
      : `👤 PLAYER STATS: ${state.user.name.toUpperCase()} (JERSEY #${state.user.jerseyNumber}) - TEAM ${state.user.supportingCountry.toUpperCase()} ${flag} - SCORE: ${userBest} PTS`;
    
    const userMsg1 = document.createElement("div");
    userMsg1.className = "ticker-item user-ticker-item";
    userMsg1.innerHTML = `<span class="ticker-highlight" style="background: var(--accent-red); color: #fff;">${currentLanguage === "bn" ? "আমার স্ট্যাটস" : "MY STATS"}</span> ${playerUpdateText} <span class="ticker-divider">⚡</span>`;
    
    const userMsg2 = document.createElement("div");
    userMsg2.className = "ticker-item user-ticker-item";
    userMsg2.innerHTML = `<span class="ticker-highlight" style="background: var(--accent-red); color: #fff;">${currentLanguage === "bn" ? "আমার স্ট্যাটস" : "MY STATS"}</span> ${playerUpdateText} <span class="ticker-divider">⚡</span>`;
    
    // Refresh items list
    const freshItems = Array.from(track.querySelectorAll(".ticker-item"));
    const halfCount = freshItems.length / 2;
    
    track.insertBefore(userMsg1, freshItems[0]);
    track.insertBefore(userMsg2, freshItems[halfCount]);
  }
}

// --- Navigation Access Guard (Route Guards) ---
function checkRouteGuards() {
  const currentPath = window.location.pathname;
  const fileName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || "index.html";
  
  if (state.user.registered) return;
  
  if (fileName === "games.html") {
    const targetSection = document.getElementById("games");
    if (targetSection) {
      targetSection.innerHTML = `
        <div class="app-lock-container">
          <div class="app-lock-card glass-card">
            <div class="lock-icon-glow">🔒</div>
            <h2>${translate("Arena Locked")}</h2>
            <p>${translate("Access to the Event Arcade mini-games is restricted to registered campaign players.")}</p>
            <div class="lock-benefits">
              <div class="benefit-item">⚡ ${translate("Save your scores to the live leaderboard")}</div>
              <div class="benefit-item">🌍 ${translate("Represent your country in national standings")}</div>
              <div class="benefit-item">🎁 ${translate("Enter weekly draws for official merchandise")}</div>
            </div>
            <a href="registration.html" class="btn btn-primary" style="width: 100%;">${currentLanguage === "bn" ? "রেজিস্টার করে আনলক করুন" : "Register Now & Unlock"}</a>
          </div>
        </div>
      `;
      targetSection.style.paddingTop = "80px";
      targetSection.classList.remove("reveal-item");
      targetSection.style.opacity = "1";
      targetSection.style.transform = "none";
    }
  } else if (fileName === "photobooth.html") {
    const targetSection = document.getElementById("booth");
    if (targetSection) {
      targetSection.innerHTML = `
        <div class="app-lock-container">
          <div class="app-lock-card glass-card">
            <div class="lock-icon-glow">🔒</div>
            <h2>${translate("Photo Booth Locked")}</h2>
            <p>${translate("Access to the AI Fan Photo Booth is restricted to registered campaign players.")}</p>
            <div class="lock-benefits">
              <div class="benefit-item">📸 ${translate("Generate premium customized country team jersey posters")}</div>
              <div class="benefit-item">🌍 ${translate("Post your cards live to the shared Social Fan Gallery")}</div>
              <div class="benefit-item">💾 ${translate("Download HD posters with custom jersey numbers")}</div>
            </div>
            <a href="registration.html" class="btn btn-primary" style="width: 100%;">${currentLanguage === "bn" ? "রেজিস্টার করে আনলক করুন" : "Register Now & Unlock"}</a>
          </div>
        </div>
      `;
      targetSection.style.paddingTop = "80px";
      targetSection.classList.remove("reveal-item");
      targetSection.style.opacity = "1";
      targetSection.style.transform = "none";
      
      const gallerySection = document.getElementById("gallery");
      if (gallerySection) gallerySection.style.display = "none";
    }
  }
}

// --- Mobile Bottom Navigation ---
function injectMobileBottomNav() {
  if (document.querySelector(".mobile-bottom-nav")) return;
  
  const currentPath = window.location.pathname;
  const fileName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || "index.html";
  
  const nav = document.createElement("div");
  nav.className = "mobile-bottom-nav";
  
  const gamesLock = state.user.registered ? "" : `<span class="bottom-lock">🔒</span>`;
  const boothLock = state.user.registered ? "" : `<span class="bottom-lock">🔒</span>`;
  
  nav.innerHTML = `
    <a href="index.html" class="bottom-nav-tab ${fileName === 'index.html' ? 'active' : ''}">
      <span class="tab-icon">🏠</span>
      <span class="tab-label">${translate("Home")}</span>
    </a>
    <a href="registration.html" class="bottom-nav-tab ${fileName === 'registration.html' ? 'active' : ''}">
      <span class="tab-icon">👤</span>
      <span class="tab-label">${state.user.registered ? translate("Profile") : translate("Register")}</span>
    </a>
    <a href="games.html" class="bottom-nav-tab ${fileName === 'games.html' ? 'active' : ''}">
      <span class="tab-icon" style="position: relative;">🎮${gamesLock}</span>
      <span class="tab-label">${translate("Games")}</span>
    </a>
    <a href="leaderboard.html" class="bottom-nav-tab ${fileName === 'leaderboard.html' ? 'active' : ''}">
      <span class="tab-icon">📊</span>
      <span class="tab-label">${translate("Standings")}</span>
    </a>
    <a href="photobooth.html" class="bottom-nav-tab ${fileName === 'photobooth.html' ? 'active' : ''}">
      <span class="tab-icon" style="position: relative;">📸${boothLock}</span>
      <span class="tab-label">${translate("Booth")}</span>
    </a>
  `;
  
  document.body.appendChild(nav);
}

// --- Desktop Nav Lock Badges ---
function updateDesktopNavLockBadges() {
  if (state.user.registered) return;
  
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === "games.html") {
      if (!link.innerHTML.includes("🔒")) {
        link.innerHTML = `Games <span style="font-size:0.75rem; margin-left: 2px;">🔒</span>`;
      }
    } else if (href === "photobooth.html") {
      if (!link.innerHTML.includes("🔒")) {
        link.innerHTML = `AI Photo Booth <span style="font-size:0.75rem; margin-left: 2px;">🔒</span>`;
      }
    }
  });
}

function syncNavbarProfileButton() {
  const ctaContainer = document.querySelector(".nav-cta");
  if (ctaContainer) {
    ctaContainer.innerHTML = state.user.registered
      ? `<a href="registration.html" class="btn btn-secondary nav-main-btn">Dashboard</a>`
      : `<a href="registration.html" class="btn btn-primary nav-main-btn">Register</a>`;
  }

  const heroActions = document.querySelector(".hero-actions");
  const regBtn = heroActions ? heroActions.querySelector("a[href='registration.html']") : null;
  if (regBtn) {
    regBtn.innerText = state.user.registered ? "Dashboard" : "Start Here";
  }
}

// Simplified generated UI overrides.
function checkRouteGuards() {
  const currentPath = window.location.pathname;
  const fileName = currentPath.substring(currentPath.lastIndexOf("/") + 1) || "index.html";

  if (state.user.registered) return;

  if (fileName === "games.html") {
    const targetSection = document.getElementById("games");
    if (!targetSection) return;
    targetSection.innerHTML = `
      <div class="app-lock-container">
        <div class="app-lock-card glass-card simple-card">
          <div class="lock-icon-glow">LOCKED</div>
          <h2>Register to Play</h2>
          <p>Create your player profile first so your score can be saved.</p>
          <div class="lock-benefits">
            <div class="benefit-item">Save your score</div>
            <div class="benefit-item">Support your country</div>
            <div class="benefit-item">Join campaign rewards</div>
          </div>
          <a href="registration.html" class="btn btn-primary" style="width: 100%;">Register</a>
        </div>
      </div>
    `;
    targetSection.style.paddingTop = "80px";
    targetSection.classList.remove("reveal-item");
    targetSection.style.opacity = "1";
    targetSection.style.transform = "none";
  } else if (fileName === "photobooth.html") {
    const targetSection = document.getElementById("booth");
    if (!targetSection) return;
    targetSection.innerHTML = `
      <div class="app-lock-container">
        <div class="app-lock-card glass-card simple-card">
          <div class="lock-icon-glow">LOCKED</div>
          <h2>Register to Use Photo Booth</h2>
          <p>Create your player profile first so your poster can use your team details.</p>
          <div class="lock-benefits">
            <div class="benefit-item">Choose your team</div>
            <div class="benefit-item">Create your poster</div>
            <div class="benefit-item">Add it to the gallery</div>
          </div>
          <a href="registration.html" class="btn btn-primary" style="width: 100%;">Register</a>
        </div>
      </div>
    `;
    targetSection.style.paddingTop = "80px";
    targetSection.classList.remove("reveal-item");
    targetSection.style.opacity = "1";
    targetSection.style.transform = "none";

    const gallerySection = document.getElementById("gallery");
    if (gallerySection) gallerySection.style.display = "none";
  }
}

function injectMobileBottomNav() {
  if (document.querySelector(".mobile-bottom-nav")) return;

  const currentPath = window.location.pathname;
  const fileName = currentPath.substring(currentPath.lastIndexOf("/") + 1) || "index.html";
  const nav = document.createElement("div");
  nav.className = "mobile-bottom-nav simple-mobile-nav";

  const gamesLock = state.user.registered ? "" : `<span class="bottom-lock">Locked</span>`;
  const boothLock = state.user.registered ? "" : `<span class="bottom-lock">Locked</span>`;

  nav.innerHTML = `
    <a href="index.html" class="bottom-nav-tab ${fileName === "index.html" ? "active" : ""}">
      <span class="tab-label">${translate("Home")}</span>
    </a>
    <a href="registration.html" class="bottom-nav-tab ${fileName === "registration.html" ? "active" : ""}">
      <span class="tab-label">${state.user.registered ? translate("Profile") : translate("Register")}</span>
    </a>
    <a href="games.html" class="bottom-nav-tab ${fileName === "games.html" ? "active" : ""}">
      <span class="tab-label">${translate("Games")}${gamesLock}</span>
    </a>
    <a href="leaderboard.html" class="bottom-nav-tab ${fileName === "leaderboard.html" ? "active" : ""}">
      <span class="tab-label">${translate("Standings")}</span>
    </a>
    <a href="photobooth.html" class="bottom-nav-tab ${fileName === "photobooth.html" ? "active" : ""}">
      <span class="tab-label">${translate("Booth")}${boothLock}</span>
    </a>
  `;

  document.body.appendChild(nav);
}

function updateDesktopNavLockBadges() {
  if (state.user.registered) return;

  document.querySelectorAll(".nav-links a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === "games.html" && !link.innerHTML.includes("Locked")) {
      link.innerHTML = `Games <span class="nav-lock">Locked</span>`;
    } else if (href === "photobooth.html" && !link.innerHTML.includes("Locked")) {
      link.innerHTML = `Photo Booth <span class="nav-lock">Locked</span>`;
    }
  });
}
