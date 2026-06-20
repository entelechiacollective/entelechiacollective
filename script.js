/* ============================================
   ENTELECHIA COLLECTIVE — script.js
   ============================================ */

/* ---------- POPUP CONTROLS ---------- */
function openPopup(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePopup(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

function closeOnOverlay(event, id) {
  if (event.target === document.getElementById(id)) {
    closePopup(id);
  }
}

// Close popups with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.overlay.open').forEach(function(el) {
      el.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

/* ---------- MOBILE NAV ---------- */
function toggleMobileNav() {
  document.getElementById('mobileNav').classList.toggle('open');
}

function closeMobileNav() {
  document.getElementById('mobileNav').classList.remove('open');
}

/* ---------- GOOGLE SHEETS FETCH ---------- */
// Replace this URL with your own SheetDB API endpoint
// Instructions: go to sheetdb.io, connect your Google Sheet, copy the API URL
const SHEET_API = 'YOUR_SHEETDB_API_URL_HERE';

async function fetchSheet(sheet) {
  try {
    const res = await fetch(`${SHEET_API}?sheet=${sheet}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error fetching sheet:', sheet, err);
    return [];
  }
}

/* ---------- RENDER SUBMISSIONS (read.html) ---------- */
async function renderSubmissions() {
  const container = document.getElementById('submissions-container');
  if (!container) return;

  container.innerHTML = '<p class="loading">gathering words...</p>';

  const data = await fetchSheet('submissions');
  const approved = data.filter(item => item.status === 'published');

  if (approved.length === 0) {
    container.innerHTML = '<p class="loading">no submissions yet. be the first.</p>';
    return;
  }

  container.innerHTML = approved.map(item => `
    <div class="submission-card">
      <span class="submission-type">${item.type || 'poetry'}</span>
      <div class="submission-title">${item.title || ''}</div>
      <p class="submission-excerpt">${item.content || ''}</p>
      <span class="submission-author">— ${item.author || 'anonymous'}</span>
    </div>
  `).join('');
}

/* ---------- RENDER LETTERS (letters.html) ---------- */
async function renderLetters() {
  const container = document.getElementById('letters-container');
  if (!container) return;

  container.innerHTML = '<p class="loading">unfolding letters...</p>';

  const data = await fetchSheet('letters');
  const approved = data.filter(item => item.status === 'published');

  if (approved.length === 0) {
    container.innerHTML = '<p class="loading">no letters yet. write yours.</p>';
    return;
  }

  container.innerHTML = approved.map(item => `
    <div class="letter-card">
      <span class="letter-to">to: ${item.to || 'someone'}</span>
      <p class="letter-excerpt">${item.content || ''}</p>
      <span class="letter-author">— ${item.author || 'anonymous'}</span>
    </div>
  `).join('');
}

/* ---------- RENDER BOOKS (shelf.html) ---------- */
async function renderBooks() {
  const container = document.getElementById('books-container');
  if (!container) return;

  container.innerHTML = '<p class="loading">pulling books from the shelf...</p>';

  const data = await fetchSheet('books');

  if (data.length === 0) {
    container.innerHTML = '<p class="loading">the shelf is being filled. check back soon.</p>';
    return;
  }

  container.innerHTML = data.map(item => `
    <div class="book-card">
      <img src="${item.image || 'images/books/placeholder.jpg'}" alt="${item.title || 'book'}" loading="lazy" />
      <div class="book-card-overlay">
        <p>${item.review || item.description || ''}</p>
        <span>— ${item.reviewer || 'the collective'}</span>
      </div>
    </div>
  `).join('');
}

/* ---------- ON PAGE LOAD ---------- */
document.addEventListener('DOMContentLoaded', function() {
  renderSubmissions();
  renderLetters();
  renderBooks();
});
