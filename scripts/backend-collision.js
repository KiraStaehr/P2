

export function detectUserCollisions(allUsers, userProperties, userID, movedUserPos){
    let distX = 0;
    let distY = 0;
    let distance = 0;
    let userRadius = 35;

    for (const user in allUsers) {
        if (userID !== allUsers[user].id){
            distX = movedUserPos.left - allUsers[user].position.left;
            distY = movedUserPos.top - allUsers[user].position.top;
            distance = Math.sqrt((distX*distX) + (distY*distY));
            if (distance < 2*userRadius){
                console.log('collides with user ' + user);
                return true
            }
        }
        else
            console.log('the moved user' +  user);
        return false
    }
}