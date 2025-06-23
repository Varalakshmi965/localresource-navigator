// --- Modal Toggle Logic ---
function toggleModal(show) {
  const modal = document.getElementById("auth-modal");
  if (modal) {
    modal.classList.toggle("hidden", !show);
  }
}

function showSignup() {
  document.getElementById("signin-container")?.classList.add("hidden");
  document.getElementById("signup-container")?.classList.remove("hidden");
}

function showSignin() {
  document.getElementById("signup-container")?.classList.add("hidden");
  document.getElementById("signin-container")?.classList.remove("hidden");
}

// --- Modal Button Triggers ---
document.querySelectorAll("a[href='/login.html'], a[href='/signup.html']").forEach(btn => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    toggleModal(true);
    this.href.includes("signup") ? showSignup() : showSignin();
  });
});

// --- Signup Logic ---
async function handleSignup() {
  const name = document.getElementById('name')?.value.trim();
  const email = document.getElementById('signup-email')?.value.trim();
  const password = document.getElementById('signup-password')?.value;
  const confirmPassword = document.getElementById('confirmPassword')?.value;
  const role = document.getElementById('role')?.value;
  const errorMsg = document.getElementById('signup-error-msg');
  const btn = document.getElementById('signup-btn');

  if (!name || !email || !password || !confirmPassword || !role) {
    errorMsg.textContent = '⚠ All fields are required.';
    return;
  }

  if (password !== confirmPassword) {
    errorMsg.textContent = '❌ Passwords do not match.';
    return;
  }

  btn.disabled = true;
  btn.innerText = 'Creating...';
  errorMsg.textContent = '';

  try {
    const res = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });

    const text = await res.text();

    if (res.ok) {
      alert('✅ ' + text);
      // Optionally redirect to login
      // window.location.href = 'login.html';
    } else {
      errorMsg.textContent = '❌ ' + text;
    }
  } catch (err) {
    errorMsg.textContent = '❌ ' + err.message;
  } finally {
    btn.disabled = false;
    btn.innerText = 'Create Account';
  }
}

// --- Login Logic ---
async function handleLogin() {
  const email = document.getElementById('login-email')?.value.trim();
  const password = document.getElementById('login-password')?.value.trim();
  const errorMsg = document.getElementById('login-error-msg');
  const btn = document.getElementById('login-btn');

  if (!email || !password) {
    errorMsg.textContent = '⚠ Please fill in both fields.';
    return;
  }

  btn.disabled = true;
  btn.innerText = 'Signing In...';
  errorMsg.textContent = '';

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const text = await res.text();

    if (res.ok) {
      alert('✅ ' + text);
      // window.location.href = 'index.html';
    } else {
      errorMsg.textContent = '❌ ' + text;
    }
  } catch (err) {
    errorMsg.textContent = '❌ ' + err.message;
  } finally {
    btn.disabled = false;
    btn.innerText = 'Sign In';
  }
}

// --- Language Support ---
const translations = {
  en: {
    heroTitle: "Find Help When You Need It",
    heroSubtitle: "Connecting you to essential services and support in your community",
    availableResources: "Available Resources",
    searchPlaceholder: "Search for resources, services, or locations...",
    filters: "Filters",
    clear: "Clear",
    nearMe: "Near Me",
    moreResources: "More Available Resources",
    readyTitle: "Ready to Get Started?",
    readySubtitle: "Join thousands of people finding help in their communities",
    signUpToday: "Sign Up Today",
  },
  hi: {
    heroTitle: "जब आपको सहायता चाहिए, हमारी मदद उपलब्ध है",
    heroSubtitle: "आपको आपके समुदाय में आवश्यक सेवाओं से जोड़ना",
    availableResources: "उपलब्ध संसाधन",
    searchPlaceholder: "संसाधन, सेवाएं, या स्थान खोजें...",
    filters: "फ़िल्टर",
    clear: "साफ़ करें",
    nearMe: "पास में",
    moreResources: "और उपलब्ध संसाधन",
    readyTitle: "शुरू करने के लिए तैयार?",
    readySubtitle: "सहायता पाने वाले हजारों लोगों में शामिल हों",
    signUpToday: "आज ही साइन अप करें",
  },
  te: {
    heroTitle: "మీకు అవసరమైతే సహాయం పొందండి",
    heroSubtitle: "మీ సమాజంలో అవసరమైన సేవలతో మిమ్మల్ని కనెక్ట్ చేస్తున్నాం",
    availableResources: "అభివృద్ది వనరులు",
    searchPlaceholder: "వనరులు, సేవలు లేదా స్థలాలను శోధించండి...",
    filters: "ఫిల్టర్‍లు",
    clear: "సాఫ్ చేయండి",
    nearMe: "సంవర్తించు",
    moreResources: "మరిన్ని అందుబాటులో వనరులు",
    readyTitle: "ప్రారంభించడానికి సిద్ధమేనా?",
    readySubtitle: "మీ సమాజంలో సహాయం పొందే లక్షల మందితో చేరండి",
    signUpToday: "నేడు నమోదు అవ్వండి",
  }
};

function applyLanguage(lang) {
  const t = translations[lang];
  if (!t) return;
  document.getElementById('hero-title').innerText = t.heroTitle;
  document.getElementById('hero-subtitle').innerText = t.heroSubtitle;
  document.getElementById('available-heading').innerText = t.availableResources;
  document.getElementById('search-input').placeholder = t.searchPlaceholder;
  document.getElementById('btn-filter').innerText = t.filters;
  document.getElementById('btn-clear').innerText = t.clear;
  document.getElementById('btn-near').innerText = t.nearMe;
  document.getElementById('more-resources-heading').innerText = t.moreResources;
  document.getElementById('cta-title').innerText = t.readyTitle;
  document.getElementById('cta-subtitle').innerText = t.readySubtitle;
  document.getElementById('btn-signup-today').innerText = t.signUpToday;
}

document.getElementById('language-select')?.addEventListener('change', e => {
  applyLanguage(e.target.value);
});

// --- Attach Events After DOM Loads ---
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('signup-btn')?.addEventListener('click', handleSignup);
  document.getElementById('login-btn')?.addEventListener('click', handleLogin);
});