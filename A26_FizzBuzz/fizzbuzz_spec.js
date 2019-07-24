/*!
 * fizzBuzz() function testing  from './fizzbuzz.js'
 *
 * [case 1] input:  9, expect output: Fizz
 * [case 2] input: 10, expect output: Buzz
 * [case 3] input: 15, expect output: FizzBuzz
 * [case 4] input: 16, expect output: 16
 */ 

const should = chai.should()
describe('測試function fizzbuzz()', () => {
  it("引數為3的倍數, 要回傳'Fizz'", () => {
    const result = fizzBuzz(9)
    result.should.be.equal('Fizz')
  })

  it("引數為5的倍數, 要回傳'Buzz'", () => {
    const result = fizzBuzz(10)
    result.should.be.equal('Buzz')
  })
  it("引數為15的倍數, 要回傳'FizzBuzz'", () => {
    const result = fizzBuzz(15)
    result.should.be.equal('FizzBuzz')
  })
  it("引數不是 3 and 5 的倍數, 要回傳自己本身", () => {
    const result = fizzBuzz(16)
    result.should.be.equal(16)
  })
})