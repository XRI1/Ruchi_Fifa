/* ==========================================
   RUCHI AI PHOTO BOOTH - OVERLAY COMPOSITOR
   ========================================== */

let boothUserImage = null; // Image object of user face
let currentTheme = "stadium"; // 'stadium', 'fan', 'jersey', 'trophy', 'matchday'
let webcamStream = null;

function boothNotify(message, type = "info") {
  if (typeof showToast === "function") {
    showToast(message, type);
  } else {
    alert(message);
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function drawImageCover(ctx, image, width, height) {
  const imageRatio = image.width / image.height;
  const canvasRatio = width / height;
  let drawWidth = width;
  let drawHeight = height;
  let drawX = 0;
  let drawY = 0;

  if (imageRatio > canvasRatio) {
    drawWidth = height * imageRatio;
    drawX = (width - drawWidth) / 2;
  } else {
    drawHeight = width / imageRatio;
    drawY = (height - drawHeight) / 2;
  }

  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

// Color themes based on countries
const teamColors = {
  "Argentina": { primary: "#74acdf", secondary: "#ffffff", accent: "#f6b426" },
  "Brazil": { primary: "#009c3b", secondary: "#ffdf00", accent: "#002776" },
  "Germany": { primary: "#000000", secondary: "#dd0000", accent: "#ffcf00" },
  "France": { primary: "#002395", secondary: "#ffffff", accent: "#ed2939" },
  "England": { primary: "#ffffff", secondary: "#cf142b", accent: "#002040" },
  "Spain": { primary: "#c60b1e", secondary: "#ffc400", accent: "#c60b1e" },
  "Japan": { primary: "#ffffff", secondary: "#bc002d", accent: "#002040" },
  "USA": { primary: "#0a3161", secondary: "#ffffff", accent: "#b22234" }
};

// --- Toggle Booth Source (File vs Webcam) ---
window.toggleBoothSource = function(source) {
  const optUpload = document.getElementById("opt-upload");
  const optWebcam = document.getElementById("opt-webcam");
  const fileWrap = document.getElementById("booth-file-input-wrap");
  const webcamWrap = document.getElementById("webcam-stream-wrap");
  const video = document.getElementById("webcam-video");
  
  optUpload.classList.remove("active");
  optWebcam.classList.remove("active");
  
  if (source === "upload") {
    optUpload.classList.add("active");
    fileWrap.style.display = "block";
    webcamWrap.style.display = "none";
    
    // Stop webcam if running
    stopWebcam();
  } else {
    optWebcam.classList.add("active");
    fileWrap.style.display = "none";
    webcamWrap.style.display = "block";
    
    // Start Webcam
    startWebcam(video);
  }
};

function startWebcam(videoElement) {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false })
      .then(stream => {
        webcamStream = stream;
        videoElement.srcObject = stream;
        videoElement.play();
      })
      .catch(err => {
        console.error("Camera access error: ", err);
        boothNotify("Could not access camera. Please upload an image instead.", "error");
        toggleBoothSource('upload');
      });
  } else {
    boothNotify("Webcam is not supported in this browser. Please upload an image.", "error");
    toggleBoothSource('upload');
  }
}

function stopWebcam() {
  if (webcamStream) {
    webcamStream.getTracks().forEach(track => track.stop());
    webcamStream = null;
  }
}

window.captureWebcamSnap = function() {
  const video = document.getElementById("webcam-video");
  if (!video.srcObject) return;
  
  const snapCanvas = document.createElement("canvas");
  snapCanvas.width = 640;
  snapCanvas.height = 480;
  const sCtx = snapCanvas.getContext("2d");
  
  // Draw current frame of camera feed onto temporary canvas
  sCtx.drawImage(video, 0, 0, 640, 480);
  
  // Save as image object
  boothUserImage = new Image();
  boothUserImage.onload = function() {
    boothNotify("Selfie captured. Choose a template and generate your poster.", "success");
  };
  boothUserImage.src = snapCanvas.toDataURL("image/png");
  
  // Stop camera to release source
  stopWebcam();
  document.getElementById("webcam-stream-wrap").style.display = "none";
  document.getElementById("opt-webcam").classList.remove("active");
  
  // Revert back to upload display and show filename info mock
  document.getElementById("opt-upload").classList.add("active");
  document.getElementById("booth-file-input-wrap").style.display = "block";
  document.getElementById("booth-upload-file").value = ""; // clear file upload input
};

window.loadBoothUserImage = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    boothUserImage = new Image();
    boothUserImage.onload = function() {
      boothNotify("Photo loaded. Choose a template and generate your poster.", "success");
    };
    boothUserImage.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

// --- Theme Picker ---
window.selectBoothTheme = function(element) {
  const themeCards = document.querySelectorAll(".theme-card");
  themeCards.forEach(c => c.classList.remove("selected"));
  
  element.classList.add("selected");
  currentTheme = element.getAttribute("data-theme");
};

// --- Generate AI Photo Composite ---
window.generateAIFanPhoto = function() {
  if (!boothUserImage) {
    boothNotify("Please upload a photo or snap a picture first.", "error");
    return;
  }
  
  const bCanvas = document.getElementById("booth-canvas");
  const bCtx = bCanvas.getContext("2d");
  const previewPlaceholder = document.getElementById("canvas-placeholder");
  
  bCtx.clearRect(0, 0, bCanvas.width, bCanvas.height);
  drawImageCover(bCtx, boothUserImage, bCanvas.width, bCanvas.height);

  const country = state.user.registered ? state.user.supportingCountry : "Brazil";
  const flag = countryFlags[country] || "";
  const colors = teamColors[country] || teamColors.Brazil;

  const gradient = bCtx.createLinearGradient(0, 0, 0, bCanvas.height);
  gradient.addColorStop(0, "rgba(6, 9, 19, 0.08)");
  gradient.addColorStop(0.62, "rgba(6, 9, 19, 0.16)");
  gradient.addColorStop(1, "rgba(6, 9, 19, 0.72)");
  bCtx.fillStyle = gradient;
  bCtx.fillRect(0, 0, bCanvas.width, bCanvas.height);
  drawThemeOverlay(bCtx, bCanvas.width, bCanvas.height, colors, country, flag);
  
  // Show Canvas
  previewPlaceholder.style.display = "none";
  bCanvas.style.display = "block";
  
  // Enable buttons
  document.getElementById("booth-download-btn").classList.remove("btn-disabled");
  document.getElementById("booth-share-btn").classList.remove("btn-disabled");
  boothNotify("Poster generated. You can download it or add it to the gallery.", "success");
};

function drawThemeOverlay(bCtx, width, height, colors, country, flag) {
  // Border frames and badges
  bCtx.strokeStyle = colors.primary;
  bCtx.lineWidth = 10;
  bCtx.strokeRect(5, 5, width - 10, height - 10);
  
  bCtx.strokeStyle = "#ffffff";
  bCtx.lineWidth = 2;
  bCtx.strokeRect(12, 12, width - 24, height - 24);
  
  // Bottom ticket layout
  bCtx.fillStyle = "rgba(6, 9, 19, 0.9)";
  bCtx.fillRect(20, height - 150, width - 40, 130);
  bCtx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  bCtx.strokeRect(20, height - 150, width - 40, 130);
  
  const userDisplayName = state.user.registered ? state.user.name.toUpperCase() : "RUCHI FAN";
  
  if (currentTheme === "stadium") {
    // Stadium Champion
    // Draw golden banner and stars
    bCtx.fillStyle = "#ffc107";
    bCtx.fillRect(width/2 - 150, height - 140, 300, 32);
    
    bCtx.fillStyle = "#000000";
    bCtx.font = "900 14px 'Syncopate'";
    bCtx.textAlign = "center";
    bCtx.fillText("STADIUM CHAMPION", width/2, height - 119);
    
    bCtx.fillStyle = "#ffffff";
    bCtx.font = "800 20px 'Outfit'";
    bCtx.fillText(userDisplayName, width/2, height - 75);
    
    bCtx.font = "500 14px 'Outfit'";
    bCtx.fillStyle = "#94a3b8";
    bCtx.fillText(`SUPPORTER OF ${country.toUpperCase()} ${flag}`, width/2, height - 45);
    
    // Draw stars
    bCtx.fillStyle = "#ffc107";
    bCtx.font = "16px 'Outfit'";
    bCtx.fillText("⭐⭐⭐⭐⭐", width/2, height - 22);
    
  } else if (currentTheme === "fan") {
    // Fan Poster
    // Draw stripes on side
    bCtx.fillStyle = colors.primary;
    bCtx.fillRect(20, height - 145, 15, 120);
    bCtx.fillStyle = colors.secondary;
    bCtx.fillRect(35, height - 145, 15, 120);
    
    bCtx.fillStyle = "#ffffff";
    bCtx.textAlign = "left";
    bCtx.font = "800 22px 'Outfit'";
    bCtx.fillText(userDisplayName, 70, height - 90);
    
    bCtx.font = "900 14px 'Syncopate'";
    bCtx.fillStyle = colors.accent;
    bCtx.fillText(`GO ${country.toUpperCase()} ${flag}!`, 70, height - 55);
    
    bCtx.font = "600 13px 'Outfit'";
    bCtx.fillStyle = "#94a3b8";
    bCtx.fillText("2026 WORLD STANDINGS SCORER", 70, height - 30);
    
  } else if (currentTheme === "jersey") {
    // Jersey overlay (mock chest/collar collar lines)
    bCtx.fillStyle = colors.primary;
    // draw collar
    bCtx.beginPath();
    bCtx.moveTo(width/2 - 120, height - 150);
    bCtx.lineTo(width/2 - 80, height - 110);
    bCtx.lineTo(width/2 + 80, height - 110);
    bCtx.lineTo(width/2 + 120, height - 150);
    bCtx.closePath();
    bCtx.fill();
    
    // Draw jersey logo and stripes
    bCtx.fillStyle = colors.secondary;
    bCtx.fillRect(width/2 - 25, height - 105, 50, 60);
    
    bCtx.fillStyle = "#ffffff";
    bCtx.font = "800 20px 'Outfit'";
    bCtx.textAlign = "center";
    bCtx.fillText(userDisplayName, width/2, height - 60);
    bCtx.font = "900 28px 'Syncopate'";
    bCtx.fillStyle = colors.accent;
    const userJerseyNum = state.user.registered ? state.user.jerseyNumber : "10";
    bCtx.fillText(userJerseyNum, width/2, height - 20);
    
  } else if (currentTheme === "trophy") {
    // Trophy Celebration
    bCtx.fillStyle = "#ffffff";
    bCtx.font = "800 20px 'Outfit'";
    bCtx.textAlign = "center";
    bCtx.fillText(userDisplayName, width/2, height - 85);
    
    bCtx.font = "900 18px 'Syncopate'";
    bCtx.fillStyle = "#ffc107";
    bCtx.fillText("🏆 VICTORY CELEBRATION 🏆", width/2, height - 50);
    
    bCtx.font = "500 13px 'Outfit'";
    bCtx.fillStyle = "#94a3b8";
    bCtx.fillText(`Supporting Country: ${country} ${flag}`, width/2, height - 20);
    
  } else if (currentTheme === "matchday") {
    // Match Day Ticket pass
    bCtx.fillStyle = "#ffffff";
    bCtx.font = "900 15px 'Syncopate'";
    bCtx.textAlign = "left";
    bCtx.fillText("MATCH DAY PASS", 45, height - 100);
    
    bCtx.font = "800 18px 'Outfit'";
    bCtx.fillStyle = "#ff9900";
    bCtx.fillText(userDisplayName, 45, height - 70);
    
    bCtx.font = "500 13px 'Outfit'";
    bCtx.fillStyle = "#94a3b8";
    bCtx.fillText(`TEAM: ${country.toUpperCase()} ${flag}`, 45, height - 45);
    bCtx.fillText("SEC: VIP / DATE: JULY 2026", 45, height - 25);
    
    // Draw mock barcode
    bCtx.fillStyle = "#ffffff";
    for(let i=0; i<25; i++) {
      const barW = Math.random() > 0.5 ? 4 : 2;
      bCtx.fillRect(width - 150 + (i*4), height - 110, barW, 60);
    }
    bCtx.font = "900 9px monospace";
    bCtx.fillText("*RUCHI2026*", width - 130, height - 35);
  }
}

// --- Download Campaign Poster ---
window.downloadBoothPoster = function() {
  const bCanvas = document.getElementById("booth-canvas");
  const dataURL = bCanvas.toDataURL("image/png");
  
  const link = document.createElement("a");
  link.download = "ruchi_football_fever_poster.png";
  link.href = dataURL;
  link.click();
};

// --- Share Booth Poster (Add to Gallery) ---
window.shareBoothPoster = function() {
  const bCanvas = document.getElementById("booth-canvas");
  const dataURL = bCanvas.toDataURL("image/png");
  
  // Append item to state gallery array
  const country = state.user.registered ? state.user.supportingCountry : "Brazil";
  const flag = countryFlags[country] || "🇧🇷";
  const username = state.user.registered ? state.user.name : "Ruchi Supporter";
  const userAvatar = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80";
  
  const newItem = {
    id: Date.now(),
    country: country,
    flag: flag,
    username: username,
    userAvatar: userAvatar,
    image: dataURL,
    likes: 1
  };
  
  // Add to global list
  state.galleryItems.unshift(newItem);
  
  // Save state to localStorage
  saveStateToLocalStorage();
  
  // Redraw gallery grid
  renderGalleryGrid();
  
  boothNotify("Poster shared to the Social Fan Gallery.", "success");
  
  // Reset buttons
  document.getElementById("booth-share-btn").classList.add("btn-disabled");
  
  // Smooth scroll
  document.getElementById("gallery").scrollIntoView({ behavior: 'smooth' });
};

// --- Redraw Gallery Grid ---
function renderGalleryGrid() {
  const grid = document.getElementById("gallery-grid");
  
  // Keep the 3 hardcoded mock items, clear the dynamic ones
  // In a clean way, let's rebuild the grid content
  let htmlContent = "";
  
  // Add dynamic items from state
  state.galleryItems.forEach(item => {
    const country = escapeHtml(item.country);
    const username = escapeHtml(item.username);
    const flag = escapeHtml(item.flag);
    const image = escapeHtml(item.image);
    const userAvatar = escapeHtml(item.userAvatar);
    const likes = Number.isFinite(Number(item.likes)) ? Number(item.likes) : 1;
    htmlContent += `
      <div class="gallery-item" data-country="${country}">
        <div class="gallery-img-wrap">
          <img src="${image}" alt="${country} Fan Poster">
        </div>
        <div class="gallery-meta">
          <div class="gallery-user-info">
            <img src="${userAvatar}" alt="${username}" class="gallery-user-img">
            <div>
              <span class="gallery-username">${username}</span>
              <span class="gallery-user-flag">${flag}</span>
            </div>
          </div>
          <button class="gallery-like-btn liked" onclick="toggleLike(this)">
            <svg width="18" height="18" fill="red" stroke="red" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            <span class="like-count">${likes}</span>
          </button>
        </div>
      </div>
    `;
  });
  
  // Append hardcoded mock assets
  htmlContent += `
    <div class="gallery-item" data-country="Argentina">
      <div class="gallery-img-wrap">
        <img src="assets/images/stadium_hero.png" alt="Argentina Fan Poster">
      </div>
      <div class="gallery-meta">
        <div class="gallery-user-info">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Sarah" class="gallery-user-img">
          <div>
            <span class="gallery-username">Sarah Miller</span>
            <span class="gallery-user-flag">🇦🇷</span>
          </div>
        </div>
        <button class="gallery-like-btn" onclick="toggleLike(this)">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          <span class="like-count">142</span>
        </button>
      </div>
    </div>
    
    <div class="gallery-item" data-country="Brazil">
      <div class="gallery-img-wrap">
        <img src="assets/images/stadium_hero.png" alt="Brazil Fan Poster">
      </div>
      <div class="gallery-meta">
        <div class="gallery-user-info">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Lucas" class="gallery-user-img">
          <div>
            <span class="gallery-username">Lucas Silva</span>
            <span class="gallery-user-flag">🇧🇷</span>
          </div>
        </div>
        <button class="gallery-like-btn" onclick="toggleLike(this)">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          <span class="like-count">89</span>
        </button>
      </div>
    </div>
    
    <div class="gallery-item" data-country="Germany">
      <div class="gallery-img-wrap">
        <img src="assets/images/stadium_hero.png" alt="Germany Fan Poster">
      </div>
      <div class="gallery-meta">
        <div class="gallery-user-info">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Marco" class="gallery-user-img">
          <div>
            <span class="gallery-username">Marco K.</span>
            <span class="gallery-user-flag">🇩🇪</span>
          </div>
        </div>
        <button class="gallery-like-btn" onclick="toggleLike(this)">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          <span class="like-count">204</span>
        </button>
      </div>
    </div>
  `;
  
  grid.innerHTML = htmlContent;
  
  // Re-apply any filters currently active
  const activeFilterBtn = document.querySelector(".filter-btn.active");
  if (activeFilterBtn) {
    // Get filter parameter from text or action
    // Simpler: find which button it is and trigger click
    const btnText = activeFilterBtn.innerText;
    let country = "all";
    if (btnText.includes("Argentina")) country = "Argentina";
    else if (btnText.includes("Brazil")) country = "Brazil";
    else if (btnText.includes("Germany")) country = "Germany";
    else if (btnText.includes("France")) country = "France";
    else if (btnText.includes("England")) country = "England";
    else if (btnText.includes("Spain")) country = "Spain";
    else if (btnText.includes("Japan")) country = "Japan";
    else if (btnText.includes("USA")) country = "USA";
    
    filterGallery(country);
  }
}
