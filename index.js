var tasksList = [
  { id: "1", text: "synthesize", completed: true },
  { id: "2", text: "override", completed: false },
  { id: "3", text: "index", completed: true },
  { id: "4", text: "compress", completed: false },
  { id: "5", text: "compress", completed: false },
  { id: "6", text: "override", completed: true },
  { id: "7", text: "generate", completed: true }
];

window.onload = function() {
  var ul = document.getElementsByClassName("todo-list")[0];
  tasksList.forEach(function(task) {
    ul.appendChild(createLi(task));
  });
};

function createLi(task) {
  var className = task.completed ? "completed" : "";
  var checked = task.completed ? "checked" : "";
  var li = document.createElement("li");
  li.className = className;
  var div = document.createElement("div");
  div.className = "view";
  var toggle = document.createElement("input");
  toggle.className = "toggle";
  toggle.type = "checkbox";
  toggle.checked = checked;
  var label = document.createElement("label");
  label.innerHTML = task.text;
  var button = document.createElement("button");
  button.id = task.id;
  button.className = "destroy";
  div.appendChild(toggle);
  div.appendChild(label);
  div.appendChild(button);
  var input = document.createElement("input");
  input.className = "edit";
  input.innerHTML = task.text;
  li.appendChild(div);
  li.appendChild(input);

  return li;
}

function addNewTask(event) {
  var newTask = {
    id: getMaxId(tasksList) + 1 + "",
    completed: false,
    text: event.target.value
  };
  tasksList.push(newTask);
  var ul = document.getElementsByClassName("todo-list")[0];
  ul.appendChild(createLi(newTask));
  event.target.value = "";
}

function getMaxId(tasks) {
  let ids = tasks.map(t => t.id);
  if (!ids.length) {
    ids = ["0"];
  }
  return Math.max.apply(null, ids);
}
