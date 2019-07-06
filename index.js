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
  listItems = "";
  tasksList.forEach(function(task) {
    listItems = listItems + createLi(task);
  });
  ul.innerHTML = listItems;
};

function createLi(task) {
  var className = task.completed ? "completed" : "";
  var checked = task.completed ? "checked" : "";
  var li = `
    <li class=${className}> 
    <div class="view"> 
    <input class="toggle" type="checkbox" ${checked}>
    <label>${task.text}</label>
    <button id=${task.id} class="destroy"></button>
    </div>
    <input class="edit" value="${task.text}">
    </li>`;

  return li;
}
