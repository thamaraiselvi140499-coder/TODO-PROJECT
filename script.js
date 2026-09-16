let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let editingTaskId = null;

// Add Task
function addTask() {

    const taskInput = document.getElementById("taskInput");
    const taskDate = document.getElementById("taskDate");
    const taskPriority = document.getElementById("taskPriority");
    const taskCategory = document.getElementById("taskCategory");

    const taskText = taskInput.value.trim();
    const date = taskDate.value;
    const priority = taskPriority.value;
    const category = taskCategory.value;


    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        date: date,
        priority: priority,
        category: category,
        completed: false
    };

    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskInput.value = "";
    taskDate.value = "";
    taskPriority.value = "medium";
    taskCategory.value = "work";

    displayTasks();
}


// Display Tasks
function displayTasks() {

    const taskList = document.getElementById("taskList");
    const searchInput = document.getElementById("searchInput");

    const searchText = searchInput.value.toLowerCase();

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(function(task) {

        // Search
        const matchesSearch =
            task.text.toLowerCase().includes(searchText);

        // Filter
        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "pending" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

            const selectedCategory =
    document.getElementById("categoryFilter").value;

const matchesCategory =
    selectedCategory === "all" ||
    task.category === selectedCategory;

        return matchesSearch && matchesFilter && matchesCategory;
    });

    // Sort by Priority
const priorityOrder = {
    high: 1,
    medium: 2,
    low: 3
};

filteredTasks.sort(function(a, b) {
    return (priorityOrder[a.priority] || 2) -
           (priorityOrder[b.priority] || 2);
});

if (filteredTasks.length === 0) {
    taskList.innerHTML = `
        <div class="empty-message">
            📝 No tasks found!
        </div>
    `;
    updateCounter();
    return;
}

    filteredTasks.forEach(function(task) {

        const taskDiv = document.createElement("div");

        taskDiv.className = "task";

        if (task.completed) {
            taskDiv.classList.add("completed");
        }


        // Task information
        const taskInfo = document.createElement("div");

        taskInfo.className = "task-info";


        // EDIT MODE
        if (editingTaskId === task.id) {

            taskInfo.innerHTML = `
                <input 
                    type="text"
                    id="edit-text-${task.id}"
                    value="${task.text}"
                    class="edit-input"
                >

                <input 
                    type="date"
                    id="edit-date-${task.id}"
                    value="${task.date || ""}"
                    class="edit-input"
                >

                <select 
    id="edit-priority-${task.id}"
    class="edit-input"
>
    <option value="low" ${task.priority === "low" ? "selected" : ""}>
        🟢 Low
    </option>

    <option value="medium" ${task.priority === "medium" || !task.priority ? "selected" : ""}>
        🟡 Medium
    </option>

    <option value="high" ${task.priority === "high" ? "selected" : ""}>
        🔴 High
    </option>
</select>

<select 
    id="edit-category-${task.id}"
    class="edit-input"
>
    <option value="work" ${task.category === "work" ? "selected" : ""}>
        💼 Work
    </option>

    <option value="study" ${task.category === "study" ? "selected" : ""}>
        📚 Study
    </option>

    <option value="personal" ${task.category === "personal" ? "selected" : ""}>
        🏠 Personal
    </option>

    <option value="shopping" ${task.category === "shopping" ? "selected" : ""}>
        🛒 Shopping
    </option>
</select>
            `;

        }

        // NORMAL MODE
        else {

           taskInfo.innerHTML = `
    <span class="task-name">${task.text}</span>

    <span class="task-date">
    ${task.date || ""}
    ${
        task.date &&
        new Date(task.date) < new Date() &&
        !task.completed
             ? ' <span class="overdue">⚠️ Overdue</span>'
            : ""
    }
</span>

    <span class="task-priority priority-${task.priority || "medium"}">
        ${
            task.priority === "high"
                ? "🔴 High"
                : task.priority === "low"
                ? "🟢 Low"
                : "🟡 Medium"
        }
    </span>

    <span class="task-category">
    ${
        task.category === "work"
            ? "💼 Work"
            : task.category === "study"
            ? "📚 Study"
            : task.category === "personal"
            ? "🏠 Personal"
            : "🛒 Shopping"
    }
</span>

`;
        }


        // Buttons
        const taskButtons = document.createElement("div");

        taskButtons.className = "task-buttons";


        // EDIT MODE BUTTONS
        if (editingTaskId === task.id) {

            taskButtons.innerHTML = `
                <button class="save-btn" onclick="saveEdit(${task.id})">
                    💾 Save
                </button>

                <button class="cancel-btn" onclick="cancelEdit()">
                    ❌ Cancel
                </button>
            `;

        }

        // NORMAL MODE BUTTONS
        else {

            taskButtons.innerHTML = `
                <button 
                    class="complete-btn"
                    onclick="completeTask(${task.id})">
                    ${task.completed ? "↩️" : "✅"}
                </button>

                <button 
                    class="edit-btn"
                    onclick="editTask(${task.id})">
                    ✏️
                </button>

                <button 
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">
                    🗑️
                </button>
            `;

        }


        taskDiv.appendChild(taskInfo);
        taskDiv.appendChild(taskButtons);

        taskList.appendChild(taskDiv);

    });


    // Update counter
    updateCounter();

    function updateCounter() {
    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const pending = total - completed;

    document.getElementById("totalCount").textContent = total;
    document.getElementById("completedCount").textContent = completed;
    document.getElementById("pendingCount").textContent = pending;


    // Progress calculation
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(function(task) {
        return task.completed;
    }).length;

    let progress = 0;

    if (totalTasks > 0) {
        progress = Math.round((completedTasks / totalTasks) * 100);
    }

    document.getElementById("progressPercent").textContent = progress + "%";
    document.getElementById("progressFill").style.width = progress + "%";
}
}


// Complete Task
function completeTask(id) {

    tasks.forEach(function(task) {

        if (task.id === id) {
            task.completed = !task.completed;
        }

    });

     localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTasks();
}


// Edit Task
function editTask(id) {
    editingTaskId = id;
    displayTasks();
}

function saveEdit(id) {

    const textInput = document.getElementById(`edit-text-${id}`);
    const dateInput = document.getElementById(`edit-date-${id}`);
    const priorityInput = document.getElementById(`edit-priority-${id}`);
    const categoryInput = document.getElementById(`edit-category-${id}`);

    const newText = textInput.value.trim();
    const newDate = dateInput.value;
    const newPriority = priorityInput.value;
    const newCategory = categoryInput.value;
    

    if (newText === "") {
        alert("Please enter a task!");
        return;
    }

    const task = tasks.find(function(task) {
        return task.id === id;
    });

    task.text = newText;
    task.date = newDate;
    task.priority = newPriority;
    task.category = newCategory;

    localStorage.setItem("tasks", JSON.stringify(tasks));

    editingTaskId = null;

    displayTasks();
}
function cancelEdit() {
    editingTaskId = null;
    displayTasks();
}

// Delete Task
function deleteTask(id) {

    const confirmDelete = confirm("Are you sure you want to delete this task?");

    if (!confirmDelete) {
        return;
    }

    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTasks();
}


// Filter Tasks
function filterTasks(filter) {

    currentFilter = filter;

    displayTasks();
}

updateCounter();

function filterByCategory() {
    displayTasks();
}


// Initial display
displayTasks();

function updateCounter() {

    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const pending = total - completed;

    document.getElementById("totalCount").textContent = total;

    document.getElementById("pendingCount").textContent = pending;

    document.getElementById("completedCount").textContent = completed;
}

function toggleDarkMode() {

    document.body.classList.toggle("dark");

    const button = document.getElementById("darkModeBtn");

    if (document.body.classList.contains("dark")) {
        button.textContent = "☀️";
    } else {
        button.textContent = "🌙";
    }
}

function sortTasks() {
    const sortValue = document.getElementById("sortTasks").value;

    if (sortValue === "priority") {
        const priorityOrder = {
            high: 1,
            medium: 2,
            low: 3
        };

        tasks.sort(function(a, b) {
            return (priorityOrder[a.priority] || 2) -
                   (priorityOrder[b.priority] || 2);
        });
    }

    else if (sortValue === "date") {
        tasks.sort(function(a, b) {
            return new Date(a.date || "9999-12-31") -
                   new Date(b.date || "9999-12-31");
        });
    }

    else if (sortValue === "name") {
        tasks.sort(function(a, b) {
            return a.text.toLowerCase().localeCompare(
                b.text.toLowerCase()
            );
        });
    }

    displayTasks();
}
function clearAllTasks() {

    const confirmClear = confirm(
        "Are you sure you want to delete all tasks?"
    );

    if (!confirmClear) {
        return;
    }

    tasks = [];

    localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTasks();
}