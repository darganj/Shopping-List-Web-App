document.addEventListener('DOMContentLoaded', addListeners);
function addListeners() {

    document.querySelector("#delete_shopping_list").addEventListener('click', function(event)
        {
        var listID = document.querySelector("#delete_shopping_list_listID").value;
        var userID = document.querySelector("#delete_shopping_list_userID").value;
        var request_body = {listID: listID, userID: userID};
        //console.log(request_body);
        var deleteListFromDB = new XMLHttpRequest();
        deleteListFromDB.open("DELETE", "http://localhost:5001/shoppingList", "true");
        deleteListFromDB.setRequestHeader('Content-Type', 'application/json');
        deleteListFromDB.addEventListener('load', function(event) {
            console.log(this.status);
            if (this.status == 200) {
                console.log("Deleted list with list id = listID belonging to user with user id = userID");
                };
            event.preventDefault();
        });
        //console.log(JSON.stringify(request_body));
        deleteListFromDB.send(JSON.stringify(request_body));
        });
        event.preventDefault();
};