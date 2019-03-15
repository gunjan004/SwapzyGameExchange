/* UserProfile – A class to manage a List / Collection (your choice) of UserItem(s)
• User ID – attribute used for user identification
• User Items – attribute used for UserItem(s)
• removeUserItem(Item) – removes any UserItem associated with the given Item.
• getUserItems() – returns a List / Collection of UserItem from this user profile
• emptyProfile() –clears the entire profile contents
• … any other helper methods you might need to manage this list/collection
*/

var userProfile = function userProfile(userId, userItems) {
    this.userId  = userId;
    this.userItems = userItems;
};

function removeUserItem(userItem) {

}

function getUserItems() {
    return userItems;
}

function emptyProfile() {

}

module.exports.removeUserItem = removeUserItem;
module.exports.getUserItems = getUserItems;
module.exports.emptyProfile = emptyProfile;
module.exports = userProfile;
