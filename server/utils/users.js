const users = [];
const rooms = [];

const createRoom = ({username, roomName}) => {
    // Clean the data
    username = username.trim()
    roomName = roomName.trim()

    // Validate the data
    if (!username || !roomName) {
        return {
            error: 'Username and room are required!'
        }
    }
    // Check for existing room
    const existingRoom = rooms.find((room) => {
        return room.room === room && room.username === username
    })

    // Validate username
    if (existingRoom) {
        return { existingRoom }
    }

    // Store room
    const room = { creator: username, name: roomName }
    rooms.push(room)
    return { room }
}

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim()
    room = room.trim()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Check for valid room
    const isRoomCreated = rooms.find((createdRoom) => {
        return createdRoom.name === room
    })

    // Validate room
    if (!isRoomCreated) {
        return {
            error: 'Room not created!'
        }
    }

    // Store user
    const user = { id, username, room };
    users.push(user);
    const host = isRoomCreated.creator;

    //Revive room
    if(isRoomCreated.discardTrigger) clearTimeout(isRoomCreated.discardTrigger);

    return { user , host}
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id) || {}
}

const getUsersInRoom = (room) => {
    room = room.trim()
    return users.filter((user) => user.room === room)
}

const initiateRoomDiscard = (roomName) => {
    const index = rooms.findIndex(room => room.name === roomName);
    if(index === -1) return;
    const roomToDiscard = rooms[index];
    roomToDiscard.discardTrigger = setTimeout(()=>{
        rooms.splice(index, 1)
    },30000);
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    createRoom,
    initiateRoomDiscard
}