const { generateHashRs, generateHashesApiRs } = require('./index')
const { randomBytes, createHash} = require("crypto");

const inputStrings = Array.from({ length: 100000 }, () => randomBytes(18).toString('hex'))

console.log('------------------------------------------------------')
console.time('Generate 100K hashes in Rust')
generateHashesApiRs(100000);
console.timeEnd('Generate 100K hashes in Rust')
console.log('------------------------------------------------------')


console.time('Generate 100K hashes in JS')
for (let i = 0; i < inputStrings.length - 1; i++) {
    createHash('sha256').update(inputStrings[i]).digest('hex')
}
console.timeEnd('Generate 100K hashes in JS')
console.log('------------------------------------------------------')

let time = 0n
for (let i = 0; i < inputStrings.length - 1; i++) {
    const start = process.hrtime.bigint()
    generateHashRs(inputStrings[i])
    const end = process.hrtime.bigint()
    time = time + (end - start)
}

console.log('Generate 100K hashes using Rust hash function:')
const averageTime = time / 100000n
console.log('Average time in nanoseconds:', Number(averageTime), 'ns')
console.log('Average time in milliseconds:', Number((averageTime * 10000n) / 1000000n) / 10000, 'ms')
console.log('------------------------------------------------------')

let time2 = 0n
for (let i = 0; i < inputStrings.length - 1; i++) {
    const start2 = process.hrtime.bigint()
    createHash('sha256').update(inputStrings[i]).digest('hex')
    const end2 = process.hrtime.bigint()
    time2 = time2 + (end2 - start2)
}

console.log('Generate 100K hashes using JS hash function:')
const averageTime2 = time2 / 100000n
console.log('Average time in nanoseconds:', Number(averageTime2), 'ns')
console.log('Average time in milliseconds:', Number((averageTime2 * 10000n) / 1000000n) / 10000, 'ms')
console.log('------------------------------------------------------')