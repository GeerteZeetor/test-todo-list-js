const input = document.querySelector('.input');
const buttonSubmit = document.querySelector('.button_submit');
const todoList = document.getElementById('todo_list');
const evenButton = document.getElementById('even');
const oddButton = document.getElementById('odd');
const removeFirstButton = document.getElementById('remove_first');
const removeLastButton = document.getElementById('remove_last');
let tasks = [];

const renderTodo = (todo, position) => {
    const taskHtml = ` 
          <li class="todo" id="${todo.id}">
            <span class="${todo.done && 'complete'}">${todo.text}</span>
            <div class="form_button">
            <button class="button button_todo mark" type="button" onclick="markTodo(event)">complete</button>
            <button class="button button_todo delete" type="button" onclick='removeTodo(event)'>delete</button>
        </div>
          </li>`

    todoList.insertAdjacentHTML(position, taskHtml)
}


(function () {
    if (localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'))
        tasks.forEach((task) => {
            renderTodo(task, 'afterbegin')
        })
    }

    if (localStorage.getItem('tasks').length > 0) {
        document.querySelector('.empty').style.display = 'none'
    } else {
        document.querySelector('.empty').style.display = 'flex'
    }
})()

const saveToStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

const removeMarks = () => {
    const arrTodos = todoList.children
    for (let todo of arrTodos) {
        todo.classList.remove('marked')
    }
}

const markEven = () => {
    const arrTodos = todoList.children
    for (let i = 0; i < arrTodos.length; i++) {
        if (i % 2 !== 0) {
            arrTodos[i].classList.toggle('marked')
        }
    }
}
evenButton.addEventListener('click', markEven)

const markOdd = () => {
    const arrTodos = todoList.children
    for (let i = 0; i < arrTodos.length; i++) {
        if (i % 2 === 0) {
            arrTodos[i].classList.toggle('marked')
        }
    }
}
oddButton.addEventListener('click', markOdd)

const toggleEmpty = (todoList) => {
    if (todoList.children.length) {
        document.querySelector('.empty').style.display = 'none'
    } else {
        document.querySelector('.empty').style.display = 'flex'
    }
}

const removeFirstTodo = () => {
    const arrTodos = todoList.children
    const id = arrTodos[0].id
    tasks = tasks.filter(value => value.id !== id)
    arrTodos[0].remove()
    todoList.children = arrTodos
    toggleEmpty(todoList)
    removeMarks()
    saveToStorage()
}
removeFirstButton.addEventListener('click', removeFirstTodo)

const removeLastTodo = () => {
    const arrTodos = todoList.children
    const id = arrTodos[arrTodos.length - 1].id
    tasks = tasks.filter(value => value.id !== id)
    arrTodos[arrTodos.length - 1].remove()
    todoList.children = arrTodos
    toggleEmpty(todoList)
    removeMarks()
    saveToStorage()
}
removeLastButton.addEventListener('click', removeLastTodo)

const removeTodo = (ev) => {
    const todo = ev.target.closest('.todo')
    const id = todo.id
    todo.remove()
    tasks = tasks.filter((task) => task.id !== id)
    toggleEmpty(todoList)
    removeMarks()
    saveToStorage()
}

const markTodo = (ev) => {
    const todo = ev.target.closest('.todo')
    const id = todo.id
    const current = tasks.find(value => value.id === id)
    if (!current.done) {
        tasks = tasks.filter(value => value !== current)
        current.done = !current.done
        todo.remove()
        tasks.push(current)
        renderTodo(current, 'beforeend')
    } else {
        current.done = !current.done
        todo.children[0].classList.toggle('complete')
    }
    saveToStorage()
}

const addTodo = () => {
    const newTask = {
        id: Date.now() + input.value,
        text: input.value,
        done: false,
    }
    tasks.push(newTask)

    if (input.value === '') return
    const taskHtml = ` 
      <li class="todo" id="${newTask.id}">
        <span class="${newTask.done && 'complete'}">${newTask.text}</span>
        <div class="form_button">
        <button class="button button_todo mark" type="button" onclick="markTodo(event)">complete</button>
        <button class="button button_todo delete" type="button" onclick='removeTodo(event)'>delete</button>
        </div>
      </li>`

    todoList.insertAdjacentHTML('afterbegin', taskHtml)
    input.value = ''
    input.focus()

    removeMarks()
    toggleEmpty(todoList)
    saveToStorage()
}


buttonSubmit.addEventListener('click', (ev) => {
    ev.preventDefault()
    addTodo()
})
