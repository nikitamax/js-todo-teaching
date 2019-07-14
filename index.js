var localStorageTasks = JSON.parse(localStorage.tasks);
var tasksList = localStorageTasks ? localStorageTasks : [];

var ul = document.getElementsByClassName("todo-list")[0];
var itemsLeft = document.getElementsByTagName("strong")[0];
var footer = document.getElementsByTagName("footer")[0];
var toggleAllInput = document.getElementsByClassName("toggle-all")[0];
var toggleAllLable = document.getElementById("toggle-all");
var filters = document.getElementsByTagName("a");

window.onload = function() {
  renderTasks(tasksList);
  renderCountActiveTasks();
  checkFooter();
  setFilter();
};

function updateLocalStorage() {
  let serialTasks = JSON.stringify(tasksList);
  localStorage.setItem("tasks", serialTasks);
}

function renderTasks(tasksList) {
  clearTasks();
  tasksList.forEach(function(task) {
    ul.appendChild(createLi(task));
  });
}

function clearTasks() {
  ul.innerHTML = "";
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
    updateLocalStorage();
    renderCountActiveTasks();
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
  updateLocalStorage();
  renderCountActiveTasks();
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
  if (countActiveTasks() === 0) {
    toggleAllInput.checked = true;
  } else if (countActiveTasks() === tasksList.length) {
    toggleAllInput.checked = false;
  }
  updateLocalStorage();
  renderCountActiveTasks();
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
  return aciveTasks.length;
}

function renderCountActiveTasks() {
  itemsLeft.innerHTML = countActiveTasks();
}

function filterChange(event) {
  var currentFilter = event.target;
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
      renderTasks(activeTasks);
      break;
    }
    case "All": {
      renderTasks(tasksList);
      break;
    }
    case "Completed": {
      var completedTasks = tasksList.filter(function(task) {
        if (task.completed) return task;
      });
      renderTasks(completedTasks);
      break;
    }
  }
}

function getCurrentFilter() {
  for (var i = 0; i < filters.length; i++) {
    if (filters[i].className === "selected") return filters[i].innerHTML;
  }
}

function clearCompleted() {
  tasksList = tasksList.filter(function(task) {
    if (!task.completed) return task;
  });
  renderTasks(tasksList);
  updateLocalStorage();
  checkFooter();
}

function checkFooter() {
  if (!tasksList.length) {
    footer.style.display = "none";
    toggleAllLable.style.display = "none";
    toggleAllInput.checked = false;
  } else {
    footer.style.display = "";
    toggleAllLable.style.display = "";
  }
}

function selectFilter(filter) {
  var el;
  for (var i = 0; i < filters.length; i++) {
    filters[i].className = "";
    if (filters[i].innerHTML.toLowerCase() === filter) {
      el = filters[i];
    }
  }
  el.className = "selected";
}

function setFilter() {
  if (tasksList.length) {
    var filter = window.location.hash.slice(2);
    switch (filter) {
      case "active": {
        selectFilter(filter);
        var activeTasks = tasksList.filter(function(task) {
          if (!task.completed) return task;
        });
        renderTasks(activeTasks);
        break;
      }
      case "completed": {
        selectFilter(filter);
        var completedTasks = tasksList.filter(function(task) {
          if (task.completed) return task;
        });
        renderTasks(completedTasks);
        break;
      }
    }
  }
}

// all check

function toggleAllCheck() {
  toggleAllInput.checked = toggleAllInput.checked ? false : true;
  tasksList = tasksList.map(function(task) {
    return { id: task.id, text: task.text, completed: toggleAllInput.checked };
  });
  renderTasks(tasksList);
  if (getCurrentFilter() === "Active" && toggleAllInput.checked) {
    clearTasks();
  } else if (getCurrentFilter() === "Completed" && !toggleAllInput.checked) {
    clearTasks();
  }
  renderCountActiveTasks();
}
