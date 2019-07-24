/*!
 * 若該整數能被 3 整除，回傳 Fizz；
 * 若該整數能被 5 整除，回傳 Buzz；
 * 若該整數能被 3 和 5 同時整除，回傳 FizzBuzz；
 * 若都不能整除，回傳該整數。
*/ 

function fizzBuzz(num) {
  let result = ''

  // 3的倍數, 5的倍數, 公倍數, 給予不同result
  if (num % 3 === 0) { result += 'Fizz' } 
  if (num % 5 === 0) { result += 'Buzz' }

  // 如 num 非 3 or 5 之倍數, str為''
  if (result === '') { result = num } 
  console.log(result)
  return result
}