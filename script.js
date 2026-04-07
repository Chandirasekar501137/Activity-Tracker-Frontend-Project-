// State
let activities = JSON.parse(localStorage.getItem("activities")) || [];
let currentFilter = "all";

// DOM
const DOM = {
  list: document.getElementById("activityList"),
  input: document.getElementById("taskInput"),
  progressText: document.getElementById("progressText"),
  progressFill: document.getElementById("progressFill"),
  emptyState: document.getElementById("emptyState"),
  toast: document.getElementById("toast"),
  addBtn: document.getElementById("addBtn"),
  resetBtn: document.getElementById("resetBtn"),
  filters: document.querySelectorAll(".filter")
};

// Init
init();

function init() {
  bindEvents();
  render();
}

// Events
function bindEvents() {
  DOM.addBtn.addEventListener("click", addTask);
  DOM.input.addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
  });

  DOM.resetBtn.addEventListener("click", resetAll);

  DOM.filters.forEach(btn => {
    btn.addEventListener("click", () => setFilter(btn));
  });
}

// Add Task
function addTask() {
  const value = DOM.input.value.trim();
  if (!value) return showToast("Task cannot be empty");

  activities.push({
    id: Date.now(),
    name: value,
    completed: false
  });

  DOM.input.value = "";
  save();
  render();
  showToast("Task added");
}

// Delete Task
function deleteTask(id) {
  activities = activities.filter(a => a.id !== id);
  save();
  render();
  showToast("Task removed");
}

// Complete Task
function completeTask(id) {
  activities = activities.map(a =>
    a.id === id ? { ...a, completed: true } : a
  );
  save();
  render();
}

// Reset
function resetAll() {
  if (!confirm("Reset all tasks?")) return;

  activities = activities.map(a => ({ ...a, completed: false }));
  save();
  render();
}

// Render
function render() {
  DOM.list.innerHTML = "";

  const filtered = getFiltered();

  DOM.emptyState.style.display = activities.length ? "none" : "block";

  filtered.forEach(a => {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = a.name;
    if (a.completed) text.classList.add("completed");

    const actions = createButtons(a);

    li.append(text, actions);
    DOM.list.appendChild(li);
  });

  updateProgress();
}

// Helpers
function getFiltered() {
  if (currentFilter === "pending") return activities.filter(a => !a.completed);
  if (currentFilter === "completed") return activities.filter(a => a.completed);
  return activities;
}

function createButtons(activity) {
  const div = document.createElement("div");
  div.className = "actions";

  const completeBtn = document.createElement("button");
  completeBtn.className = "btn btn-complete";
  completeBtn.textContent = activity.completed ? "Completed" : "Complete";
  completeBtn.disabled = activity.completed;
  completeBtn.onclick = () => completeTask(activity.id);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-delete";
  deleteBtn.textContent = "Remove";
  deleteBtn.onclick = () => deleteTask(activity.id);

  div.append(completeBtn, deleteBtn);
  return div;
}

function updateProgress() {
  const done = activities.filter(a => a.completed).length;
  const total = activities.length;

  DOM.progressText.textContent = `${done} / ${total} completed`;
  DOM.progressFill.style.width = total ? (done / total) * 100 + "%" : "0%";
}

function setFilter(btn) {
  currentFilter = btn.dataset.filter;

  DOM.filters.forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  render();
}

function save() {
  localStorage.setItem("activities", JSON.stringify(activities));
}

function showToast(msg) {
  DOM.toast.textContent = msg;
  DOM.toast.style.opacity = 1;

  setTimeout(() => {
    DOM.toast.style.opacity = 0;
  }, 2000);
}