
document.addEventListener('DOMContentLoaded', () => {
  // Tab switching functionality
  const tabs = document.querySelectorAll('.settings-tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Hide all tab contents
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Show the corresponding tab content
      const tabId = tab.getAttribute('data-tab');
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });
  
  // Theme selection
  const lightTheme = document.querySelector('.appearance-option.light');
  const darkTheme = document.querySelector('.appearance-option.dark');
  
  lightTheme.addEventListener('click', () => {
    lightTheme.classList.add('active');
    darkTheme.classList.remove('active');
    // You can implement theme switching logic here
  });
  
  darkTheme.addEventListener('click', () => {
    darkTheme.classList.add('active');
    lightTheme.classList.remove('active');
    // You can implement theme switching logic here
  });
  
  // Color theme options
  const colorOptions = document.querySelectorAll('.color-option');
  
  colorOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove active from all options
      colorOptions.forEach(opt => opt.classList.remove('active'));
      // Add active to clicked option
      option.classList.add('active');
      // You can implement color theme switching logic here
    });
  });
  
  // Profile form loading
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const locationInput = document.getElementById('location');
  const occupationInput = document.getElementById('occupation');
  const profileNameEl = document.getElementById('profile-name');
  const profileEmailEl = document.getElementById('profile-email');
  
  // Load user data from localStorage
  const loadUserProfile = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (currentUser) {
      fullNameInput.value = currentUser.name || '';
      emailInput.value = currentUser.email || '';
      locationInput.value = currentUser.location || '';
      occupationInput.value = currentUser.occupation || '';
      
      // Also update sidebar info
      if (profileNameEl) profileNameEl.textContent = currentUser.name || 'Username';
      if (profileEmailEl) profileEmailEl.textContent = currentUser.email || 'user@example.com';
    }
  };
  
  loadUserProfile();
  
  // Save user profile
  const saveProfileBtn = document.querySelector('.save-profile-btn');
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', () => {
      // Get current user
      let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      // Update user information
      currentUser.name = fullNameInput.value;
      currentUser.email = emailInput.value;
      currentUser.location = locationInput.value;
      currentUser.occupation = occupationInput.value;
      
      // Save back to localStorage
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      // Update sidebar info
      if (profileNameEl) profileNameEl.textContent = currentUser.name || 'Username';
      if (profileEmailEl) profileEmailEl.textContent = currentUser.email || 'user@example.com';
      
      alert('Profile updated successfully!');
    });
  }
  
  // Password update functionality
  const updatePasswordBtn = document.querySelector('.update-password-btn');
  if (updatePasswordBtn) {
    updatePasswordBtn.addEventListener('click', () => {
      const currentPassword = document.getElementById('currentPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Please fill in all password fields');
        return;
      }
      
      if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
      }
      
      // Here you would typically verify the current password against stored password
      // For this demo we'll just update it
      alert('Password updated successfully!');
      
      // Clear password fields
      document.getElementById('currentPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmPassword').value = '';
    });
  }
  
  // Change profile photo functionality
  const changePhotoBtn = document.querySelector('.change-photo-btn');
  if (changePhotoBtn) {
    changePhotoBtn.addEventListener('click', () => {
      // This would typically open a file dialog
      alert('This would open a file upload dialog in a real app');
    });
  }
});
