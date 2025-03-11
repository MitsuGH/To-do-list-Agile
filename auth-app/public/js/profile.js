const tabs = document.querySelectorAll('.tab');
const contentSections = document.querySelectorAll('.content-section');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.getAttribute('data-tab');
    
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    contentSections.forEach(section => {
      section.classList.remove('active');
      if (section.id === `${tabName}-section`) {
        section.classList.add('active');
      }
    });
  });
});

document.getElementById('profile-form').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Profile updated successfully!');
});

document.querySelector('.change-photo-btn').addEventListener('click', function() {
  alert('This would open a file picker in a real application.');
});

document.getElementById('security-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const newPwd = document.getElementById('new-password').value;
  const confirmPwd = document.getElementById('confirm-password').value;
  
  if (newPwd !== confirmPwd) {
    alert('New passwords do not match!');
    return;
  }
  
  alert('Password updated successfully!');
  document.getElementById('new-password').value = '';
  document.getElementById('confirm-password').value = '';
});

const appearanceCards = document.querySelectorAll('.appearance-card');
appearanceCards.forEach(card => {
  card.addEventListener('click', () => {
    appearanceCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    
    const appearance = card.getAttribute('data-appearance');
    localStorage.setItem('selectedAppearance', appearance);
    
    if (appearance === 'dark') {
      document.documentElement.style.setProperty('--bg-color', '#121212');
      document.documentElement.style.setProperty('--text-color', '#e0e0e0');
      document.documentElement.style.setProperty('--border-color', '#333');
    } else {
      document.documentElement.style.setProperty('--bg-color', '#f9f9f9');
      document.documentElement.style.setProperty('--text-color', '#333');
      document.documentElement.style.setProperty('--border-color', '#eee');
    }
  });
});

const colorCards = document.querySelectorAll('.color-card');
colorCards.forEach(card => {
  card.addEventListener('click', () => {
    colorCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    
    const color = card.getAttribute('data-color');
    localStorage.setItem('selectedColor', color);
    
    updateThemeColor(color);
  });
});

function updateThemeColor(color) {
  const colorMap = {
    'purple': '#9c27b0',
    'blue': '#2196f3',
    'pink': '#e83e8c',
    'violet': '#7c4dff',
    'indigo': '#3f51b5',
    'orange': '#ff9800'
  };
  
  document.documentElement.style.setProperty('--primary-color', colorMap[color]);
  document.documentElement.style.setProperty('--toggle-on', colorMap[color]);
}

const mainToggle = document.getElementById('main-notification-toggle');
const subToggles = document.querySelectorAll('.notification-toggle');

mainToggle.addEventListener('change', function() {
  subToggles.forEach(toggle => {
    toggle.checked = this.checked;
    toggle.disabled = !this.checked;
  });
});

subToggles.forEach(toggle => {
  toggle.disabled = !mainToggle.checked;
});

document.addEventListener('DOMContentLoaded', () => {
  const savedAppearance = localStorage.getItem('selectedAppearance');
  const savedColor = localStorage.getItem('selectedColor');
  
  if (savedAppearance) {
    appearanceCards.forEach(card => {
      if (card.getAttribute('data-appearance') === savedAppearance) {
        card.classList.add('selected');
        
        if (savedAppearance === 'dark') {
          document.documentElement.style.setProperty('--bg-color', '#121212');
          document.documentElement.style.setProperty('--text-color', '#e0e0e0');
          document.documentElement.style.setProperty('--border-color', '#333');
        }
      } else {
        card.classList.remove('selected');
      }
    });
  }
  
  if (savedColor) {
    colorCards.forEach(card => {
      if (card.getAttribute('data-color') === savedColor) {
        card.classList.add('selected');
        updateThemeColor(savedColor);
      } else {
        card.classList.remove('selected');
      }
    });
  }
});