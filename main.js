const taskList = document.getElementById('taskList');
const taskModal = document.getElementById('taskModal');
const taskInput = document.getElementById('taskInput');
const errorMsg = document.getElementById('errorMsg');
const btnAddTask = document.getElementById('btnAddTask');
const btnCancel = taskModal.querySelector('.btn-cancel');
const btnSave = taskModal.querySelector('.btn-submit');
const closeBtn = taskModal.querySelector('.close-btn');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editId = null;
let currentFilter = 'All';

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    const filtered = tasks.filter(t => currentFilter === 'All' || t.status === currentFilter);
    filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <span class="task-text ${task.status === 'Completed' ? 'completed' : ''}">${task.title}</span>
            <div class="task-actions">
                ${task.status === 'Pending' ? `<button class="complete-btn">Complete</button>` : ''}
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        // Complete
        li.querySelector('.complete-btn')?.addEventListener('click', () => {
            task.status = 'Completed';
            saveTasks();
            renderTasks();
        });
        // Edit
        li.querySelector('.edit-btn').addEventListener('click', () => {
            openModal(task.id);
        });
        // Delete
        li.querySelector('.delete-btn').addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });
        taskList.appendChild(li);
    });
}

function openModal(id = null) {
    taskModal.style.display = 'flex';
    if (id !== null) {
        editId = id;
        const task = tasks.find(t => t.id === id);
        taskInput.value = task.title;
        taskModal.querySelector('.modal-title').innerText = 'Edit Task';
    } else {
        editId = null;
        taskInput.value = '';
        taskModal.querySelector('.modal-title').innerText = 'Add Task';
    }
    errorMsg.style.display = 'none';
    taskInput.focus();
}

function closeModal() { taskModal.style.display = 'none'; }

function saveTask() {
    const title = taskInput.value.trim();
    if (!title) {
        errorMsg.style.display = 'block';
        return;
    }
    if (editId !== null) {
        const task = tasks.find(t => t.id === editId);
        task.title = title;
    } else {
        tasks.push({ id: Date.now(), title, status: 'Pending' });
    }
    saveTasks();
    renderTasks();
    closeModal();
}

btnAddTask.addEventListener('click', () => openModal());
btnCancel.addEventListener('click', closeModal);
closeBtn.addEventListener('click', closeModal);
btnSave.addEventListener('click', saveTask);
window.addEventListener('click', e => { if (e.target === taskModal) closeModal(); });
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

renderTasks();

function searchTasks() {
    let query = document.getElementById("searchInput").value.toLowerCase();
    let listItems = document.querySelectorAll("#taskList li");

    listItems.forEach(li => {
        let taskText = li.querySelector("span").textContent.toLowerCase();
        if (taskText.includes(query)) {
            li.style.display = "";
        } else {
            li.style.display = "none";
        }
    });
}
