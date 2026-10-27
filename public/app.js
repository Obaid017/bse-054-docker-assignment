// Study Planner front-end logic (data is kept in the browser via localStorage).
const STORAGE_KEY = "study-planner-tasks";

const form = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const subjectInput = document.getElementById("subject");
const dueInput = document.getElementById("due");
const list = document.getElementById("task-list");
const emptyMsg = document.getElementById("empty");
const summary = document.getElementById("summary");
const filterButtons = document.querySelectorAll(".filter");

let tasks = loadTasks();
let currentFilter = "all";

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function render() {
  list.innerHTML = "";

  const visible = tasks.filter((t) =>
    currentFilter === "all" ? true : currentFilter === "done" ? t.done : !t.done
  );

  visible.forEach((task) => {
    const isLate = !task.done && task.due && task.due < todayString();

    const li = document.createElement("li");
    li.className = "task" + (task.done ? " done" : "") + (isLate ? " late" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", "Mark " + task.title + " as done");
    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      saveTasks();
      render();
    });

    const body = document.createElement("div");
    body.className = "task-body";

    const title = document.createElement("p");
    title.className = "task-title";
    title.textContent = task.title;

    const meta = document.createElement("p");
    meta.className = "task-meta";
    const parts = [];
    if (task.subject) parts.push(task.subject);
    meta.textContent = parts.join("");
    if (task.due) {
      const due = document.createElement("span");
      due.className = "due";
      due.textContent = (task.subject ? " - " : "") + (isLate ? "Overdue, was due " : "Due ") + formatDate(task.due);
      meta.appendChild(due);
    }

    body.append(title, meta);

    const del = document.createElement("button");
    del.className = "btn-delete";
    del.textContent = "Delete";
    del.setAttribute("aria-label", "Delete " + task.title);
    del.addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      render();
    });

    li.append(checkbox, body, del);
    list.appendChild(li);
  });

  emptyMsg.hidden = visible.length !== 0;

  const open = tasks.filter((t) => !t.done).length;
  summary.textContent = tasks.length
    ? open + " to do, " + (tasks.length - open) + " done"
    : "Plan your study tasks and track deadlines.";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title) return;

  tasks.unshift({
    id: Date.now(),
    title,
    subject: subjectInput.value.trim(),
    due: dueInput.value,
    done: false,
  });
  saveTasks();
  form.reset();
  titleInput.focus();
  render();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterButtons.forEach((b) => b.classList.toggle("active", b === btn));
    render();
  });
});

render();
