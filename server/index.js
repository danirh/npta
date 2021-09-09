const path = require('path')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const socketio = require('socket.io')
const socketHandler = require('./socketHandler')
const { createRoom } = require('./utils/users')
const { initGame } = require('./utils/game')
const { handleSuggestedWord } = require('./utils/dictionary')

const app = express()
const server = http.createServer(app)
const io = socketio(server,{
    cors: {
      origins: ["http://localhost:8100","http://192.168.10.5:8100/"],
      methods: ["GET", "POST"]
    }
  })

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath));
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, OPTION");
    next();
})

app.get("/create-room",(req,res,next)=>{
    const {username, room: roomName} = req.query;
    createRoom({username, roomName});
    initGame(roomName);
    const expires = new Date(Date.now() + 3600000);
    res
    .setHeader(
        'Set-Cookie',
        `username=${encodeURIComponent(username)};Expires=${expires.toUTCString()}; Path=/`
    ).redirect(
        // "http://" + req.headers.host.replace("3000","8100") + "/" + roomName
        "/" + roomName
    )
})

app.get("/join-room",(req,res,next)=>{
    const {username, room: roomName} = req.query;
    const expires = new Date(Date.now() + 3600000);
    res
    .setHeader(
        'Set-Cookie',
        `username=${encodeURIComponent(username)};Expires=${expires.toUTCString()}; Path=/`
    ).redirect(
        // "http://" + req.headers.host.replace("3000","8100") + "/" + roomName
        "/" + roomName
    )
})

app.post("/suggestWord",bodyParser.json(),(req,res,next)=>{
    const {wordWithCategory,action="ADD"} = req.body;
    handleSuggestedWord(wordWithCategory,action,(error)=>{
        if(error) res.status(500).send("Internal Server Error!");
        else res.sendStatus(200);
    })
})

app.get("/*", (req,res,next)=>{
    res.sendFile(path.join(publicDirectoryPath,"room.html"))
});

io.on('connection',socketHandler(io))

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})