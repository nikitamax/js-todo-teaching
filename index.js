var tasksList = [
  { id: "1", text: "synthesize", completed: true },
  { id: "2", text: "override", completed: false },
  { id: "3", text: "index", completed: true },
  { id: "4", text: "compress", completed: false },
  { id: "5", text: "compress", completed: false },
  { id: "6", text: "override", completed: true },
  { id: "7", text: "generate", completed: true }
];

var ul = document.getElementsByClassName("todo-list")[0];
var itemsLeft = document.getElementsByTagName("strong")[0];
var footer = document.getElementsByTagName("footer")[0];

window.onload = function() {
  renderTasks();
  countActiveTasks();
  checkFooter();
};

function renderTasks() {
  tasksList.forEach(function(task) {
    ul.appendChild(createLi(task));
  });
}

function createLi(task) {
  var className = task.completed ? "completed" : "";
  var checked = task.completed ? "checked" : "";
  var li = document.createElement("li");
  li.className = className;
  li.id = task.id;
  var div = document.createElement("div");
  div.className = "view";
  var toggle = document.createElement("input");
  toggle.className = "toggle";
  toggle.type = "checkbox";
  toggle.checked = checked;
  toggle.onchange = toggleTask;
  var label = document.createElement("label");
  label.innerHTML = task.text;
  label.ondblclick = startEditTask;
  var button = document.createElement("button");
  button.className = "destroy";
  button.onclick = deleteTask;
  div.appendChild(toggle);
  div.appendChild(label);
  div.appendChild(button);
  var input = document.createElement("input");
  input.className = "edit";
  input.value = task.text;
  input.onblur = endEditTask;
  input.onkeypress = endEditTaskByEnterClick;
  li.appendChild(div);
  li.appendChild(input);

  return li;
}

// add new task

function addNewTask(event) {
  if (event.key === "Enter") {
    var newTask = {
      id: getMaxId(tasksList) + 1 + "",
      completed: false,
      text: event.target.value
    };
    tasksList.push(newTask);
    ul.appendChild(createLi(newTask));
    event.target.value = "";
    countActiveTasks();
    checkFooter();
  }
}

function getMaxId(tasks) {
  let ids = tasks.map(t => t.id);
  if (!ids.length) {
    ids = ["0"];
  }
  return Math.max.apply(null, ids);
}

// delete task

function deleteTask(event, element) {
  var li = element ? element : event.target.parentNode.parentNode;
  tasksList.forEach(function(task, i) {
    if (li.id === task.id) {
      tasksList.splice(i, 1);
    }
  });
  ul.removeChild(li);
  countActiveTasks();
  checkFooter();
}

// toggle task

function toggleTask(event) {
  var li = event.target.parentNode.parentNode;
  var checked = event.target.checked;
  li.className = checked ? "completed" : "";
  tasksList = tasksList.map(function(task) {
    if (task.id == li.id) {
      return { id: task.id, text: task.text, completed: !task.completed };
    }
    return task;
  });
  countActiveTasks();
}

// editing task

function startEditTask(event) {
  var li = event.target.parentNode.parentNode;
  li.className = li.className ? li.className + " editing" : "editing";
  li.children[1].focus();
}

function endEditTask(event) {
  var li = event.target.parentNode;
  var input = event.target;
  if (!input.value) {
    deleteTask(event, li);
    return;
  }
  tasksList = tasksList.map(function(task) {
    if (task.id === li.id) {
      return { ...task, text: input.value };
    }
    return task;
  });
  var label = li.children[0].children[1];
  label.innerHTML = input.value;
  li.className = li.className === "editing" ? "" : "completed";
}

function endEditTaskByEnterClick(event) {
  var input = event.target;
  if (event.key === "Enter") {
    input.onblur = null;
    endEditTask(event);
  }
}

// footer

function countActiveTasks() {
  var aciveTasks = tasksList.filter(function(task) {
    if (!task.completed) return task;
  });
  itemsLeft.innerHTML = aciveTasks.length;
}

function filterChange(event) {
  var currentFilter = event.target;
  var filters = document.getElementsByTagName("a");
  for (var i = 0; i < filters.length; i++) {
    if (filters[i].innerHTML !== currentFilter.innerHTML)
      filters[i].className = "";
  }
  currentFilter.className = "selected";
  switch (currentFilter.innerHTML) {
    case "Active": {
      var activeTasks = tasksList.filter(function(task) {
        if (!task.completed) return task;
      });
      ul.innerHTML = "";
      activeTasks.forEach(function(task) {
        ul.appendChild(createLi(task));
      });
      break;
    }
    case "All": {
      ul.innerHTML = "";
      tasksList.forEach(function(task) {
        ul.appendChild(createLi(task));
      });
      break;
    }
    case "Completed": {
      var activeTasks = tasksList.filter(function(task) {
        if (task.completed) return task;
      });
      ul.innerHTML = "";
      activeTasks.forEach(function(task) {
        ul.appendChild(createLi(task));
      });
      break;
    }
  }
}

function clearCompleted() {
  tasksList = tasksList.filter(function(task) {
    if (!task.completed) return task;
  });
  ul.innerHTML = "";
  renderTasks();
  checkFooter();
}

function checkFooter() {
  if (!tasksList.length) {
    footer.style.display = "none";
  } else footer.style.display = "";
}
