function toggleDropdown() {
  document.querySelector('.nav-dropdown-section').classList.toggle('show');
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.nav-dropbtn')) {
    var dropdowns = document.getElementsByClassName('nav-dropdown-section');
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}