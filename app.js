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

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  loadStateFromLocalStorage();
  initCountdown();
  renderLeaderboards();
  initNavbarScroll();
  setupInitialGalleryMockURLs();
  syncNavbarProfileButton();
  initParallax();
  initScrollReveal();
  syncSportsTicker();
  checkRouteGuards();
  injectMobileBottomNav();
});

// --- Sync Navbar Profile Button ---
function syncNavbarProfileButton() {
  const ctaContainer = document.querySelector(".nav-cta");
  if (ctaContainer) {
    if (state.user.registered) {
      ctaContainer.innerHTML = `
        <a href="registration.html" class="btn btn-secondary" style="padding: 10px 20px; font-size: 0.85rem;">Dashboard</a>
      `;
    } else {
      ctaContainer.innerHTML = `
        <a href="registration.html" class="btn btn-primary" style="padding: 10px 20px; font-size: 0.85rem;">Register Now</a>
      `;
    }
  }
  
  // Also sync the home page hero action button if it exists
  const heroActions = document.querySelector(".hero-actions");
  if (heroActions) {
    const regBtn = heroActions.querySelector("a[href='registration.html']");
    if (regBtn) {
      if (state.user.registered) {
        regBtn.innerText = "Dashboard ⚡";
      } else {
        regBtn.innerText = "Register Now ⚡";
      }
    }
  }
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
  const data = localStorage.getItem(`${storagePrefix}user`) || localStorage.getItem(`${legacyStoragePrefix}user`);
  if (data) {
    state.user = JSON.parse(data);
    if (state.user.registered) {
      showRegistrationSuccess();
      updateArcadeHUDPersonalBest();
    }
  }
  
  const galleryData = localStorage.getItem(`${storagePrefix}gallery`) || localStorage.getItem(`${legacyStoragePrefix}gallery`);
  if (galleryData) {
    state.galleryItems = JSON.parse(galleryData);
  }
  
  const indBoard = localStorage.getItem(`${storagePrefix}individuals`) || localStorage.getItem(`${legacyStoragePrefix}individuals`);
  if (indBoard) {
    state.individualLeaderboard = JSON.parse(indBoard);
  }
  
  const cntBoard = localStorage.getItem(`${storagePrefix}countries`) || localStorage.getItem(`${legacyStoragePrefix}countries`);
  if (cntBoard) {
    state.countryLeaderboard = JSON.parse(cntBoard);
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
};

// Avatar upload removed, Jersey Number field added instead

window.handleRegistration = function(event) {
  event.preventDefault();
  
  const name = document.getElementById("reg-name").value;
  const phone = document.getElementById("reg-phone").value;
  const email = document.getElementById("reg-email").value;
  const location = document.getElementById("reg-location").value;
  const jerseyNumber = document.getElementById("reg-jersey").value;
  const country = document.getElementById("selected-country-val").value;
  
  if (!country) {
    alert("Please select a supporting country first!");
    return;
  }
  
  state.user.name = name;
  state.user.phone = phone;
  state.user.email = email;
  state.user.location = location;
  state.user.jerseyNumber = parseInt(jerseyNumber) || 10;
  state.user.supportingCountry = country;
  state.user.registered = true;
  
  saveStateToLocalStorage();
  showRegistrationSuccess();
  updateLeaderboardScores();
  syncNavbarProfileButton();
  syncSportsTicker();
  
  // Remove locks dynamically
  const bottomNav = document.querySelector(".mobile-bottom-nav");
  if (bottomNav) bottomNav.remove();
  injectMobileBottomNav();
  

  
  // Smooth scroll
  const successCard = document.getElementById("registration-success");
  if (successCard) successCard.scrollIntoView({ behavior: 'smooth' });
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
    regSection.style.paddingTop = "110px";
  }
  
  document.getElementById("player-card-name").innerText = state.user.name;
  const flag = countryFlags[state.user.supportingCountry] || "⚽";
  document.getElementById("player-card-team").innerText = `${flag} ${state.user.supportingCountry}`;
  
  const cardJersey = document.getElementById("player-card-jersey");
  if (cardJersey) cardJersey.innerText = `#${state.user.jerseyNumber}`;
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
  
  // 2. Update Country Scores
  const countryIndex = state.countryLeaderboard.findIndex(c => c.country === state.user.supportingCountry);
  if (countryIndex !== -1) {
    const currentContribution = state.user.personalBest.penalty + state.user.personalBest.runner;
    // We add user contribution divided by 10 to standard country total
    state.countryLeaderboard[countryIndex].score = 
      state.countryLeaderboard[countryIndex].score + Math.floor(currentContribution / 10);
    state.countryLeaderboard[countryIndex].supporters += 1;
    
    // Sort and re-rank
    state.countryLeaderboard.sort((a, b) => b.score - a.score);
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
  
  tabs.forEach(t => t.classList.remove("active"));
  
  const panels = document.querySelectorAll(".leaderboard-panel");
  panels.forEach(p => p.classList.remove("active"));
  
  if (tab === "individual") {
    tabs[0].classList.add("active");
    const panel = document.getElementById("panel-individual");
    if (panel) panel.classList.add("active");
  } else {
    tabs[1].classList.add("active");
    const panel = document.getElementById("panel-country");
    if (panel) panel.classList.add("active");
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
      
      row.innerHTML = `
        <td><span class="rank-badge">${item.rank}</span></td>
        <td>
          <div class="player-info">
            <span class="player-jersey-badge" style="background: var(--primary-neon); color: var(--text-dark); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 3px 6px rgba(0,0,0,0.3);">#${jerseyBadgeVal}</span>
            <span>${item.name}</span>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="https://flagcdn.com/w40/${flagCode}.png" alt="${item.country}" style="height: 16px; width: 24px; border-radius: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); object-fit: cover;">
            <span>${item.country}</span>
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
      
      row.innerHTML = `
        <td><span class="rank-badge">${item.rank}</span></td>
        <td>
          <div class="country-info" style="display: flex; align-items: center; gap: 8px;">
            <img src="https://flagcdn.com/w40/${flagCode}.png" alt="${item.country}" style="height: 16px; width: 24px; border-radius: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); object-fit: cover;">
            <span>${item.country}</span>
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
        <td style="text-align: right; color: var(--text-gray); font-weight: 700;">${item.supporters} Fans</td>
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
  });
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
  
  if (resTitle) resTitle.innerText = "Penalty Challenge Completed!";
  if (resUserScore) resUserScore.innerText = score;
  if (resCountryBoost) resCountryBoost.innerText = `+${boost}`;
  
  const resNotice = document.getElementById("result-leaderboard-notice");
  if (resNotice) {
    if (state.user.registered) {
      const userRank = state.individualLeaderboard.findIndex(p => p.isUser) + 1;
      resNotice.innerHTML = `
        You are currently ranked <span style='color: var(--primary-neon);'>#${userRank}</span> globally!<br>
        Total Score: ${state.user.personalBest.penalty} pts
      `;
    } else {
      resNotice.innerHTML = `
        <span style='color: var(--accent-red);'>Score not saved to leaderboard!</span><br>
        <a href='registration.html' style='color: var(--primary-neon); text-decoration: underline;'>Register here</a> to submit scores for your country!
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
  const backgrounds = document.querySelectorAll(".hero-parallax-bg");
  if (backgrounds.length === 0) return;
  
  let lastScrollY = window.scrollY;
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
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updatePosition);
      ticking = true;
    }
  });
  
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
    
    const playerUpdateText = `👤 PLAYER STATS: ${state.user.name.toUpperCase()} (JERSEY #${state.user.jerseyNumber}) - TEAM ${state.user.supportingCountry.toUpperCase()} ${flag} - SCORE: ${userBest} PTS`;
    
    const userMsg1 = document.createElement("div");
    userMsg1.className = "ticker-item user-ticker-item";
    userMsg1.innerHTML = `<span class="ticker-highlight" style="background: var(--accent-red); color: #fff;">MY STATS</span> ${playerUpdateText} <span class="ticker-divider">⚡</span>`;
    
    const userMsg2 = document.createElement("div");
    userMsg2.className = "ticker-item user-ticker-item";
    userMsg2.innerHTML = `<span class="ticker-highlight" style="background: var(--accent-red); color: #fff;">MY STATS</span> ${playerUpdateText} <span class="ticker-divider">⚡</span>`;
    
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
            <h2>Arena Locked</h2>
            <p>Access to the Event Arcade mini-games is restricted to registered campaign players.</p>
            <div class="lock-benefits">
              <div class="benefit-item">⚡ Save your scores to the live leaderboard</div>
              <div class="benefit-item">🌍 Represent your country in national standings</div>
              <div class="benefit-item">🎁 Enter weekly draws for official merchandise</div>
            </div>
            <a href="registration.html" class="btn btn-primary" style="width: 100%;">Register Now & Unlock ⚡</a>
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
            <h2>Photo Booth Locked</h2>
            <p>Access to the AI Fan Photo Booth is restricted to registered campaign players.</p>
            <div class="lock-benefits">
              <div class="benefit-item">📸 Generate premium customized country team jersey posters</div>
              <div class="benefit-item">🌍 Post your cards live to the shared Social Fan Gallery</div>
              <div class="benefit-item">💾 Download HD posters with custom jersey numbers</div>
            </div>
            <a href="registration.html" class="btn btn-primary" style="width: 100%;">Register Now & Unlock ⚡</a>
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
      <span class="tab-label">Home</span>
    </a>
    <a href="registration.html" class="bottom-nav-tab ${fileName === 'registration.html' ? 'active' : ''}">
      <span class="tab-icon">👤</span>
      <span class="tab-label">${state.user.registered ? 'Profile' : 'Register'}</span>
    </a>
    <a href="games.html" class="bottom-nav-tab ${fileName === 'games.html' ? 'active' : ''}">
      <span class="tab-icon" style="position: relative;">🎮${gamesLock}</span>
      <span class="tab-label">Games</span>
    </a>
    <a href="leaderboard.html" class="bottom-nav-tab ${fileName === 'leaderboard.html' ? 'active' : ''}">
      <span class="tab-icon">📊</span>
      <span class="tab-label">Standings</span>
    </a>
    <a href="photobooth.html" class="bottom-nav-tab ${fileName === 'photobooth.html' ? 'active' : ''}">
      <span class="tab-icon" style="position: relative;">📸${boothLock}</span>
      <span class="tab-label">Booth</span>
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
