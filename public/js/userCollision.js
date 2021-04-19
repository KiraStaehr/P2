import {connection} from './ClientConnection.js'

export function collision(movedUserPos) {
    let distX = 0;
    let distY = 0;
    let distance = 0;
    let userRadius = 35;

    for (const user in connection.OtherUserPositions) {
        //if (userID !== allUsers[user].id){
        distX = movedUserPos.left - connection.OtherUserPositions[user].left;
        distY = movedUserPos.top - connection.OtherUserPositions[user].top;
        distance = Math.sqrt((distX * distX) + (distY * distY));
        if (distance < 2 * userRadius) {
            console.log('collides with user ' + user);
            return true
        }
        // }
        else
            console.log('the moved user' + user);
        return false
    }
}

