const fs = require('fs');
const path = require('path');

const dictPath = path.join(__dirname,"..","assets");

const animalDictPath = path.join(dictPath,"animals.json");
const thingDictPath = path.join(dictPath,"things.json");
const placeDictPath = path.join(dictPath,"places.json");
const nameDictPath = path.join(dictPath,"names.json");
const suggestionsDictPath = path.join(dictPath,"suggestions.txt");

const animals = new Set(JSON.parse(fs.readFileSync(animalDictPath,{encoding: "utf-8", flag: "r"})))
const names = new Set(JSON.parse(fs.readFileSync(nameDictPath,{encoding: "utf-8", flag: "r"})))
const places = new Set(JSON.parse(fs.readFileSync(placeDictPath,{encoding: "utf-8", flag: "r"})))
const things = new Set(JSON.parse(fs.readFileSync(thingDictPath,{encoding: "utf-8", flag: "r"})))

function checkWordInDictionary(category,word) {
    switch(category) {
        case "animal": return animals.has(word);
        case "name": return names.has(word);
        case "place": return places.has(word);
        case "thing": return things.has(word);
        default: return false;
    }
}
function handleSuggestedWord(wordWithCategory,action,cb) {
    let actionSym = '';
    if(action === "ADD") actionSym = '+';
    else if(action === "DELETE") actionSym = '-';
    fs.appendFile(suggestionsDictPath,actionSym + wordWithCategory + '\n',cb);
}
function autoSuggestValidWords(wordSet) {
    for( let word of wordSet) handleSuggestedWord(word,"ADD",()=>{})
}

module.exports = {
    checkWordInDictionary,
    handleSuggestedWord,
    autoSuggestValidWords
}