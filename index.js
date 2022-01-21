// Entry point
// A bot to solve wordle every day, and potentially even post about it on Facebook because I hate bandwagons.

const fs = require('fs');

let rawdata = fs.readFileSync('wordList.json');
const prompt = require('prompt-sync')();

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

const placementTest = (placement, word) => {
    let pass = true
    Object.keys(placement).forEach(index => {
        const letter = placement[index]
        if(word[parseInt(index)] !== letter) {
            pass = false
        }
    })
    return !pass
}

// console.log(placementTest({ '0': 'r', '2': 'r' }, "prick"))

const antiLettersTest = (antiLetters, word) => {
    for(let letter of antiLetters) {
        if(word.includes(letter)) {
            return true
        }
    }
    return false
}

const lettersTest = (letters, word) => {
    for(let letter  of letters) {
        if(!word.includes(letter)) {
            return true
        }
    }
    return false
}

const solveWordle = () => {
    console.log("0 = miss, 1 = letter, 2 = place")
    let words = JSON.parse(rawdata);
    let knownLetters = []
    let knownAntiLetters = []
    let knownPlacement = {}
    let knownAntiPlacement = {}
    let attempt = 0

    while(attempt < 5) {
        const scoredWords = scoreWords(words)
        const rankedWords = rankObj(scoredWords)
        const rankedWordsArr = Object.keys(rankedWords)
        const guess = rankedWordsArr[rankedWordsArr.length - 1]

        const result = prompt("guess: " + guess)
        // 0 = miss
        // 1 = letter
        // 2 = place

        if(result === "22222") {
            console.log("WE DID IT")
            return
        }
        result.split("").forEach((res, index) => {
            if(res === "2") {
                if(knownAntiLetters.includes(guess[index])){
                    knownAntiLetters.splice(knownAntiLetters.indexOf(guess[index]), 1)
                }
                knownPlacement[index] = guess[index]
                if(!knownLetters.includes(guess[index])) {
                    knownLetters.push(guess[index])
                }
            } else if(res === "1") {
                knownAntiPlacement[index] = guess[index]
                if(!knownLetters.includes(guess[index])) {
                    knownLetters.push(guess[index])
                }
            } else {
                if(!knownAntiLetters.includes(guess[index]) && !knownLetters.includes(guess[index])) {
                    knownAntiLetters.push(guess[index])
                }
            }
        })
        
        let newWords = []
        console.log(knownPlacement)
        console.log(knownLetters)
        console.log(knownAntiLetters)
        console.log(knownAntiPlacement)
        for(let i = 0; i < words.length; i++){
            const word = words[i]
            if(
                !placementTest(knownPlacement, word) &&
                placementTest(knownAntiPlacement, word) &&
                !antiLettersTest(knownAntiLetters, word) && 
                !lettersTest(knownLetters, word) && 
                word !== guess
            ) {
                newWords.push(word)
            }
        }
        words = newWords
        console.log(words)
        attempt++
    }
}
solveWordle()