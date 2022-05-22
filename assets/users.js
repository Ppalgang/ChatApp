const users = [];

//kullanıcıları chat'e yollama
function userJoin(id, username, room){
const user = { id, username, room };

users.push(user);
return user;
}

// şuanki kullanıcıyı çekme
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

// kullanıcıyı chatten çıkarma
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

// get room users
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}
