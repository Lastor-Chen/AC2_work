/* global $, axios */

// ===============================
// 變數宣告
// ===============================
const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

// 從瀏覽器暫存取出favorite list, 儲存為此頁面的總data
const data = JSON.parse(sessionStorage.getItem('favoriteMovies')) || []
let currentData = []  // 紀錄當前頁面上存在的data

const dataPanel = document.getElementById('data-panel')
const searchForm = document.getElementById('search')
const searchInput = document.getElementById('search-input')

const pagination = document.getElementById('pagination')
const ITEM_PER_PAGE = 12  // 設定單頁顯示筆數

function displayDataList(data, mode) {
  let htmlContent = ''
  if (mode === 'card') {
    data.forEach(function (item) {
      htmlContent += `
      <div class="col-sm-3" data-mode=${mode}>
        <div class="card mb-2">
          <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
          <div class="card-body movie-item-body">
            <h6 class="card-title">${item.title}</h6>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
            <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
          </div>
        </div>
      </div>
    `
    })
  }

  if (mode === 'list') {
    data.forEach(function (item) {
      htmlContent += `
        <div class="col-12 d-flex border-top p-2 align-items-center">
          <span class="col-8">${item.title}</span>
          <div class="col-4">
            <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
            <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
          </div>
        </div>
      `
    })
  }

  dataPanel.innerHTML = htmlContent
}

function showMovie(id) {
  // get elements
  const modalTitle = document.getElementById('show-movie-title')
  const modalImage = document.getElementById('show-movie-image')
  const modalDate = document.getElementById('show-movie-date')
  const modalDescription = document.getElementById('show-movie-description')

  // set request url
  const url = INDEX_URL + id

  // send request to show api
  axios.get(url).then(response => {
    const data = response.data.results

    // insert data into modal ui
    modalTitle.textContent = data.title
    modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
    modalDate.textContent = `release at : ${data.release_date}`
    modalDescription.textContent = `${data.description}`
  })
}

function getTotalPages(data) {
  const totalPages = Math.ceil(data.length / ITEM_PER_PAGE || 1)
  let pageItemContent = `
    <li class="page-item">
      <a class="page-link previous" href="javascript:;">&laquo;</a>
    </li>
  `

  for (let i = 0; i < totalPages; i++) {
    pageItemContent += `
      <li class="page-item">
        <a class="page-link page" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
      </li>
    `
  }

  pageItemContent += `
    <li class="page-item">
      <a class="page-link next" href="javascript:;">&raquo;</a>
    </li>
  `

  pagination.innerHTML = pageItemContent
}

function getPageData(page, data, mode) {
  // 保存當前頁面內容
  currentData = [...data]

  const offset = ITEM_PER_PAGE * (page - 1)
  const pageData = currentData.slice(offset, offset + ITEM_PER_PAGE)
  displayDataList(pageData, mode)
}

function goToPage(targetPage) {
  getPageData(targetPage, currentData, dataPanel.dataset.mode)

  // 僅高亮顯示目標page-link, toggle class active
  $('.page-item.active').toggleClass('active')
  $(`[data-page='${targetPage}']`).parent().toggleClass('active')
}

function removeFavoriteItem(id) {
  
  // find movie by id
  const dataIndex = data.findIndex(item => item.id === Number(id))
  const currentIndex = currentData.findIndex(item => item.id === Number(id))

  // remove movie and updata localStorage
  data.splice(dataIndex, 1)
  currentData.splice(currentIndex, 1)
  sessionStorage.setItem('favoriteMovies', JSON.stringify(data))

  // render datalist
  displayDataList(currentData, dataPanel.dataset.mode)
}

// ===============================
// 執行序
// ===============================

// 初始化頁面內容
// 從cache, 配置顯示模式 'mode', 如無資料, 則設為card
{
  const mode = sessionStorage.getItem('mode') || 'card'
  dataPanel.dataset.mode = mode
  $(`[data-mode=${mode}]`).toggleClass('active')
}

// add data to HTML from favoriteMovies
getTotalPages(data)
getPageData(1, data, dataPanel.dataset.mode)

// 高亮 .page-link 1, 加入class active
$(`[data-page="1"]`).parent().toggleClass('active')

// 監聽 dataPanel
dataPanel.addEventListener('click', e => {
  if (e.target.matches('.btn-show-movie')) {
    showMovie(e.target.dataset.id)
  }

  if (e.target.matches('.btn-remove-favorite')) {
    removeFavoriteItem(e.target.dataset.id)
  }
})

// 監聽 search
searchForm.addEventListener('input', e => {
  // 用searchInput建立成正規表達式, 用於篩選符合的資料
  // 篩選 => 所有包含 searchInput 內容者, 無論大小寫
  const regex = new RegExp(searchInput.value, 'i')
  const results = data.filter(i => i.title.match(regex))
  getTotalPages(results)
  getPageData(1, results, dataPanel.dataset.mode)

  // 刷新search info
  $('#search-info').text(`共有 ${results.length} 項符合 (從 ${data.length} 個項目中)`)
  if (e.target.value === '') { $('#search-info').text('') }

  // 高亮 .page-link 1, 加入class active
  $(`[data-page="1"]`).parent().toggleClass('active')
})

// 監聽 pagination
pagination.addEventListener('click', e => {
  const currentPage = $('.page-item.active').children().attr('data-page')

  if (e.target.matches('.page')) { goToPage(e.target.dataset.page) }

  if (e.target.matches('.previous')) {
    // 上一頁 => (當前頁數 - 1), 如在首頁, 儲存為頁1
    const targetPage = (+currentPage - 1) || 1
    goToPage(targetPage)
  }

  if (e.target.matches('.next')) {
    // li 總數會多出 "上一頁" 與 "下一頁", 需扣除這兩筆
    const lastPage = $('#pagination li').length - 2

    // 下一頁 => (當前頁數 + 1), 如已在底頁, 儲存為底頁
    const targetPage = (+currentPage + 1) > lastPage ? lastPage : (+currentPage + 1)
    goToPage(targetPage)
  }
})

// 監聽 list-mode toggler
$('#list-mode').on('click', e => {
  const currentPage = $('.page-item.active').children().attr('data-page')

  // 查看並保存click目標, dataset中的mode type
  const mode = $(e.target).attr('data-mode')

  // 在dataPanel立flag, 紀錄當前mode type, 供其他功能調用
  $(dataPanel).attr('data-mode', mode)

  // 切換mode, 高亮當前mode
  getPageData(currentPage, currentData, dataPanel.dataset.mode)
  $('#list-mode .active').toggleClass('active')
  e.target.classList.toggle('active')

  // 將當前mode登錄到cache
  sessionStorage.setItem('mode', mode)
})