document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskDetailSidebar = document.getElementById('task-detail-sidebar');
  const overlay = document.getElementById('overlay');
  const closeDetailBtn = document.getElementById('close-detail-btn');
  const saveTaskBtn = document.getElementById('save-task-btn');
  const cancelTaskBtn = document.getElementById('cancel-task-btn');
  const tasksContainer = document.getElementById('tasks-container');
  const overdueTasksContainer = document.getElementById('overdue-tasks-container');
  const clearAllBtn = document.getElementById('clear-all-btn');
  const overdueHeader = document.getElementById('overdue-header');
  const fullDateElement = document.getElementById('full-date');
  const addStepBtn = document.querySelector('.add-step-btn');
  const stepsContainer = document.getElementById('steps-container');
  const stepInput = document.getElementById('step-input');
  const fileUpload = document.getElementById('file-upload');
  const filesList = document.getElementById('files-list');
  const searchInput = document.querySelector('.search-box input');

  // State
  let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  let currentTaskId = null;
  let isEditing = false;
  let currentView = 'dashboard';
  let steps = [];
  let uploadedFiles = [];

  // Set current date
  const setCurrentDate = () => {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    fullDateElement.textContent = now.toLocaleDateString('en-US', options);
  };
  setCurrentDate();

  // API Functions using localStorage instead of server
  const saveTasksToStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const fetchTasks = () => {
    tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    renderTasks();
  };

  const createTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdDate: new Date().toISOString().split('T')[0]
    };
    tasks.push(newTask);
    saveTasksToStorage();
    renderTasks();
    return newTask;
  };

  const updateTask = (taskId, taskData) => {
    const updatedTask = { ...taskData, id: taskId };
    tasks = tasks.map(task => task.id === taskId ? updatedTask : task);
    saveTasksToStorage();
    renderTasks();
    return updatedTask;
  };

  const deleteTask = (taskId) => {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasksToStorage();
    renderTasks();
  };

  const toggleTaskCompletion = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      updateTask(taskId, updatedTask);
    }
  };

  // UI Functions
  const openTaskDetailSidebar = (taskId = null) => {
    taskDetailSidebar.classList.add('open');
    overlay.classList.add('active');

    // Reset form
    document.getElementById('task-title-input').value = '';
    document.getElementById('task-date').value = '';
    document.getElementById('task-due-date').value = '';
    document.querySelectorAll('input[name="priority"]').forEach(radio => radio.checked = false);
    document.getElementById('task-note').value = '';
    document.getElementById('category-dropdown').value = '';
    steps = [];
    uploadedFiles = [];
    renderSteps();
    renderFiles();

    // Set save button text
    saveTaskBtn.textContent = taskId ? 'Update' : 'Add';

    // If editing existing task
    if (taskId) {
      isEditing = true;
      currentTaskId = taskId;
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        document.getElementById('task-title-input').value = task.title;
        document.getElementById('task-date').value = task.createdDate || '';
        document.getElementById('task-due-date').value = task.dueDate || '';
        const priorityRadio = document.querySelector(`input[name="priority"][value="${task.priority || 'medium'}"]`);
        if (priorityRadio) priorityRadio.checked = true;
        document.getElementById('category-dropdown').value = task.category || '';
        document.getElementById('task-note').value = task.note || '';
        steps = task.steps || [];
        uploadedFiles = task.files || [];
        renderSteps();
        renderFiles();
      }
    } else {
      isEditing = false;
      currentTaskId = null;
    }
  };

  const closeTaskDetailSidebar = () => {
    taskDetailSidebar.classList.remove('open');
    overlay.classList.remove('active');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
  };

  const createTaskElement = (task) => {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-card';
    taskElement.setAttribute('data-id', task.id);

    const checkbox = document.createElement('div');
    checkbox.className = `task-checkbox ${task.completed ? 'completed' : ''}`;
    checkbox.innerHTML = task.completed ? '<i class="fas fa-check"></i>' : '';
    checkbox.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent opening sidebar
      toggleTaskCompletion(task.id);
    });

    const content = document.createElement('div');
    content.className = 'task-content';

    const title = document.createElement('div');
    title.className = 'task-title';
    title.textContent = task.title;

    const infoText = document.createElement('div');
    infoText.className = 'task-info';
    
    // Format: "Category • Added Date • Due Date" with icons
    let infoString = task.category || 'Task';
    
    if (task.createdDate) {
      infoString += ` • <i class="far fa-calendar"></i> ${formatDate(task.createdDate)}`;
    }
    
    if (task.dueDate) {
      infoString += ` • <i class="fa-regular fa-calendar-minus"></i> ${formatDate(task.dueDate)}`;
    }
    
    infoText.innerHTML = infoString;
    
    content.appendChild(title);
    content.appendChild(infoText);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'task-action-btn favorite-btn';
    favoriteBtn.innerHTML = `<i class="${task.favorite ? 'fas' : 'far'} fa-star"></i>`;
    favoriteBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await updateTask(task.id, { ...task, favorite: !task.favorite });
    });

    const editBtn = document.createElement('button');
    editBtn.className = 'task-action-btn edit-btn';
    editBtn.innerHTML = '<i class="fas fa-pen"></i>';
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openTaskDetailSidebar(task.id);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-action-btn delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTask(task.id);
    });

    actions.appendChild(favoriteBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    taskElement.appendChild(checkbox);
    taskElement.appendChild(content);
    taskElement.appendChild(actions);

    taskElement.addEventListener('click', () => {
      if (!task.completed) {
        openTaskDetailSidebar(task.id);
      }
    });

    return taskElement;
  };

  const renderTasks = () => {
    tasksContainer.innerHTML = '';
    overdueTasksContainer.innerHTML = '';

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const regularTasks = [];
    const overdueTasks = [];
    let displayTasks = [];

    // Filter tasks based on current view
    if (currentView === 'dashboard') {
      displayTasks = tasks.filter(task => !task.completed);
    } else if (currentView === 'favorites') {
      displayTasks = tasks.filter(task => task.favorite);
    } else if (currentView === 'completed') {
      displayTasks = tasks.filter(task => task.completed);
    }

    // For dashboard view, separate overdue tasks
    if (currentView === 'dashboard') {
      displayTasks.forEach(task => {
        if (task.dueDate) {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);

          if (dueDate < now && !task.completed) {
            overdueTasks.push(task);
            return;
          }
        }
        regularTasks.push(task);
      });

      regularTasks.forEach(task => {
        tasksContainer.appendChild(createTaskElement(task));
      });

      overdueTasks.forEach(task => {
        overdueTasksContainer.appendChild(createTaskElement(task));
      });

      // Show/hide overdue section
      if (overdueTasks.length > 0) {
        overdueHeader.style.display = 'flex';
        overdueTasksContainer.style.display = 'block';
      } else {
        overdueHeader.style.display = 'none';
        overdueTasksContainer.style.display = 'none';
      }
    } else {
      // For favorites and completed views, just show all matching tasks
      displayTasks.forEach(task => {
        tasksContainer.appendChild(createTaskElement(task));
      });

      // Hide overdue section
      overdueHeader.style.display = 'none';
      overdueTasksContainer.style.display = 'none';
    }
  };

  // Create sort dropdown
  const sortBtn = document.querySelector('.sort-btn');
  const sortDropdown = document.createElement('div');
  sortDropdown.className = 'sort-dropdown';
  
  const sortOptions = [
    { label: 'Due Date', key: 'dueDate', direction: 'asc', directionLabel: 'Soonest to Latest' },
    { label: 'Priority', key: 'priority', direction: 'desc', directionLabel: 'High to Low' },
    { label: 'Alphabetically', key: 'title', direction: 'asc', directionLabel: 'A to Z' },
    { label: 'Creation Date', key: 'createdDate', direction: 'desc', directionLabel: 'Newest First' }
  ];
  
  sortOptions.forEach(option => {
    const sortOptionElement = document.createElement('div');
    sortOptionElement.className = 'sort-option';
    sortOptionElement.innerHTML = `
      <span>${option.label}</span>
      <span class="sort-option-direction">${option.directionLabel}</span>
    `;
    
    sortOptionElement.addEventListener('click', () => {
      sortTasks(option.key, option.direction);
      // Toggle direction for next click
      option.direction = option.direction === 'asc' ? 'desc' : 'asc';
      option.directionLabel = getDirectionLabel(option.label, option.direction);
      sortOptionElement.querySelector('.sort-option-direction').textContent = option.directionLabel;
      sortDropdown.classList.remove('show');
    });
    
    sortDropdown.appendChild(sortOptionElement);
  });
  
  sortBtn.appendChild(sortDropdown);
  
  function getDirectionLabel(type, direction) {
    switch (type) {
      case 'Due Date':
        return direction === 'asc' ? 'Soonest to Latest' : 'Latest to Soonest';
      case 'Priority':
        return direction === 'desc' ? 'High to Low' : 'Low to High';
      case 'Alphabetically':
        return direction === 'asc' ? 'A to Z' : 'Z to A';
      case 'Creation Date':
        return direction === 'desc' ? 'Newest First' : 'Oldest First';
      default:
        return '';
    }
  }
  
  function sortTasks(key, direction) {
    tasks.sort((a, b) => {
      let valueA, valueB;
      
      // Handle missing values
      if (!a[key] && !b[key]) return 0;
      if (!a[key]) return direction === 'asc' ? 1 : -1;
      if (!b[key]) return direction === 'asc' ? -1 : 1;
      
      // Sort by priority specially
      if (key === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        valueA = priorityOrder[a[key]] || 0;
        valueB = priorityOrder[b[key]] || 0;
      } else {
        valueA = a[key];
        valueB = b[key];
      }
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      } else {
        return direction === 'asc' ? (valueA - valueB) : (valueB - valueA);
      }
    });
    
    saveTasksToStorage();
    renderTasks();
  }
  
  sortBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sortDropdown.classList.toggle('show');
  });
  
  // Close dropdown when clicking elsewhere
  document.addEventListener('click', (e) => {
    if (!sortBtn.contains(e.target)) {
      sortDropdown.classList.remove('show');
    }
  });
  
  // Event Listeners
  addTaskBtn.addEventListener('click', () => openTaskDetailSidebar());
  closeDetailBtn.addEventListener('click', closeTaskDetailSidebar);
  overlay.addEventListener('click', closeTaskDetailSidebar);

  // Handle sidebar navigation
  document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-menu .menu-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');

      if (item.querySelector('span').textContent === 'Dashboard') {
        currentView = 'dashboard';
      } else if (item.querySelector('span').textContent === 'Favorites') {
        currentView = 'favorites';
      } else if (item.querySelector('span').textContent === 'Completed') {
        currentView = 'completed';
      }

      renderTasks();
    });
  });

  saveTaskBtn.addEventListener('click', () => {
    const title = document.getElementById('task-title-input').value;
    const dueDate = document.getElementById('task-due-date').value;
    const priority = document.querySelector('input[name="priority"]:checked')?.value || 'medium';
    const category = document.getElementById('category-dropdown').value;

    if (!title || !dueDate || !priority || !category) {
      alert('Please fill in all required fields (Title, Due Date, Priority, Category).');
      return;
    }

    const taskData = {
      title,
      dueDate: dueDate || null,
      priority,
      category,
      note: document.getElementById('task-note').value || '',
      completed: false,
      steps: steps,
      files: uploadedFiles,
      createdDate: new Date().toISOString().split('T')[0]
    };

    if (isEditing && currentTaskId) {
      updateTask(currentTaskId, { ...tasks.find(t => t.id === currentTaskId), ...taskData });
    } else {
      createTask(taskData);
    }

    closeTaskDetailSidebar();
  });

  cancelTaskBtn.addEventListener('click', closeTaskDetailSidebar);

  clearAllBtn.addEventListener('click', async () => {
    let tasksToDelete = [];

    // Filter tasks based on current view
    if (currentView === 'dashboard') {
      tasksToDelete = tasks.filter(task => !task.completed);
    } else if (currentView === 'favorites') {
      tasksToDelete = tasks.filter(task => task.favorite);
    } else if (currentView === 'completed') {
      tasksToDelete = tasks.filter(task => task.completed);
    }

    if (tasksToDelete.length === 0) {
      alert('No tasks to clear in this view.');
      return;
    }

    const confirmed = confirm(`Are you sure you want to clear all tasks in the ${currentView} view?`);
    if (confirmed) {
      for (const task of tasksToDelete) {
        await deleteTask(task.id);
      }
    }
  });
  
  // Initial fetch
  fetchTasks();

  // Step Management
  const stepInputContainer = document.querySelector('.step-input-container');
  stepInputContainer.style.display = 'none';
  
  addStepBtn.addEventListener('click', () => {
    // Toggle between button and input field
    addStepBtn.style.display = 'none';
    stepInputContainer.style.display = 'block';
    stepInput.focus();
  });
  
  stepInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addStep();
      // After adding a step, keep the input field visible for adding more steps
      stepInput.focus();
    }
  });
  
  stepInput.addEventListener('blur', () => {
    if (stepInput.value.trim() === '') {
      // If input is empty when blurred, show the button again
      setTimeout(() => {
        stepInputContainer.style.display = 'none';
        addStepBtn.style.display = 'block';
      }, 200);
    }
  });

  function addStep() {
    const stepText = stepInput.value.trim();
    if (stepText) {
      steps.push(stepText);
      stepInput.value = '';
      renderSteps();
    }
  }

  function renderSteps() {
    if (!stepsContainer) return;
    
    stepsContainer.innerHTML = '';
    steps.forEach((step, index) => {
      const stepElement = document.createElement('div');
      stepElement.className = 'step-item';
      
      const stepContent = document.createElement('div');
      stepContent.innerHTML = `${index + 1}. ${step}`;
      
      const removeBtn = document.createElement('button');
      removeBtn.innerHTML = '<i class="fas fa-times"></i>';
      removeBtn.className = 'remove-step-btn';
      removeBtn.addEventListener('click', () => {
        steps.splice(index, 1);
        renderSteps();
      });
      
      stepElement.appendChild(stepContent);
      stepElement.appendChild(removeBtn);
      stepsContainer.appendChild(stepElement);
    });
  }

  // File Upload Management
  fileUpload.addEventListener('change', handleFileUpload);

  function handleFileUpload(e) {
    const files = e.target.files;
    if (files.length > 0) {
      // Check maximum of 3 files
      if (uploadedFiles.length + files.length > 3) {
        alert('You can only upload a maximum of 3 files.');
        return;
      }
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        uploadedFiles.push({
          name: file.name,
          type: file.type,
          size: file.size
        });
      }
      
      renderFiles();
      fileUpload.value = ''; // Reset input
    }
  }

  function renderFiles() {
    if (!filesList) return;
    
    filesList.innerHTML = '';
    uploadedFiles.forEach((file, index) => {
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      
      const fileName = document.createElement('div');
      fileName.className = 'file-name';
      fileName.textContent = file.name;
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'file-remove';
      removeBtn.innerHTML = '<i class="fas fa-times"></i>';
      removeBtn.addEventListener('click', () => {
        uploadedFiles.splice(index, 1);
        renderFiles();
      });
      
      fileItem.appendChild(fileName);
      fileItem.appendChild(removeBtn);
      filesList.appendChild(fileItem);
    });
  }

  // Clear All button repositioning
  clearAllBtn.style.position = 'absolute';
  clearAllBtn.style.bottom = '20px';
  clearAllBtn.style.right = '20px';
  
  // Search functionality
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm.length > 0) {
      const filteredTasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm)
      );
      
      // Temporarily store current tasks view
      const currentTasks = [...tasks];
      
      // Replace with filtered results and render
      tasks = filteredTasks;
      renderTasks();
      
      // Restore original tasks
      tasks = currentTasks;
    } else {
      // If search box is empty, show all tasks
      renderTasks();
    }
  });
});