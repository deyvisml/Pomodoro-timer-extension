let tasks = [];

const updateTime = () => {
  chrome.storage.local.get(["timer", "timeOption"], function (result) {
    const time = document.querySelector("#time");
    const minutes = `${
      result.timeOption - Math.ceil(result.timer / 60)
    }`.padStart(2, "0");
    let seconds = "00";
    if (result.timer % 60 != 0) {
      seconds = `${60 - (result.timer % 60)}`.padStart(2, "0");
    }
    time.textContent = `${minutes}:${seconds}`;
  });
};

updateTime();
setInterval(() => {
  updateTime();
}, 1000);

const startTimerBtn = document.querySelector("#start-timer-btn");

startTimerBtn.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], function (result) {
    chrome.storage.local.set(
      {
        isRunning: !result.isRunning,
      },
      () => {
        startTimerBtn.textContent = !result.isRunning
          ? "Pause Timer"
          : "Start Timer";
      }
    );
  });
});

const resetTimerBtn = document.querySelector("#reset-timer-btn");

resetTimerBtn.addEventListener("click", () => {
  chrome.storage.local.set(
    {
      timer: 0,
      isRunning: false,
    },
    function () {
      startTimerBtn.textContent = "Start Timer";
    }
  );
});

const addTaskBtn = document.querySelector("#add-task-btn");

addTaskBtn.addEventListener("click", () => addTask());

chrome.storage.sync.get(["tasks"], function (result) {
  tasks = result.tasks ?? [];
  renderTasks();
});

const saveTasks = () => {
  chrome.storage.sync.set({
    tasks: tasks,
  });
};

const renderTask = (taskNum) => {
  const taskRow = document.createElement("div");

  const text = document.createElement("input");
  text.type = "text";
  text.placeholder = "Enter a task...";
  text.value = tasks[taskNum];
  text.className = "task-input";
  text.addEventListener("change", () => {
    tasks[taskNum] = text.value;
    saveTasks();
  });

  const deleteBtn = document.createElement("input");
  deleteBtn.type = "button";
  deleteBtn.value = "X";
  deleteBtn.className = "task-delete";
  deleteBtn.addEventListener("click", () => {
    deleteTask(taskNum);
  });

  taskRow.appendChild(text);
  taskRow.appendChild(deleteBtn);

  const taskContainer = document.querySelector("#task-container");
  taskContainer.appendChild(taskRow);
};

const addTask = () => {
  const taskNum = tasks.length;
  tasks.push("");

  renderTask(taskNum);
  saveTasks();
};

const deleteTask = (taskNum) => {
  tasks.splice(taskNum, 1);
  renderTasks();
  saveTasks();
};

const renderTasks = () => {
  const taskContainer = document.querySelector("#task-container");
  taskContainer.textContent = "";

  tasks.forEach((taskText, taskNum) => {
    renderTask(taskNum);
  });
};
