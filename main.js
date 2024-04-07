// API來源
const URL = 'https://user-list.alphacamp.io/api/v1/users/'
// 存放API下來朋友資料的空陣列
const myFriends = []
let storageCategories = JSON.parse(localStorage.getItem('Categories')) || []
// Side List
//API請求
axios
  .get(URL)
  .then((response) => {
    myFriends.push(...response.data.results)
    // render預設friend list
    renderFriendList(myFriends)
    renderCategoryBar(storageCategories)
  })
  .catch((error) => console.log(error))

// Search Bar
const searchBar = document.querySelector('.search-bar')
const searchInput = document.querySelector('.search-input')
const searchBtn = document.querySelector('.search-btn')
let filteredFriends = []
searchBar.addEventListener('submit', function SubmittedInput(event) {
  event.preventDefault() // 取消預設事件
  const input = searchInput.value.trim().toLowerCase()
  filteredFriends = myFriends.filter((friend) =>
    friend.name.toLowerCase().includes(input) || friend.surname.toLowerCase().includes(input)
  )
  renderFriendList(filteredFriends)
})

// Friend List
// 點擊 friendCard render displayInfo 
// 因.friend-card是動態生成，因此 eventlistener 要設置在父元素 .friend-list 上並用 closest 判斷
const friendList = document.querySelector('.friend-list')
friendList.addEventListener('click', function getClickedId(event) {
  // render display area
  const cardId = event.target.closest('.friend-card').dataset.id
  if (event.target.closest('.friend-card')) {
    renderInfoCard(cardId)
    //  click '+' 加入 category
  } if (event.target.closest('.add-to-category')) {
    // 在 modal 加上 data-id
    addToCateModal.setAttribute('data-id', cardId)
    // 列出已儲存的category
    showCategoryList(storageCategories)
  }
})



// Add Categories
const categoryNameInput = document.querySelector('.category-name-input')
let categoryContent = []

categoryNameInput.addEventListener('keydown', function (event) {
  // 檢查是否按下 Enter 键
  if (event.key === 'Enter') {
    event.preventDefault();
    const input = categoryNameInput.value.trim();
    // 確認輸入欄不為空
    if (input) {
      // 將輸入內中加入 storageCategories 中
      storageCategories.push(input);
      console.log('已新增分類：', input);
      console.log('Category新增：', storageCategories);
      // 清空輸入欄內容
      categoryNameInput.value = '';
      // render Categories Bar
      renderCategoryBar(storageCategories)
      // 將 storageCategories 存放進 localStorage
      localStorage.setItem('Categories', JSON.stringify(storageCategories))
      // 同時將以 input 為名的空白陣列存放進 localStorage
      // 在categoryContent的位置呼叫 function addToCategory 產出一個要加入的陣列清單丟進去！
      localStorage.setItem(`${input}`, JSON.stringify(categoryContent))
    }
  }
})

// Delete Categories
const deleteCategory = document.querySelector('#delete-category')

deleteCategory.addEventListener('click', function deleteCategory(event) {
  const deleteBtn = event.target.matches('.delete-btn')
  if (deleteBtn) {
    const delIndex = event.target.getAttribute('value')
    // 確保 delIndex 為有效值
    if (!isNaN(delIndex)) {
      // 從 Categories 中刪除 相對應的 Category
      storageCategories.splice(delIndex, 1)
      // 在localStorage 刪除 Category
      const categoryList = document.querySelector('.del-category-list')
      localStorage.removeItem(categoryList.innerText)
      // 重新 renderCategoryBar
      renderCategoryBar(storageCategories)
      // 將新的 storageCategories 存放進 Categories
      localStorage.setItem('Categories', JSON.stringify(storageCategories))
    }
  }
})

// Category Buttons
const plusBtn = document.querySelector('#add-btn')
const minusBtn = document.querySelector('#minus-btn')
const deleteContainer = document.querySelector('#delete-container')

plusBtn.addEventListener('click', function showCategoryInput() {
  if (categoryNameInput.style.display === 'none') {
    categoryNameInput.style.display = 'block'
  } else {
    categoryNameInput.style.display = 'none'
  }
  if (deleteContainer.style.display === 'flex') {
    deleteContainer.style.display = 'none'
  }
})

minusBtn.addEventListener('click', function showCategoryDelete() {
  if (deleteContainer.style.display === 'none') {
    deleteContainer.style.display = 'flex'
  } else {
    deleteContainer.style.display = 'none'
  }
  if (categoryNameInput.style.display === 'block') {
    categoryNameInput.style.display = 'none'
  }
})

// Category Bar
const categoryBar = document.querySelector('#category-bar')

categoryBar.addEventListener('change', function () {
  const selectedOption = categoryBar.options[categoryBar.selectedIndex]
  const optionCount = categoryBar.options.length
  for (let i = 0; i < optionCount - 1; i++) {
    if (selectedOption.value === `${i}`) {
      const optionName = selectedOption.textContent
      const selectedData = JSON.parse(localStorage.getItem(optionName)) || []
      renderFriendList(selectedData)
    }
  } if (selectedOption.matches('.category-default')) {
    renderFriendList(myFriends)
  }
})

// Display Sorting (未完成)
// const displayFilter = document.querySelector('.display-filter')

// displayFilter.addEventListener('click', function(event) {
//   if (event.target.matches('#sort-by-name')) {
//     const filterList = getAllLocalStorage()
//     filterList.forEach(category => {
//       sortFromAToZ(category)
//       console.log(category)
//     })
//     setAllLocalStorage(filterList)
//   }
// })

// Card Modals
const addToCateModal = document.querySelector('#exampleModal')

addToCateModal.addEventListener('click', function (event) {
  const modalCates = document.querySelectorAll('.modal-cates')
  // Keep Categories Selected
  if (event.target.matches('.modal-cates')) {
    event.target.classList.toggle('selected')
  }
  // Save and add friend into category
  if (event.target.matches('.add-to-category')) {
    modalCates.forEach(item => {
      if (item.classList.contains('selected')) {
        const cardId = event.target.closest('#exampleModal').dataset.id
        console.log('cardId: ', cardId)
        console.log('分類名稱: ', item.innerText)
        // 從localStorage呼叫出相對應名稱的 key
        const list = JSON.parse(localStorage.getItem(item.innerText)) || []
        const friend = myFriends.find((friend) => friend.id === Number(cardId))
        console.log(friend)
        if (list.some((friend) => friend.id === Number(cardId))) {
          return alert('此好友已在上列清單之一中！')
        }
        // 把過濾過的 friend push 進 list array 中
        list.push(friend)
        localStorage.setItem(item.innerText, JSON.stringify(list))
      }
    })
  }
})


// functions
// Render friend list
function renderFriendList(data) {
  let rawHTML = ''
  data.forEach((friend) => {
    rawHTML += `
    <div class="friend-card" data-id='${friend.id}' style="width: 18rem;">
      <img src="${friend.avatar}" alt="...">
      <div class="friends-body">
        <p class="friends-name">${friend.name + ' ' + friend.surname}</p>
        <i class="btn add-to-category bi bi-plus-lg" data-bs-toggle="modal" data-bs-target="#exampleModal"></i>
      </div>
    </div>
    `
  })
  friendList.innerHTML = rawHTML

}

// 請求指定 id 的 data 並放進 info-group 的HTML中
function renderInfoCard(id) {
  const displayInfo = document.querySelector('.display-info')
  axios
    .get(URL + id)
    .then((response) => {
      const data = response.data
      console.log(data)
      displayInfo.innerHTML = `
      <div class="card" style="width: 18rem;">
        <div class="info-image" id='info-image'>
          <img src="${data.avatar}"  alt="...">
        </div>
        <div class="card-body">
          <h5 class="card-title">${data.name + ' ' + data.surname}</h5>
        </div>
        <ul class="list-group info-group-flush">
          <li class="list-group-item" id='info-region'>國家：${data.region}</li>
          <li class="list-group-item" id='info-gender'>性別：${data.gender}</li>
          <li class="list-group-item" id='info-age'>年齡：${data.age}歲</li>
          <li class="list-group-item" id='info-btd'>生日：${data.birthday}</li>
          <li class="list-group-item" id='info-email'>電子信箱：<br>${data.email}</li>
        </ul>
      </div>
      `
    })
}

// 新增和刪除 Category
function renderCategoryBar(category) {
  let addHTML = `
  <option selected class='category-default'>好友分類</option>
  `
  let delHTML = ''
  category.forEach((item, index) => {
    addHTML += `
    <option value="${index}" class='category-list'>${item}</option>
    `
    delHTML += `
    <option value="${index}" class='del-category-list ps-2'>${item}</option>
    <i value="${index}" class="delete-btn btn bi bi-trash-fill p-0 ps-1"></i>
    `
  })
  categoryBar.innerHTML = addHTML
  deleteContainer.innerHTML = delHTML
}

// Modal Display Category

function showCategoryList(category) {
  const modalCategory = document.querySelector('.modal-category')
  let modalHTML = ''
  if (category.length === 0) {
    modalCategory.innerHTML = `
    <div>請新增好友分類！</div>
    `
  }
  else {
    category.forEach((item) => {
      modalHTML += `
      <button type="button" class="modal-cates btn btn-outline-secondary">${item}</button>
      `
    })
    modalCategory.innerHTML = modalHTML
  }
}

// Add to Category
function addToCategory(id) {   // 目標：一個含有要加入清單的朋友名單陣列！
  const list = JSON.parse(localStorage.getItem(`${item.innerText}`)) || []
  const friend = myFriends.find((friend) => friend.id === id)
  if (list.some((friend) => friend.id === id)) {
    return alert('此好友已在好友分類中！')
  }
  // 把過濾過的 friend push 進 list array 中
  list.push(friend)
}

// 取出 複數 localStorage
// function getAllLocalStorage() {
//   const allLocalStorage = []
//   for (let i = 0; i < localStorage.length; i++) {
//     const key = localStorage.key(i)
//     const value = JSON.parse(localStorage.getItem(key))
//     allLocalStorage[key] = value
//   }
//   return allLocalStorage
// }

// 取出 複數 localStorage key
// function getLocalStorageKeys() {
//   const keys = []
//   for (let i = 0; i < localStorage.length; i++) {
//     keys.push(localStorage.key(i))
//   }
//   return keys
// }

// function setAllLocalStorage(array) {
//   for (let i = 0; i < localStorage.length; i++) {
//     const key = localStorage.key(i)
//     const value = array[i]
//     localStorage.setItem(key, JSON.stringify(value))
//   }
// }

// // Sort array A-Z 
// function sortFromAToZ(array) {
//   array.sort((a, b) => {
//     let nameA = a.name.toUpperCase()
//     let nameB = b.name.toUpperCase()
//     if (nameA > nameB) {
//       return 1
//     }
//     if (nameA < nameB) {
//       return -1
//     } else
//       return 0
//   })
// }