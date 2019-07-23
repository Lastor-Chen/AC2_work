"use strict";

/*
  步驟
  1. 將輸入的運算元顯示到畫面上，並存入變數中
  2. 用運算子(operator)判斷要存入第一個或第二個運算元變數
  3. 將輸入的運算子存入變數
  4. 判斷如果有輸入過operator，代表這裡輸入的是secondValue，要先把畫面上數字清空
  5. 取出運算元及運算子並計算結果
  6. 將結果顯示在畫面上
  7. 實作清除按鈕
*/

// 初始化參數
const box = document.getElementById("display")
box.value = '0'

// 阻擋鍵盤輸入
box.addEventListener('focus', function () {
  box.blur()
})

const calculator = {
  firstValue: null,
  secondValue: null,
  operator: null,
};

// 運算元 (數字0~9)
function operand(num) {
  // 1. 將輸入的運算元顯示到畫面上，並存入變數中
  box.value = box.value + num
  // 當 x.0 時, 不轉Number, 讓屏幕可顯示 x.0 樣式 (UX優化)
  if (!box.value.includes('.0')) { box.value = +box.value }

  /* 4. 輸入為secondValue or 第二輪計算時, 需清空屏幕
   * 需清空：(true)
   * 輸入為secondValue        => 非null, null, 非null
   * 第二輪輸入firstValu      => 非null, null, 非null('equal')
   * 
   * 不能清空：(false)
   * 輸入為firstValue(第二下) => 非null, null, null
   */
  if (calculator.secondValue === null && calculator.operator !== null) {
    box.value = num
  }

  // 若按過等號, operator歸回null, 初始化
  if (calculator.operator === 'equal') { calculator.operator = null }

  // 2. 用operator判斷要存入第一個或第二個運算元變數
  // 重複code, 抽出成副函式
  intoCalculator()

  console.log('數字', calculator)
}

// 運算子 (加減乘除)
function operator(action) {
  // 如果第一鍵是按運算子(operator), firstValu賦 0
  if (calculator.firstValue === null) { calculator.firstValue = box.value }

  // calculator三項皆不為null, 則calculate()結算, 使其可連續運算
  if (!Object.values(calculator).includes(null)) { calculate() }

  // 3. 將輸入的運算子存入變數
  calculator.operator = action

  // 顯示運算過程於屏幕
  showCount()
}

// 計算結果
function calculate() {
  // 運算條件未湊齊時不動作, return掉
  if (calculator.secondValue === null) return

  // 5. 取出運算元及運算子並計算結果
  const op = calculator.operator
  const n1 = calculator.firstValue
  const n2 = calculator.secondValue
  let result = 0

  if (op === 'add') { result = +(n1) + +(n2) }
  if (op === 'subtract') { result = +(n1) - +(n2) }
  if (op === 'multiply') { result = +(n1) * +(n2) }
  if (op === 'divide') { result = +(n1) / +(n2) }

  console.log('等號重置前', calculator)
  // 6. 將結果顯示在畫面上
  // .toPrecision(12)解決浮點數陷阱 { (0.1 + 0.2) or (1 - 0.9)....etc }
  // 參考：https://github.com/camsong/blog/issues/9
  box.value = +result.toPrecision(12)

  // 重置 calculator
  calculator.firstValue = +result.toPrecision(12)
  calculator.secondValue = null
  calculator.operator = 'equal'  // 按下等號給值, 讓下一輪firstValue輸入能清空box

  // 顯示運算過程於屏幕
  showCount()
  console.log('等號', calculator)
}

// 7. 實作清除按鈕
function resetScreen() {
  box.value = 0
  calculator.firstValue = null
  calculator.secondValue = null
  calculator.operator = null

  // 刷新屏幕上之計算過程
  showCount()
  console.log('清除', calculator)
}

function dot(dot) {
  if (box.value.includes('.')) return  // 如果已為float, reutrn掉
  box.value = box.value + dot
}

function backSpace() {
  // 模擬win10計算機, 等號後按back不動作
  if (calculator.operator === 'equal') return

  // 屏幕去字尾
  box.value = box.value.slice(0, -1)
  if (box.value === '' || box.value === '-') { box.value = '0' }

  // 存入calculator
  intoCalculator()
  console.log('back', calculator)
}

function toggle() {
  // 屏幕值轉換正負
  box.value = -box.value

  // 注入calculator
  intoCalculator()
  console.log('正負', calculator)
}


// 降低單一函式複雜度, 拆分出副函式
function intoCalculator() {
  if (calculator.operator === null || calculator.operator === 'equal') {
    calculator.firstValue = +box.value
  } else { calculator.secondValue = +box.value }
}


// 增加計算viewport
const view = document.querySelector('.view')

function showCount() {
  let n1 = calculator.firstValue
  if (n1 === null) { n1 = '' }

  let op = opFix()
  if (op === null) { op = '' }

  let n2 = calculator.secondValue
  if (n2 === null) { n2 = '' }

  view.innerHTML = `${n1}${op}${n2}`
  if (op === 'equal') { view.innerHTML = '' }
}

function opFix() {
  let op = calculator.operator

  if (op === 'add') { op = '+' }
  if (op === 'subtract') { op = '-' }
  if (op === 'multiply') { op = 'x' }
  if (op === 'divide') { op = '&divide;' }
  return op
}