/* ===================================================================
   Sharukesh S - Portfolio Modern Interactive Script
   Typewriter, Theme Switcher, Demos (Musify & Spendy), Modals & Form
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initTheme();
  initNavigation();
  initScrollSpy();
  initSpendyDemo();
});

/* ===================================================================
   1. Dynamic Typewriter Effect
   =================================================================== */
function initTypewriter() {
  const typewriterEl = document.getElementById('typewriter');
  if (!typewriterEl) return;

  const phrases = [
    'Responsive Web Applications.',
    'Modern Frontend Interfaces.',
    'Interactive Web Experiences.',
    'Clean Java & JavaScript Solutions.',
    'Intuitive UI/UX Designs.'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 95;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 1800; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before new phrase
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ===================================================================
   2. Theme Toggle (Dark / Light)
   =================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
    });
  }
}

/* ===================================================================
   3. Navigation & Mobile Menu
   =================================================================== */
function initNavigation() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Resume button listener
  const openResumeBtn = document.getElementById('openResumeBtn');
  if (openResumeBtn) {
    openResumeBtn.addEventListener('click', openResumeModal);
  }
}

/* ===================================================================
   4. ScrollSpy (Active Nav Highlighting)
   =================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ===================================================================
   5. Modals Management (Musify, Spendy, Resume)
   =================================================================== */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';

    // If closing Musify, pause playback simulation
    if (modalId === 'musifyModal' && isPlaying) {
      togglePlay();
    }
  }
}

function closeOnBackdrop(event, modalId) {
  if (event.target.id === modalId) {
    closeModal(modalId);
  }
}

// Global ESC key modal dismissal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    ['musifyModal', 'spendyModal', 'resumeModal'].forEach(id => closeModal(id));
  }
});

function openResumeModal() {
  openModal('resumeModal');
}

function openMusifyDemo() {
  openModal('musifyModal');
}

function openSpendyDemo() {
  openModal('spendyModal');
}

/* ===================================================================
   6. Musify Interactive Player Simulation
   =================================================================== */
const tracks = [
  { title: 'Midnight Neon City', artist: 'Cyber Groove Collective', duration: '2:45', totalSeconds: 165 },
  { title: 'Sunset Codeflow', artist: 'Lofi Dev Sessions', duration: '3:12', totalSeconds: 192 },
  { title: 'Cosmic Waves Lo-Fi', artist: 'Astral Beats', duration: '1:58', totalSeconds: 118 }
];

let currentTrackIndex = 0;
let isPlaying = false;
let trackSeconds = 0;
let playInterval = null;

function loadTrack(index) {
  currentTrackIndex = index;
  const track = tracks[currentTrackIndex];

  document.getElementById('songTitle').textContent = track.title;
  document.getElementById('songArtist').textContent = track.artist;
  document.getElementById('durationTime').textContent = track.duration;
  document.getElementById('currentTime').textContent = '0:00';
  document.getElementById('progressBar').value = 0;
  trackSeconds = 0;

  // Update active item in playlist
  const items = document.querySelectorAll('.playlist-item');
  items.forEach((item, idx) => {
    item.classList.toggle('active', idx === index);
  });

  if (isPlaying) {
    clearInterval(playInterval);
    startPlayTimer();
  }
}

function togglePlay() {
  isPlaying = !isPlaying;
  const disc = document.getElementById('albumDisc');
  const visualizer = document.getElementById('visualizerBars');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');

  if (isPlaying) {
    disc.classList.add('spinning');
    visualizer.classList.add('active');
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    startPlayTimer();
    showToast('Musify: Playing ' + tracks[currentTrackIndex].title);
  } else {
    disc.classList.remove('spinning');
    visualizer.classList.remove('active');
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    clearInterval(playInterval);
  }
}

function startPlayTimer() {
  clearInterval(playInterval);
  playInterval = setInterval(() => {
    trackSeconds++;
    const total = tracks[currentTrackIndex].totalSeconds;

    if (trackSeconds > total) {
      nextSong();
      return;
    }

    const currentFormatted = formatTime(trackSeconds);
    document.getElementById('currentTime').textContent = currentFormatted;
    const progressPercent = (trackSeconds / total) * 100;
    document.getElementById('progressBar').value = progressPercent;
  }, 1000);
}

function seekSong(value) {
  const total = tracks[currentTrackIndex].totalSeconds;
  trackSeconds = Math.floor((value / 100) * total);
  document.getElementById('currentTime').textContent = formatTime(trackSeconds);
}

function nextSong() {
  const nextIdx = (currentTrackIndex + 1) % tracks.length;
  loadTrack(nextIdx);
}

function prevSong() {
  const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(prevIdx);
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/* ===================================================================
   7. Spendy Interactive Expense Tracker Demo
   =================================================================== */
let spendyTransactions = [
  { id: 1, desc: 'Web Dev Internship Stipend', amount: 25000, type: 'income', category: 'Stipend' },
  { id: 2, desc: 'AWS & Domain Hosting', amount: 2400, type: 'expense', category: 'Dev & Tech' },
  { id: 3, desc: 'Ergonomic Coding Setup', amount: 1850, type: 'expense', category: 'Dev & Tech' },
  { id: 4, desc: 'Advanced Java Course Materials', amount: 1300, type: 'expense', category: 'College' },
  { id: 5, desc: 'Team Coffee & Collaboration', amount: 7000, type: 'expense', category: 'Food & Cafe' }
];

function initSpendyDemo() {
  renderSpendyLedger();
}

function renderSpendyLedger() {
  const listEl = document.getElementById('spendyList');
  if (!listEl) return;

  listEl.innerHTML = '';
  let incomeTotal = 0;
  let expenseTotal = 0;

  spendyTransactions.forEach(t => {
    if (t.type === 'income') {
      incomeTotal += t.amount;
    } else {
      expenseTotal += t.amount;
    }

    const li = document.createElement('li');
    li.className = `sp-item ${t.type}`;
    li.innerHTML = `
      <div>
        <strong>${escapeHtml(t.desc)}</strong>
        <small style="display:block; color:var(--text-muted); font-size:0.75rem;">${escapeHtml(t.category)}</small>
      </div>
      <div style="display:flex; align-items:center;">
        <span style="font-weight:700; font-family:var(--font-mono); color:${t.type === 'income' ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">
          ${t.type === 'income' ? '+' : '-'}₹${t.amount.toLocaleString('en-IN')}
        </span>
        <button class="sp-del-btn" onclick="deleteSpendyTransaction(${t.id})" title="Delete entry">&times;</button>
      </div>
    `;
    listEl.appendChild(li);
  });

  const netBalance = incomeTotal - expenseTotal;
  document.getElementById('spTotalBalance').textContent = `₹${netBalance.toLocaleString('en-IN')}.00`;
  document.getElementById('spTotalIncome').textContent = `+₹${incomeTotal.toLocaleString('en-IN')}.00`;
  document.getElementById('spTotalExpense').textContent = `-₹${expenseTotal.toLocaleString('en-IN')}.00`;
}

function addSpendyTransaction(e) {
  e.preventDefault();
  const desc = document.getElementById('spDesc').value.trim();
  const amount = parseFloat(document.getElementById('spAmount').value);
  const type = document.getElementById('spType').value;
  const category = document.getElementById('spCategory').value;

  if (!desc || isNaN(amount) || amount <= 0) {
    showToast('Please enter a valid description and positive amount');
    return;
  }

  const newTx = {
    id: Date.now(),
    desc,
    amount,
    type,
    category
  };

  spendyTransactions.unshift(newTx);
  renderSpendyLedger();

  // Reset form
  document.getElementById('spDesc').value = '';
  document.getElementById('spAmount').value = '';

  showToast(`Added ${type === 'income' ? 'income' : 'expense'}: ₹${amount.toLocaleString('en-IN')}`);
}

function deleteSpendyTransaction(id) {
  spendyTransactions = spendyTransactions.filter(t => t.id !== id);
  renderSpendyLedger();
  showToast('Transaction removed');
}

/* ===================================================================
   8. Contact Form & Clipboard
   =================================================================== */
function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('userName').value.trim();
  const email = document.getElementById('userEmail').value.trim();
  const subject = document.getElementById('userSubject').value.trim();
  const message = document.getElementById('userMessage').value.trim();

  const mailtoUrl = `mailto:luckycrack2427@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  )}`;

  window.location.href = mailtoUrl;
  showToast('Opening your email client to send message to Sharukesh!');
}

function copyToClipboard(text, customMsg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(customMsg || 'Copied to clipboard!');
  }).catch(() => {
    // Fallback
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast(customMsg || 'Copied to clipboard!');
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
