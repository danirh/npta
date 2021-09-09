const { checkWordInDictionary, autoSuggestValidWords } = require('./dictionary')
var games = new Map();

const initGame = (room, rounds = 3) => {
    let newGame = {
        room: room.trim().toLowerCase(),
        totalRounds: rounds,
        started: false,
        round: {},
        totalScore: new Map(),
        usedWords: new Set()
    };

    games.set(room,newGame);
}

const setRound = (game) => {
    // const game = games.find(game => game.room === room);
    game.started = true;
    let roundNumber = (game.round.number || 0) + 1;
    let round = {
        stage: "start",
        inputStartTime: Date.now(),
        players: [],
        playerDuration: new Map(),
        number: roundNumber,
        inputs: new Map(),
        votes: new Map(),
        roundScore: {},
        validWords: new Set(),
        invalidWords: {},
        doubleWords: {},
        dictionaryWords: {},
        wordCount: 0
    }
    game.round = round;
}

const startRound = (game) => {
    // const game = games.find(game => game.room === room);
    game.round.started = true;
    game.round.letter = genRandomCharacter();
    game.round.inputStartTime = Date.now();
    // game.round.letter = "A";
}

const saveInputs = (room,user,inputs) => {
    const game = games.get(room);
    if(!game.round.players.includes(user)) return;
    game.round.inputs.set(user,inputs);
    const inputDuration = Math.round((Date.now() - game.round.inputStartTime) / 1000);
    game.round.playerDuration.set(user,inputDuration);
    return inputDuration;
}

const getInputs = (game) => {
    const all = Array.from(game.round.inputs);
    return {all, invalid: game.round.invalidWords, double: game.round.doubleWords, correct: game.round.dictionaryWords};
}

const updateVotes = (room, word, user, isVoted) => {
    const game = games.get(room);
    const voteMap = game.round.votes;
    const players = game.round.players;
    const majorityCount = players.length / 2 || 0;
    if(!voteMap) return;
    var wordVoteSet = voteMap.get(word);
    var validWordUpdated = false;
    if(!wordVoteSet) {
        wordVoteSet = new Set();
        voteMap.set(word,wordVoteSet);
    }
    if(isVoted) wordVoteSet.add(user);
    else wordVoteSet.delete(user);
    if(wordVoteSet.size > majorityCount) {
        if(!game.round.validWords.has(word)) {
            game.round.validWords.add(word);
            validWordUpdated = true;
        } 
    }
    else validWordUpdated = game.round.validWords.delete(word);
    if(validWordUpdated) return game.round.validWords;
}

const generateScore = (game, players) => {
    // const game = games.find(game => game.room === room);
    const correctWords = new Set([...game?.round.validWords,...Object.keys(game?.round.dictionaryWords)]);
    const doubleWords = game?.round.doubleWords;
    const inputMap = game?.round.inputs;
    const scoreMap = game?.round.roundScore;
    const durationMap = game?.round.playerDuration;
    for( let player of players) {
        scoreMap[player] = 0;
    }
    inputMap.forEach((inputs,player)=>{
        if(correctWords.has('name_'+inputs.name)) {
            if(doubleWords['name_'+inputs.name]) scoreMap[player]+=5;
            else scoreMap[player]+=10;
        }
        if(correctWords.has('place_'+inputs.place)) {
            if(doubleWords['place_'+inputs.place]) scoreMap[player]+=5;
            else scoreMap[player]+=10;
        }
        if(correctWords.has('thing_'+inputs.thing)) {
            if(doubleWords['thing_'+inputs.thing]) scoreMap[player]+=5;
            else scoreMap[player]+=10;
        }
        if(correctWords.has('animal_'+inputs.animal)) {
            if(doubleWords['animal_'+inputs.animal]) scoreMap[player]+=5;
            else scoreMap[player]+=10;
        }
    })
    players.forEach((player)=>{
        let durationFactor = 1 - (durationMap.get(player) / 30);
        scoreMap[player] = Math.trunc(scoreMap[player] + (scoreMap[player] * durationFactor));
        let prevScore = game.totalScore.get(player) || 0;
        game.totalScore.set(player,prevScore + scoreMap[player]);
    })

    autoSuggestValidWords(game.round.validWords);
}

const getScores = (game) => {
    // const game = games.find(game => game.room === room);
    return {round: game.round.roundScore, total: Array.from(game.totalScore)};
}

const getWinners = (game) => {
    // const game = games.find(game => game.room === room);
    var scores = Array.from(game.totalScore);
    const winners = {
        first: [],
        second: [],
        third: [],
    }
    const winnerScores = {
        firstScore: 0,
        secondScore: 0,
        thirdScore: 0
    } 
    
    for( let pos in winners) {
        let highScore = 0;
        
        for(let score of scores) {
            if(score[1] > highScore) {
                highScore = score[1];
                winners[pos] = [score[0]];
            }
            else if(score[1] == highScore) {
                winners[pos].push(score[0])
            }
        }
        scores = scores.filter(score=>!winners[pos].includes(score[0]));
        winnerScores[pos+"Score"] = highScore;
    }
    return {...winners,...winnerScores};
}

const hasGameEnded = (game) => {
    // const game = games.find(game => game.room === room);
    return game.round.number >= game.totalRounds;
}

const getGame = (room) => {
    return games.get(room);
}

const deleteGame = (room) => {
    return games.delete(room);
}

const genRandomCharacter = () => String.fromCharCode(Math.trunc(Math.random() * 26) + 65);

const assessWords = (game) => {
    const inputs = Array.from(game.round.inputs).map(o=>o[1]);
    const initialsRgx = new RegExp("^"+game.round.letter,"i");
    const wordSet = new Set();
    const invalid = game.round.invalidWords, double = game.round.doubleWords, dictionaryWord = game.round.dictionaryWords;
    var wordCount = 0;
    for( let input of inputs) {
        for( let category in input) {
            let word = input[category];
            if(!word) continue;
            wordCount++;
            wordWithCategory = category + '_' + word;
            if(wordSet.has(wordWithCategory)) double[wordWithCategory] = true;
            else wordSet.add(wordWithCategory);
            if(!initialsRgx.test(word) || game.usedWords.has(wordWithCategory)) invalid[wordWithCategory] = true;
            else if(checkWordInDictionary(category,word)) dictionaryWord[wordWithCategory] = true; 
        }
    }
    game.round.wordCount = wordCount;
    game.usedWords = new Set([...game.usedWords, ... wordSet]);
}

const getAssessmentTime = (game)=> {
    const total = game.round.wordCount;
    const playerNo = game.round.players.length;
    const correct = Object.keys(game.round.dictionaryWords).length;
    const invalid = Object.keys(game.round.invalidWords).length;
    return (total - correct - invalid) * 2 + playerNo * 4;
}

module.exports = {
    initGame,
    getGame,
    setRound,
    startRound,
    saveInputs,
    getInputs,
    updateVotes,
    assessWords,
    getAssessmentTime,
    generateScore,
    getScores,
    getWinners,
    deleteGame,
    hasGameEnded
}