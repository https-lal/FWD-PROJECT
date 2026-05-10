  
document.addEventListener('DOMContentLoaded', function () {

 
  const STORAGE_KEY = 'swiftclinics-theme';
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    const icon = theme === 'dark' ? '☀️' : '🌙';
    const btn       = document.getElementById('themeToggle');
    const btnMobile = document.getElementById('themeToggleMobile');
    if (btn)       btn.textContent       = icon;
    if (btnMobile) btnMobile.textContent = icon;
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function toggleTheme() {
    const current = root.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

 
  const saved       = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));

  const btn       = document.getElementById('themeToggle');
  const btnMobile = document.getElementById('themeToggleMobile');
  if (btn)       btn.addEventListener('click', toggleTheme);
  if (btnMobile) btnMobile.addEventListener('click', toggleTheme);


  
  const dateInput = document.getElementById('date');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }


  
  window.toggleMenu = function () {
    document.getElementById('mobileMenu').classList.toggle('open');
  };
  window.closeMenu = function () {
    document.getElementById('mobileMenu').classList.remove('open');
  };


  
  window.prefillDoctor = function (name, dept) {
    const doctorSelect = document.getElementById('doctor');
    const deptSelect   = document.getElementById('dept');

    doctorSelect.value = name;

    
    for (let opt of deptSelect.options) {
      if (opt.value === dept || opt.text === dept) {
        deptSelect.value = opt.value;
        break;
      }
    }

    document.getElementById('appointment').scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('✅ ' + name + ' pre-selected!');
  };


  
  window.showToast = function (msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  };


 
  function validateField(id, errId, check) {
    const el  = document.getElementById(id);
    const err = document.getElementById(errId);
    if (!el) return true; 
    const ok = check(el.value.trim());
    el.classList.toggle('error', !ok);
    if (err) err.classList.toggle('show', !ok);
    return ok;
  }


 
  const apptForm = document.getElementById('apptForm');

  if (apptForm) {
    apptForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const today = new Date().toISOString().split('T')[0];
      let valid = true;

      if (!validateField('fname',  'fname-err',  v => v.length >= 2))                          valid = false;
      if (!validateField('lname',  'lname-err',  v => v.length >= 2))                          valid = false;
      if (!validateField('phone',  'phone-err',  v => /^\+?[\d\s\-]{10,14}$/.test(v)))         valid = false;

      
      const emailVal = document.getElementById('email').value.trim();
      if (emailVal) {
        if (!validateField('email', 'email-err', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)))  valid = false;
      }

      if (!validateField('age',    'age-err',    v => v && +v >= 1 && +v <= 120))              valid = false;
      if (!validateField('gender', 'gender-err', v => v !== ''))                               valid = false;
      if (!validateField('dept',   'dept-err',   v => v !== ''))                               valid = false;
      if (!validateField('date',   'date-err',   v => v && v >= today))                        valid = false;
      if (!validateField('time',   'time-err',   v => v !== ''))                               valid = false;

      
      if (!valid) {
        const firstError = document.querySelector('.error');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      
      const fname  = document.getElementById('fname').value.trim();
      const doctor = document.getElementById('doctor').value || 'the next available doctor';
      const date   = document.getElementById('date').value;
      const time   = document.getElementById('time').value;
      const dept   = document.getElementById('dept').value;

      const dateStr = new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });

      document.getElementById('modalMsg').textContent =
        `Hi ${fname}! Your ${dept} appointment with ${doctor} on ${dateStr} at ${time} is confirmed. ` +
        `Please bring a valid ID and any previous reports.`;

      
      document.getElementById('successModal').classList.add('show');

      
      apptForm.reset();
    });
  }


 
  window.closeModal = function (e) {
    
    if (!e || e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-close')) {
      document.getElementById('successModal').classList.remove('show');
    }
  };


  
  window.addEventListener('scroll', function () {
    const btn = document.getElementById('scrollTopBtn');
    if (btn) btn.classList.toggle('visible', window.scrollY > 400);
  });

  window.scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  
  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', function () {
      this.classList.remove('error');
      const errEl = document.getElementById(this.id + '-err');
      if (errEl) errEl.classList.remove('show');
    });
  });

}); 