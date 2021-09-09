const Filter = require('bad-words')
const { startRound, saveInputs, getInputs, updateVotes, generateScore, getScores, setRound, hasGameEnded, getWinners, getGame, deleteGame, initGame, assessWords, getAssessmentTime } = require('./utils/game')
const { generateMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom, initiateRoomDiscard } = require('./utils/users')

function socketHandler(io) {
    return (socket) => {
        socket.on('join', (options, callback) => {
            const { error, user, host } = addUser({ id: socket.id, ...options });
            const isHost = host === user.username ? true: false;

            if (error) {
                return callback(error)
            }

            socket.join(user.room)

            socket.emit('message', generateMessage('Admin', 'Welcome!'))
            socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room),
                host: host
            })

            callback(null, isHost)
        })

        socket.on('sendMessage', (message, callback) => {
            const user = getUser(socket.id);
            if(!user.room) return callback('Room not found!');
            const filter = new Filter()

            if (filter.isProfane(message)) {
                return callback('Profanity is not allowed!')
            }

            io.to(user.room).emit('message', generateMessage(user.username, message))
            callback()
        })

        socket.on('startGame', async (rounds, cb) => {
            const room = getUser(socket.id).room;
            if(!room) return cb("Room Not Found!");
            const game = getGame(room);
            if(rounds) game.totalRounds = rounds;
            while(!hasGameEnded(game))
            {
                game.round.stage = "transition";
                setRound(game);
                io.to(room).emit('stageRoundTransition', game.round.number);
                await aTimeout(4000);
                game.round.players = getUsersInRoom(room).map(o=>o.username);
                game.round.stage = "input";
                startRound(game)
                io.to(room).emit('stageInput',game.round.letter);
                io.to(room).emit('timer', 30);
                await aTimeout(30000);
                io.to(room).emit('submitInput');
                await aTimeout(1000);
                game.round.stage = "assessment";
                assessWords(game);
                let assessmentTime = getAssessmentTime(game);
                io.to(room).emit('stageAssessment',getInputs(game));
                io.to(room).emit('timer', assessmentTime);
                await aTimeout(assessmentTime * 1000);
                generateScore(game,game.round.players);
                game.round.stage = "score";
                io.to(room).emit('stageScore',getScores(game));
                io.to(room).emit('timer', 5);
                await aTimeout(5000);
            }
            game.round.stage = "result";
            io.to(room).emit('stageResult',getWinners(game));
        })

        socket.on('saveInput',(data,cb) => {
            const room = getUser(socket.id).room;
            if(!room) return;
            const username = getUser(socket.id).username;
            const duration = saveInputs(room, username, data);
            cb(duration);
        })

        socket.on('updateVote',(word,isVoted) => {
            if(!word) return;
            const {room, username} = getUser(socket.id) || {};
            if(!room) return;
            const game = getGame(room);
            const updatedValidWords = updateVotes(room, word, username, isVoted);
            if(updatedValidWords) io.to(room).emit('validWords',Array.from(updatedValidWords));
        })

        socket.on('fetchValidWords',()=> {
            const room = getUser(socket.id).room;
            if(!room) return;
            const game = getGame(room);
            io.to(socket.id).emit('validWords',Array.from(game.round.validWords));
        })

        socket.on('newGame',() => {
            const room = getUser(socket.id).room;
            if(!room) return;
            deleteGame(room);
            initGame(room);
            io.to(room).emit('stageStart');
        }) 

        socket.on('getStage', cb => {
            const {room, username} = getUser(socket.id);
            if(!room) return;
            const game = getGame(room);
            const isPLaying = game.round.players?.includes(username);
            const round = game.round.number;
            const score = getScores(game);
            switch(game.round.stage) {
                case "transition":
                    io.to(room).emit('stageRoundTransition', game.round.number); cb(round,score,false); break;
                case "input":
                    io.to(room).emit('stageInput',game.round.letter); cb(round,score,!isPLaying); break;
                case "assessment":
                    io.to(room).emit('stageAssessment',getInputs(game)); cb(round,score,!isPLaying); break;
                case "score":
                    io.to(room).emit('stageScore',getScores(game)); cb(round,score,false); break;
                case "result":
                    io.to(room).emit('stageResult',getWinners(game)); cb(round,score,false); break;
                default: 
                    cb(round,score,false); break;
            }
        })

        socket.on('disconnect', () => {
            const user = removeUser(socket.id)

            if (user) {
                const allUsers = getUsersInRoom(user.room);
                if(!allUsers.length) initiateRoomDiscard(user.room);
                io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
                io.to(user.room).emit('roomData', {
                    room: user.room,
                    users: allUsers
                })
            }
        })
    }
}

function aTimeout(timeInMs) {
    return new Promise(resolve=>{
        setTimeout(resolve,timeInMs)
    })
}

module.exports = socketHandler;