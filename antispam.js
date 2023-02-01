const users = new Map();
const LIMIT = 7;
const TIME_DIFF = 5000; // 5 seconds

function isSpam(message) {
    if (!users.has(message.author.id)) {
        add_to_map(message);
        return false;
    }
    const userData = users.get(message.author.id);
    const {lastMessage, timer} = userData;
    if (
        (message.createdTimestamp - lastMessage.createdTimestamp)
        < TIME_DIFF) {
        checkSins(message, userData);
        userData.msgCount++;
        console.log(
            `${message.author.username} msg #: ${userData.msgCount}`
            );
        if (userData.msgCount >= LIMIT) {
            return true;
        }
    }
    return false;
}

function checkSins(message, userData) {
    // combat duplicate spam
    if (userData.lastMessage.content === message.content) { 
        console.log("Duplicate message found!");
        userData.msgCount += 2;
    }

    // combat phishing spam
    if (message.content.includes("http")) { 
        console.log("Link in message found!");
        userData.msgCount += 2;
    }

    // combat discord phishing
    if (message.content.includes(".gg")) { 
        console.log("Discord link in message found!");
        userData.msgCount += 2;
    }

}

function add_to_map(message) {
    let fn = setTimeout(() => {
        users.delete(message.author.id);
        console.log(`Removed ${message.author.id} from map.`);
    }, TIME_DIFF);
    users.set(message.author.id, {
        msgCount: 1,
        lastMessage: message,
        timer: fn
    });
    console.log(
        `${message.author.username} msg #: ${userData.msgCount}`
    );
}

module.exports = {isSpam};