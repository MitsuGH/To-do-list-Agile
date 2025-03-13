
document.addEventListener('DOMContentLoaded', function() {
  const signInForm = document.getElementById('signin-form');
  
  if (signInForm) {
    signInForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
          const userData = await response.json();
          // Store user data in localStorage
          localStorage.setItem('currentUser', JSON.stringify(userData));
          // Redirect to home page
          window.location.href = '/home';
        } else {
          const error = await response.json();
          alert(error.message || 'Invalid username or password');
        }
      } catch (error) {
        console.error('Sign-in error:', error);
        alert('An error occurred during sign-in. Please try again.');
      }
    });
  }
});
