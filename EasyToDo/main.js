// /////////////////////////
// 建立初始data

// data放置場 (ul#my-todo)
let toDoDOM = document.querySelector('ul#my-todo')
let doneDOM = document.querySelector('ul#my-done')

// 建立初始To-Do (僅初始用)
const toDoList = ['範例項目1', '範例項目2', '範例項目3']
for (let value of toDoList) {
  addToDo(value)
}

// 建立初始Done (僅初始用)
const doneList = ['input防全半形空白', 'input接受Enter(用JS)', '製作Done ul', 'style修飾(追加)', '改變順序(追加)']
for (let value of doneList) {
  addDone(value)
}

// /////////////////////////
// main function

function addToDo(text) {
  let newItem = document.createElement('li')
  const bootstrap = 'border-bottom p-1'
  newItem.innerHTML = `
    <label class="${bootstrap}">${text}</label>
    <i class="delete fas fa-trash-alt"></i>
    <i class="up fas fa-angle-up"></i>
    <i class="down fas fa-angle-down"></i>
  `
  toDoDOM.appendChild(newItem)
}

function addDone(text) {
  let newItem = document.createElement('li')
  newItem.innerHTML = `
    <label class="checked">${text}</label>
    <i class="delete fas fa-trash-alt"></i>
    <i class="up fas fa-angle-up"></i>
    <i class="down fas fa-angle-down"></i>
  `
  doneDOM.appendChild(newItem)
}

// /////////////////////////
// 監聽器相關

// 配置AddBtn, click監聽器
const addBtn = document.querySelector('button#addBtn')
const userInput = document.querySelector('input#newTodo')
function delSpace(string) {
  // 移除半形空白
  let rebuild = string.replace(/ /g, '')
  // 移除全形空白
  rebuild = rebuild.replace(/　/g, '')
  return rebuild
}

addBtn.addEventListener('click', () => {
  const inputValue = document.querySelector('#newTodo').value
  // 清空input欄位
  document.querySelector('#newTodo').value = ''

  if (delSpace(inputValue) !== '') { addToDo(inputValue) }
})

userInput.addEventListener('keydown', () => {
  if (event.key === 'Enter') {
    const inputValue = document.querySelector('#newTodo').value
    // 清空input欄位
    document.querySelector('#newTodo').value = ''
    addToDo(inputValue)
  }
})

// 配置項目li, click監聽器
function clickEvent(className, DOM) {
  // 點擊 delBtn 事件
  if (event.target.matches('.delete')) {
    event.target.parentElement.remove()
  }

  // 點擊 label(項目item) 事件
  if (event.target.tagName === 'LABEL') {
    event.target.className = className
    DOM.appendChild(event.target.parentElement)
  }

  // 點擊 up/down 事件
  upDown()
}

function upDown() {  // 分裝clickEvent()內code
  // 點擊 up 事件
  if (event.target.matches('.up')) {
    const topElem = event.target.parentElement
    // 如果pre沒東西, 則不執行 (null => false), ps.前面有個註解Node
    if (topElem.previousElementSibling) {
      topElem.insertAdjacentElement('afterend', topElem.previousSibling)
    }
  }

  // 點擊 down 事件
  if (event.target.matches('.down')) {
    const topElem = event.target.parentElement
    // 如果next沒東西, 則不執行 (null => false)
    if (topElem.nextSibling) {
      topElem.insertAdjacentElement('beforebegin', topElem.nextSibling)
    }
  }
}

toDoDOM.addEventListener('click', () => {
  clickEvent('checked', doneDOM)
})

doneDOM.addEventListener('click', () => {
  clickEvent('border-bottom p-1', toDoDOM)
})