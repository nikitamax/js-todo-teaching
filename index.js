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

window.onload = function() {
  tasksList.forEach(function(task) {
    ul.appendChild(createLi(task));
  });
};

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
  }
}

function getMaxId(tasks) {
  let ids = tasks.map(t => t.id);
  if (!ids.length) {
    ids = ["0"];
  }
  return Math.max.apply(null, ids);
}

function deleteTask(event, element) {
  var li = element ? element : event.target.parentNode.parentNode;
  tasksList.forEach(function(task) {
    if (li.id === task.id) {
      tasksList.splice(+li.id - 1, 1);
    }
  });
  ul.removeChild(li);
}

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
}

function startEditTask(event) {
  var li = event.target.parentNode.parentNode;
  li.className = li.className ? li.className + " editing" : "editing";
  li.children[1].focus();
}

function endEditTask(event) {
  var li = event.target.parentNode;
  var input = event.target;
  tasksList = tasksList.map(function(task) {
    if (task.id === li.id) {
      return { ...task, text: input.value };
    }
    return task;
  });
  if (!input.value) {
    deleteTask(event, li);
  }
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
