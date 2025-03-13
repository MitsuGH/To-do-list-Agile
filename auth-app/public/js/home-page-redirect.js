
// Check if user is already signed in
function checkAuth() {
  const currentUser = localStorage.getItem('currentUser');
  const currentPath = window.location.pathname;
  
  // If user is logged in and trying to access auth pages, redirect to main app
  if (currentUser) {
    if (currentPath.includes('sign-in.html') || 
        currentPath.includes('sign-up.html') || 
        currentPath.includes('forgot-pass.html')) {
      window.location.href = 'home-page.html';
    }
  } else {
    // If user is not logged in and trying to access the main app, redirect to signin
    if (currentPath.includes('home-page.html')) {
      window.location.href = 'sign-in.html';
    }
  }
}

// Add to auth pages
document.addEventListener('DOMContentLoaded', checkAuth);
document.addEventListener('DOMContentLoaded', function() {
  // Get profile image element
  const profileImage = document.querySelector('.profile-img');
  
  // Add click event listener to profile image
  if (profileImage) {
    profileImage.addEventListener('click', function() {
      // Redirect to profile page
      window.location.href = 'profile.html';
    });
    
    // Add cursor style to indicate it's clickable
    profileImage.style.cursor = 'pointer';
  }
});
