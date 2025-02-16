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
  const taskTitle = document.getElementById('taskTitle').value.trim();
  const taskNotes = document.getElementById('taskNote').value.trim();
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

  document.getElementById('taskTitle').value = '';
  document.getElementById('taskNote').value = '';
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

function showDatePicker(id) {
  document.getElementById(`hidden-date-picker-${id}`).click();
}

function setDate(input, id) {
  const textInput = document.getElementById(id);
  if (input.value) {
    textInput.value = new Date(input.value).toLocaleString(); // Formats selected date
  }
}