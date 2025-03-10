function openTaskPanel() {
  document.getElementById('taskPanel').style.display = 'block';
}

function closeTaskPanel() {
  document.getElementById('taskPanel').style.display = 'none';

  // Reset all input fields and selections
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskNote').value = '';
  document.getElementById('due-date').value = '';
  document.getElementById('date').value = '';
  const selectedPriority = document.querySelector('input[name="priority"]:checked');
  if (selectedPriority) {
    selectedPriority.checked = false;
  }
  document.getElementById('category').value = '';
  document.getElementById('fileInput').value = '';
  document.getElementById('fileList').innerHTML = '';
  document.getElementById('steps-list').innerHTML = '';

  // Reset button texts and hide date pickers
  const dateButton = document.getElementById('date-button');
  dateButton.innerHTML = '<i class="fa-solid fa-calendar"></i> Add Date';
  dateButton.style.color = '';
  const dueDateButton = document.getElementById('due-date-button');
  dueDateButton.innerHTML = '<i class="fa-solid fa-calendar"></i> Add Due Date';
  dueDateButton.style.color = '';
  document.getElementById('hidden-date-picker-date').style.display = 'none';
  document.getElementById('hidden-date-picker-due-date').style.display = 'none';
}

document.querySelector('.favorite-icon').addEventListener('click', function () {
  this.classList.toggle('active');
});

function addTask() {
  const taskTitle = document.getElementById('taskTitle').value.trim();
  const taskNotes = document.getElementById('taskNote').value.trim();
  const selectedPriority = document.querySelector('input[name="priority"]:checked');
  const dueDate = document.getElementById('due-date').value.trim();
  const selectedCategory = document.getElementById('category').value;

  if (taskTitle === '') {
    alert('Please enter a task title!');
    return;
  }

  if (!dueDate || !selectedPriority || !selectedCategory) {
    alert('Please set the due date (Add Due Date button), select priority (Priority button), and choose a category (Choose category button).');
    return;
  }

  const taskList = document.getElementById('task-list');
  const taskItem = document.createElement('div');
  taskItem.className = 'task-item';

  let priorityText = selectedPriority ? ` (${selectedPriority.value})` : '';
  let categoryText = selectedCategory ? ` [${selectedCategory}]` : '';

  taskItem.innerHTML = `
    <h3>${taskTitle}${priorityText}${categoryText}</h3>
    <p>${taskNotes}</p>
  `;

  taskList.appendChild(taskItem);

  // Display the added task title in the main content area
  const mainContent = document.getElementById('main-content');
  const taskTitleElement = document.createElement('div');
  taskTitleElement.className = 'task-title-item';
  taskTitleElement.innerHTML = `<h3>${taskTitle}</h3>`;
  mainContent.appendChild(taskTitleElement);

  closeTaskPanel();
}

function addStep() {
  const stepsList = document.getElementById('steps-list');
  const stepItem = document.createElement('div');
  stepItem.className = 'step-item';
  stepItem.innerHTML = `
    <input type="text" placeholder="Step">
    <button onclick="removeStep(this)">Remove</button>
  `;
  stepsList.appendChild(stepItem);
}

function removeStep(button) {
  const stepItem = button.parentElement;
  stepItem.remove();
}

function showDatePicker(id) {
  const hiddenInput = document.getElementById(`hidden-date-picker-${id}`);
  
  if (hiddenInput) {
    hiddenInput.style.display = "block"; 
    hiddenInput.focus(); 
    hiddenInput.click();
  } else {
    console.error(`Element #hidden-date-picker-${id} not found.`);
  }
}

function setDate(input, id) {
  const button = document.getElementById(`${id}-button`);
  if (input.value) {
    const formattedDate = new Date(input.value).toLocaleString(); // Formats selected date
    button.textContent = formattedDate;
    button.style.color = 'white'; // Set the button text color to white
    const icon = button.querySelector('i');
    if (icon) {
      icon.style.display = 'none'; // Remove the small calendar icon
    }
    input.style.display = 'none'; // Hide the date picker input
  }
}

function handleFileSelect(event) {
  const files = event.target.files;
  const fileList = document.getElementById('fileList');
  fileList.innerHTML = '';

  for (let i = 0; i < files.length; i++) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `<i class="fa-solid fa-file"></i> ${files[i].name}`;
    fileList.appendChild(fileItem);
  }
}

function toggleCategoryDropdown() {
  const categorySelect = document.getElementById('category');
  categorySelect.style.display = categorySelect.style.display === 'none' ? 'block' : 'none';
}

function updateCategory(select) {
  const selectedCategory = select.options[select.selectedIndex].text;
  const categoryButton = document.getElementById('categoryButton');
  categoryButton.textContent = selectedCategory;
  select.style.display = 'none';
}