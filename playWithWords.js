'use strict'

const vowels = ["a", "e", "i", "o", "u"]
const consonants = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"]

const ranked = {
    j: 1,
    q: 2,
    x: 3,
    z: 4,
    v: 5,
    w: 6,
    k: 7,
    f: 8,
    b: 9,
    g: 10,
    m: 11,
    p: 12,
    h: 13,
    d: 14,
    y: 15,
    u: 16,
    c: 17,
    n: 18,
    s: 19,
    i: 20,
    l: 21,
    t: 22,
    o: 23,
    r: 24,
    a: 25,
    e: 26
}

const fs = require('fs');

let rawdata = fs.readFileSync('wordList.json');
let words = JSON.parse(rawdata);

let vowelsOnly = (word) => {
    return word.split("").filter(letter => vowels.includes(letter)).join("")
}

// Find average number of vowels in a word
// Analyze vowel frequency
const analyzeVowels = () => {

    let vowelFrequency = {
        "a": 0,
        "e": 0,
        "i": 0,
        "o": 0,
        "u": 0
    }

    let vowelCombinationFreq = {}
    let alphabeticCombinationFreq = {}

    for(let word of words) {
        for (let letter of word){
            if(vowels.includes(letter)) {
                vowelFrequency[letter] = vowelFrequency[letter] + 1
            }
        }

        word = vowelsOnly(word)
        if(vowelCombinationFreq[word]) {
            vowelCombinationFreq[word] = vowelCombinationFreq[word] + 1
        } else {
            vowelCombinationFreq[word] = 1
        }

        let wordArr = word.split("")
        let sortedWordArr = wordArr.sort()
        word = sortedWordArr.join("")
        if(alphabeticCombinationFreq[word]) {
            alphabeticCombinationFreq[word] = alphabeticCombinationFreq[word] + 1
        } else {
            alphabeticCombinationFreq[word] = 1
        }
    }

    console.log(vowelFrequency)
    console.log(vowelCombinationFreq)
    console.log(alphabeticCombinationFreq)
}

const analyzeConsonants = () => {
    const consonantFreq = {}
    words.forEach(word => {
        for(let letter of word){
            if(consonants.includes(letter)) {
                if(consonantFreq[letter]) {
                    consonantFreq[letter] = consonantFreq[letter] + 1
                } else {
                    consonantFreq[letter] = 1
                }
            }
        }
    })
    console.log(consonantFreq)
}
// analyzeConsonants()

const findWords = (letters) => {
    let result = []
    for(let word of words) {
        let pass = true
        let wordList = word.split("").filter(letter => letters.includes(letter))
        letters.forEach(letter => {
            if(!wordList.includes(letter)) {
                pass = false
            }
        })

        if(pass){
            result.push(word)
        }
    }
    console.log(result)
}
// findWords(["u", "n", "d", "c", "y"])

const rankObj = (obj) => {
    let scoredObj = []
    let result = {}
    Object.keys(obj).forEach(i => {
        scoredObj.push(`${i}-${obj[i]}`)
    })

    scoredObj.sort((a,b) => {
        a = parseInt(a.split("-")[1])
        b = parseInt(b.split("-")[1])
        return a-b
    })

    scoredObj.forEach((item, index) => {
        result[item.split("-")[0]] = index + 1
    })

    return result
}

const scoreWords = (wordsToScore) => {
    const result = {}
    wordsToScore.forEach(word => {
        let score = 0
        for(let letter of word) {
            score += ranked[letter]
        }
        result[word] = score
    })
    return result
}

const rankEveryLetter = () => {
    let result = {}
    let letters = {}
    words.forEach(word => {
        for(let letter of word) {
            if(letters[letter]) {
                letters[letter] = letters[letter] + 1
            } else {
                letters[letter] = 1
            }
        }
    })

    console.log(rankObj(letters))
}
// rankEveryLetter()

const scoredWords = scoreWords(words)
const rankedWords = rankObj(scoredWords)
const rankedWordsArr = Object.keys(rankedWords)
console.log(rankedWordsArr[rankedWordsArr.length - 1])