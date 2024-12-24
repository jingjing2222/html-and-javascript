const myStorage = window.localStorage;
let currentNumber = 0;
let todos = [];
const selectChecked = document.getElementById('todo-filter');
const ulDocument = document.getElementById('todo-list');
const inputDocument=document.getElementById('todo-input');

window.addEventListener('load', () => {
    const savedTodos = JSON.parse(myStorage.getItem('todos')) || [];
    todos = savedTodos;
    if(todos.length > 0) {
        currentNumber = Math.max(...todos.map(t => Number.parseInt(t.id.replace('li','')))) + 1;
    }
    renderTodos();
});

document.addEventListener("keydown", e => {
    console.log(myStorage);
    if (!(e.code === "Enter" && e.isComposing === false)) return;
    const valueOfToDoList = document.getElementsByClassName("todo-input")[0].value.trim();
    if(valueOfToDoList === "") return;
    saveToDoList(valueOfToDoList);
    document.getElementsByClassName("todo-input")[0].value = "";
});

selectChecked.addEventListener("change", e => {
    filterTodos(e.target.value);
});

ulDocument.addEventListener("click", (e) => {
    if (e.target.value === "X") {
        deleteToDoList(e);
    }
    else if (e.target.value === "Edit") {
        editToDoList(e);
    }
    else if (e.target.value === "Save") {
        saveEditedToDoList(e);
    }
    else if (e.target.className === "CheckBox") {
        updateCheckState(e);
    }
});

function saveToDoList(text) {
    const currentLi = `li${currentNumber}`;
    const newTodo = {
        id: currentLi,
        text: text,
        checked: false
    };
    todos.push(newTodo);
    currentNumber++;
    storeTodos();
    renderTodos();
}

function deleteToDoList(e) {
    const liId = e.target.parentNode.getAttribute('id');
    todos = todos.filter(todo => todo.id !== liId);
    storeTodos();
    renderTodos();
}

function editToDoList(e) {
    const buttonParent = e.target.parentNode;
    const liId = buttonParent.id;
    const currentTodo = todos.find(todo => todo.id === liId);
    const currentText = currentTodo.text;

    buttonParent.innerHTML = "";

    const inputText = document.createElement("input");
    inputText.setAttribute("type", "text");
    inputText.setAttribute("id", "saveInput");
    inputText.value = currentText;
    buttonParent.appendChild(inputText);

    const buttonToSave = document.createElement("input");
    buttonToSave.setAttribute("type", "button");
    buttonToSave.setAttribute("value", "Save");
    buttonParent.appendChild(buttonToSave);
}

function saveEditedToDoList(e) {
    const buttonParent = e.target.parentNode;
    const currentId = buttonParent.getAttribute("id");
    const updatedText = document.getElementById("saveInput").value;

    const todoIndex = todos.findIndex(todo => todo.id === currentId);
    if(todoIndex > -1) {
        todos[todoIndex].text = updatedText;
    }

    storeTodos();
    renderTodos();
}

function updateCheckState(e) {
    const checkbox = e.target;
    const liId = checkbox.parentNode.getAttribute('id');
    const todoIndex = todos.findIndex(todo => todo.id === liId);
    if (todoIndex > -1) {
        todos[todoIndex].checked = checkbox.checked;
        storeTodos();
        filterTodos(selectChecked.value);
    }
}

function storeTodos() {
    myStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    ulDocument.innerHTML = "";
    // biome-ignore lint/complexity/noForEach: <explanation>
    todos.forEach(todo => {
        const li = document.createElement("li");
        li.setAttribute("id", todo.id);

        const listCheckBox = document.createElement("input");
        listCheckBox.setAttribute('class','CheckBox');
        listCheckBox.setAttribute("type", "checkbox");
        if(todo.checked) listCheckBox.setAttribute('checked',true);
        li.appendChild(listCheckBox);

        li.appendChild(document.createTextNode(todo.text));

        const buttonToAdd = document.createElement("input");
        buttonToAdd.setAttribute("type", "button");
        buttonToAdd.setAttribute("value", "Edit");
        li.appendChild(buttonToAdd);

        const buttonToDelete = document.createElement("input");
        buttonToDelete.setAttribute("type", "button");
        buttonToDelete.setAttribute("value", "X");
        li.appendChild(buttonToDelete);

        ulDocument.appendChild(li);
    });
    filterTodos(selectChecked.value);
}

function filterTodos(filterValue) {
    const liItems = ulDocument.querySelectorAll('li');
    // biome-ignore lint/complexity/noForEach: <explanation>
    liItems.forEach(li => {
        const todo = todos.find(t => t.id === li.id);
        if(!todo) return;
        if(filterValue === 'all') {
            li.style.display = "";
        } else if(filterValue === 'todo') {
            li.style.display = todo.checked ? 'none' : '';
        } else if(filterValue === 'done') {
            li.style.display = todo.checked ? '' : 'none';
        }
    });
}