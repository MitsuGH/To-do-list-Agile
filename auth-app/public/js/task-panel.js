function openTaskPanel() {
  document.getElementById('taskPanel').style.display = 'block';
  document.getElementById('main-content').classList.add('shrink');
}

function closeTaskPanel() {
  document.getElementById('taskPanel').style.display = 'none';
  document.getElementById('main-content').classList.remove('shrink');
}

document.querySelector('.favorite-icon').addEventListener('click', function () {
  this.classList.toggle('active');
});

function addTask() {
  const taskTitle = document.getElementById('taskInput').value.trim();
  const taskNotes = document.getElementById('taskNotes').value.trim();
  const selectedPriority = document.querySelector('input[name="priority"]:checked');
  
  if (taskTitle === '') {
    alert('Please enter a task title!');
    return;
  }

  const taskList = document.getElementById('task-list');
  const taskItem = document.createElement('div');
  taskItem.className = 'task-item';

  let priorityText = selectedPriority ? ` (${selectedPriority.value})` : '';

  taskItem.innerHTML = `
    <h3>${taskTitle}${priorityText}</h3>
    <p>${taskNotes}</p>
  `;

  taskList.appendChild(taskItem);

  document.getElementById('taskInput').value = '';
  document.getElementById('taskNotes').value = '';
  closeTaskPanel();
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

function showDatePicker() {
  const datePicker = document.getElementById("hidden-date-picker");
  datePicker.showPicker(); // Opens the date picker
}

function setDate(input) {
  const textInput = document.getElementById("due-date");
  if (input.value) {
      textInput.value = new Date(input.value).toLocaleString(); // Formats selected date
  }
}