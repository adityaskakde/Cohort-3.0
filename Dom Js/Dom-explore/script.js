
// DOM ELEMENTS

const themeToggle = document.querySelector("#themeToggle");
const taskForm = document.querySelector("#taskForm");
const taskHeading = document.querySelector("#taskHeading");
const titleInput = document.querySelector("#title");
const categorySelect = document.querySelector("#category");
const prioritySelect = document.querySelector("#priority");
const dateInput = document.querySelector("#date");
const tagNameText = document.querySelector("#tagName");
const progressFill = document.querySelector("#progressFill");
const progressPercent = document.querySelector("#progressPercent");
const progressText = document.querySelector("#progressText");
const elementIdText = document.querySelector("#elementId");

const classNameText = document.querySelector("#className");
const deleteModal = document.querySelector("#deleteModal");

const confirmDelete = document.querySelector("#confirmDelete");

const cancelDelete = document.querySelector("#cancelDelete");

const statusDataText = document.querySelector("#statusData");

const categoryDataText = document.querySelector("#categoryData");
const sortTasks = document.querySelector("#sortTasks");
const taskList = document.querySelector("#taskList");
const exportTasks = document.querySelector("#exportTasks");
const totalTask = document.querySelector("#totalTask");

const pendingTask = document.querySelector("#pendingTask");
const importTasks = document.querySelector("#importTasks");
const completedTask = document.querySelector("#completedTask");
const searchInput = document.querySelector("#search");
const domNode = document.querySelector("#domNode");
const filterBtns = document.querySelectorAll(".filter");
const createBox = document.querySelector("#createBox");

const removeBox = document.querySelector("#removeBox");
const toast = document.querySelector("#toast");

const cloneBox = document.querySelector("#cloneBox");

const clearBox = document.querySelector("#clearBox");

const playgroundArea = document.querySelector("#playgroundArea");
const editBox = document.querySelector("#editBox");
const colorBox = document.querySelector("#colorBox");


// GLOBAL VARIABLES

let dragIndex = null;
let currentFilter = "all";
let searchText = "";
let deleteIndex = null;
let selectedBox = null;
let editIndex = null;


let boxes = JSON.parse(localStorage.getItem("boxes")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// FORM SUBMIT


taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = titleInput.value;
  const category = categorySelect.value;
  const priority = prioritySelect.value;
  const dueDate = dateInput.value;


  // Validation

  if (title.trim() === "") {
    alert("Please Enter Task Title");
    return;
  }


  // UPDATE TASK


  if (editIndex !== null) {
    tasks[editIndex] = {
      ...tasks[editIndex],

      title,
      category,
      priority,
      dueDate,
    };

    localStorage.setItem("tasks", JSON.stringify(tasks));

    editIndex = null;

    document.querySelector(".add-btn").textContent = "+ ADD TASK";

    taskForm.reset();

    renderTasks();
    renderTasks();

    showToast("✏️ Task Updated");

    return;
  }


  // CREATE NEW TASK


  const task = {
    title,
    category,
    priority,
    dueDate,
    completed: false,
  };

  tasks.push(task);

  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskForm.reset();

  renderTasks();
  showToast("✅ Task Added");
});

function getDueStatus(date) {
  if (!date) return "⚪ No Due Date";

  const today = new Date();
  const due = new Date(date);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diff = Math.floor((due - today) / (1000 * 60 * 60 * 24));

  if (diff < 0) return "🔴 Overdue";

  if (diff === 0) return "🟠 Today";

  if (diff === 1) return "🟡 Tomorrow";

  return `🟢 ${diff} Days Left`;
}


// RENDER SINGLE TASK


function renderTask(task, index) {
  const taskItem = document.createElement("div");
  taskItem.draggable = true;

  taskItem.classList.add("task-item");
  taskItem.dataset.status = task.completed ? "completed" : "pending";

  taskItem.dataset.category = task.category;

  taskItem.innerHTML = `

    <div class="task-left">

        <input type="checkbox">

        <div>

            <h4>${task.title}</h4>

            <small>${task.category}</small>

         <p class="due-date">
<i class="ri-calendar-2-line"></i>
${getDueStatus(task.dueDate)}
</p>

        </div>

    </div>

    <div class="task-right">

        <span class="priority ${task.priority.toLowerCase()}">

            ${task.priority.toUpperCase()}

        </span>

        <button class="edit-btn">
            <i class="ri-edit-2-fill"></i>
        </button>

        <button class="delete-btn">
            <i class="ri-delete-bin-6-fill"></i>
        </button>

    </div>

    `;
 
  // DRAG START


  taskItem.addEventListener("dragstart", function () {
    dragIndex = index;

    taskItem.classList.add("dragging");
  });

 
  // DRAG END
  

  taskItem.addEventListener("dragend", function () {
    taskItem.classList.remove("dragging");
  });


  // DRAG OVER


  taskItem.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

 
  // DROP

  taskItem.addEventListener("drop", function () {
    const draggedTask = tasks[dragIndex];

    tasks.splice(dragIndex, 1);

    tasks.splice(index, 0, draggedTask);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();
  });


  // DELETE TASK
 

  const deleteBtn = taskItem.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", function () {
    deleteIndex = index;

    deleteModal.classList.add("show");
  });
  confirmDelete.addEventListener("click", function () {
    tasks.splice(deleteIndex, 1);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();

    deleteModal.classList.remove("show");

    showToast("🗑 Task Deleted");
  });
  cancelDelete.addEventListener("click", function () {
    deleteModal.classList.remove("show");
  });


  // EDIT TASK


  const editBtn = taskItem.querySelector(".edit-btn");

  editBtn.addEventListener("click", function () {
    titleInput.value = tasks[index].title;

    categorySelect.value = tasks[index].category;

    prioritySelect.value = tasks[index].priority;

    dateInput.value = tasks[index].dueDate;

    editIndex = index;

    document.querySelector(".add-btn").textContent = "UPDATE TASK";
  });


  // COMPLETE TASK


  const checkbox = taskItem.querySelector('input[type="checkbox"]');

  checkbox.checked = task.completed;

  taskItem.classList.toggle("completed", task.completed);
  checkbox.addEventListener("change", function () {
    tasks[index].completed = this.checked;

    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskItem.classList.toggle("completed", this.checked);

    updateStats();
  });
  taskItem.addEventListener("click", function () {
    tagNameText.textContent = taskItem.tagName;

    elementIdText.textContent = taskItem.id || "--";

    classNameText.textContent = taskItem.className;

    statusDataText.textContent = taskItem.dataset.status;

    categoryDataText.textContent = taskItem.dataset.category;
  });

  taskList.append(taskItem);
}


// RENDER ALL TASKS

function renderTasks() {
  taskList.innerHTML = "";
  if (tasks.length === 0) {
    taskList.innerHTML = `

        <div class="empty-state">

            <i class="ri-inbox-2-line"></i>

            <h3>No Tasks Yet</h3>

            <p>Create your first task to get started.</p>

        </div>

    `;

    updateStats();

    return;
  }

  tasks.forEach(function (task, index) {
    const matchSearch = task.title.toLowerCase().includes(searchText);

    const matchFilter =
      currentFilter === "all" ||
      (currentFilter === "pending" && !task.completed) ||
      (currentFilter === "completed" && task.completed);

    if (matchSearch && matchFilter) {
      renderTask(task, index);
    }
    if (taskList.innerHTML === "") {
      taskList.innerHTML = `

        <div class="empty-state">

            <i class="ri-search-eye-line"></i>

            <h3>No Matching Tasks</h3>

            <p>Try changing your search or filter.</p>

        </div>

    `;
    }
  });

  updateStats();
  showToast(this.checked ? "✅ Task Completed" : "↩️ Task Pending");
}
function showToast(message) {
  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(toast.timer);

  toast.timer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2000);
}

function updateStats() {
  totalTask.textContent = tasks.length;

  const pending = tasks.filter(function (task) {
    return !task.completed;
  });

  pendingTask.textContent = pending.length;

  const completed = tasks.filter(function (task) {
    return task.completed;
  });

  completedTask.textContent = completed.length;
  domNode.textContent = document.querySelectorAll("*").length;
  const percent =
    tasks.length === 0
      ? 0
      : Math.round((completed.length / tasks.length) * 100);

  progressFill.style.width = percent + "%";

  progressPercent.textContent = percent + "%";

  progressText.textContent = `${completed.length} / ${tasks.length} Tasks Completed`;
}


// INITIAL RENDER

renderTasks();
filterBtns.forEach(function (button) {
  button.addEventListener("click", function () {
    // Sab buttons se active hatao
    filterBtns.forEach(function (btn) {
      btn.classList.remove("active");
    });

    // Jis button pe click hua usko active banao
    button.classList.add("active");

    // Current filter update
    currentFilter = button.dataset.filter;

    // UI re-render
    renderTasks();
  });
});

searchInput.addEventListener("input", function () {
  searchText = this.value.toLowerCase();

  renderTasks();
});
function renderBoxes() {
  playgroundArea.innerHTML = "";

  boxes.forEach(function (boxData, index) {
    const box = document.createElement("div");

    box.classList.add("box");

    box.style.backgroundColor = boxData.color;
    if (index === selectedBox) {
      box.classList.add("selected");
    }

    box.innerHTML = `
    <div class="box-actions">

        <button class="icon-btn edit-box">
            <i class="ri-edit-line"></i>
        </button>

        <button class="icon-btn color-box">
            <i class="ri-palette-line"></i>
        </button>

    </div>

    <span>${boxData.text}</span>
`;

    const editIcon = box.querySelector(".edit-box");

    const colorIcon = box.querySelector(".color-box");

    editIcon.addEventListener("click", function (e) {
      e.stopPropagation();

      const newText = prompt("Enter Text", boxes[index].text);

      if (!newText) return;

      boxes[index].text = newText;

      localStorage.setItem("boxes", JSON.stringify(boxes));

      renderBoxes();
    });

    colorIcon.addEventListener("click", function (e) {
      e.stopPropagation();

      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);

      boxes[index].color = `rgb(${r}, ${g}, ${b})`;

      localStorage.setItem("boxes", JSON.stringify(boxes));

      const editIcon = box.querySelector(".edit-box");
      const colorIcon = box.querySelector(".color-box");

      renderBoxes();
    });
    box.addEventListener("click", function () {
      selectedBox = index;

      renderBoxes();
    });

    playgroundArea.append(box);
  });
}
createBox.addEventListener("click", function () {
  boxes.push({
    text: "DOM",
    color: "#d8c5a2",
  });

  localStorage.setItem("boxes", JSON.stringify(boxes));

  renderBoxes();
  showToast("📦 Box Created");
});

removeBox.addEventListener("click", function () {
  if (boxes.length === 0) return;

  boxes.pop();

  localStorage.setItem("boxes", JSON.stringify(boxes));

  renderBoxes();
  showToast("🗑️ Box Removed");
});

cloneBox.addEventListener("click", function () {
  if (boxes.length === 0) return;

  const lastBox = boxes[boxes.length - 1];

  boxes.push({
    text: lastBox.text,

    color: lastBox.color,
  });

  localStorage.setItem("boxes", JSON.stringify(boxes));

  renderBoxes();
  showToast("🔄 Box Cloned");
});

clearBox.addEventListener("click", function () {
  boxes = [];

  localStorage.removeItem("boxes");

  renderBoxes();
});

colorBox.addEventListener("click", function () {
  if (selectedBox === null) {
    alert("Select a box first");

    return;
  }

  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  boxes[selectedBox].color = `rgb(${r}, ${g}, ${b})`;

  localStorage.setItem("boxes", JSON.stringify(boxes));

  renderBoxes();
});
editBox.addEventListener("click", function () {
  if (selectedBox === null) {
    alert("Select a box first");

    return;
  }

  const newText = prompt("Enter Text", boxes[selectedBox].text);

  if (!newText) return;

  boxes[selectedBox].text = newText;

  localStorage.setItem("boxes", JSON.stringify(boxes));

  renderBoxes();
});


// THEME TOGGLE




const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");

  themeToggle.innerHTML = '<i class="ri-sun-line"></i>';
  showToast("🌙 Dark Mode");
} else {
  themeToggle.innerHTML = '<i class="ri-moon-clear-line"></i>';
  showToast("☀️ Light Mode");
}

// Toggle Theme

themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");

    themeToggle.innerHTML = '<i class="ri-sun-line"></i>';
  } else {
    localStorage.setItem("theme", "light");

    themeToggle.innerHTML = '<i class="ri-moon-clear-line"></i>';
  }
});
sortTasks.addEventListener("change", function () {
  const value = this.value;

  if (value === "newest") {
    tasks.reverse();
  } else if (value === "oldest") {
    tasks.reverse();
  } else if (value === "az") {
    tasks.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  } else if (value === "za") {
    tasks.sort(function (a, b) {
      return b.title.localeCompare(a.title);
    });
  } else if (value === "high") {
    const order = {
      High: 0,
      Medium: 1,
      Low: 2,
    };

    tasks.sort(function (a, b) {
      return order[a.priority] - order[b.priority];
    });
  } else if (value === "medium") {
    const order = {
      Medium: 0,
      High: 1,
      Low: 2,
    };

    tasks.sort(function (a, b) {
      return order[a.priority] - order[b.priority];
    });
  } else if (value === "low") {
    const order = {
      Low: 0,
      Medium: 1,
      High: 2,
    };

    tasks.sort(function (a, b) {
      return order[a.priority] - order[b.priority];
    });
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));

  renderTasks();
});

exportTasks.addEventListener("click", function () {
  if (tasks.length === 0) {
    showToast("⚠ No Tasks To Export");

    return;
  }

  const data = JSON.stringify(tasks, null, 2);

  const blob = new Blob([data], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "tasks.json";

  a.click();

  URL.revokeObjectURL(url);

  showToast("📤 Tasks Exported");
});
importTasks.addEventListener("change", function (e) {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (event) {
    try {
      const importedTasks = JSON.parse(event.target.result);

      tasks = importedTasks;

      localStorage.setItem("tasks", JSON.stringify(tasks));

      renderTasks();

      showToast("📥 Tasks Imported");
    } catch {
      showToast("❌ Invalid JSON File");
    }
  };

  reader.readAsText(file);
});
renderBoxes();
