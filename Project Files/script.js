document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task");
    const datetimeInput = document.getElementById("datetime");
    const priorityInput = document.getElementById("priority"); // Add this line
    const addBtn = document.getElementById("add");
    const taskList = document.getElementById("task-list");

    // Create an audio element for the notification sound
    const notificationSound = new Audio("./mp3.wav"); // Replace "notification.mp3" with the path to your sound file

    addBtn.addEventListener("click", addTask);

    loadTasks();

    function addTask() {
        const taskText = taskInput.value;
        const datetime = datetimeInput.value;
        const priority = priorityInput.value; // Add this line

        if (taskText.trim() === "" || datetime === "" || priority.trim() === "") {
            alert("Task, date/time, and priority are required.");
            return;
        }

        const task = { text: taskText, datetime: datetime, priority: priority }; // Update this line
        saveTask(task);
        taskInput.value = "";
        datetimeInput.value = "";
        priorityInput.value = ""; // Add this line
        loadTasks();

        // Check for due dates and set notifications
        checkDueDate(task);
    }

    function saveTask(task) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        taskList.innerHTML = "";
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            const listItem = document.createElement("li");
            listItem.className = "list-group-item";
            listItem.innerHTML = `
                <span>${task.text} (${task.datetime}) - Priority: ${task.priority}</span>
                <button class="btn btn-sm btn-info edit-task" data-index="${i}">Edit</button>
                <button class="btn btn-sm btn-danger delete-task" data-index="${i}">Delete</button>
            `;
            taskList.appendChild(listItem);

            // Check for due dates and set notifications
            checkDueDate(task);
        }
    }

    taskList.addEventListener("click", function (event) {
        if (event.target.classList.contains("edit-task")) {
            editTask(event.target.getAttribute("data-index"));
        } else if (event.target.classList.contains("delete-task")) {
            deleteTask(event.target.getAttribute("data-index"));
        }
    });

    function editTask(index) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const editedTask = tasks[index];

        taskInput.value = editedTask.text;
        datetimeInput.value = editedTask.datetime;
        priorityInput.value = editedTask.priority; // Add this line

        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));

        loadTasks();
    }

    function deleteTask(index) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks();
    }

    function checkDueDate(task) {
        const dueDate = new Date(task.datetime);
        const currentTime = new Date();

        if (dueDate <= currentTime) {
            // Display a notification
            showNotification(`Task: ${task.text} is due now. Priority: ${task.priority}`);
            // Play the notification sound
            playNotificationSound();
        } else {
            // Set a timeout to show the notification and play the sound when due
            const timeDifference = dueDate - currentTime;
            setTimeout(() => {
                showNotification(`Task: ${task.text} is due now. Priority: ${task.priority}`);
                playNotificationSound();
            }, timeDifference);
        }
    }

    function showNotification(message) {
        const notificationElement = document.getElementById("notification");
        notificationElement.textContent = message;
        notificationElement.style.display = "block";

        // Hide the notification after 3 seconds (adjust as needed)
        setTimeout(() => {
            notificationElement.style.display = "none";
        }, 3000);
    }

    function playNotificationSound() {
        notificationSound.play();
    }
});
