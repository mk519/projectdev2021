
function CreateUserOnClick(){
    console.log("Button Clicked");
    var user = new User();
    user.username = document.getElementById("username").value;
    user.firstName = document.getElementById("firstName").value;
    user.lastName = document.getElementById("lastName").value;
    user.schoolName = document.getElementById("schoolName").value;
    user.programName = document.getElementById("programName").value;
    user.emailAddress = document.getElementById("emailAddress").value;
    user.birthDate = document.getElementById("birthDate").value;
    user.password = document.getElementById("password").value;

    HttpPostRequest(user, "https://collegem820210207221016.azurewebsites.net/api/User");

}

class User {
    constructor() {
        this.username = null;
        this.password = null;
        this.firstName = null;
        this.lastName = null;
        this.schoolName = null;
        this.programName = null;
        this.emailAddress = null;
        this.birthDate = null;
    }
}

function SendUserToServer(user){
    HttpPostRequest(user, "")
}

function HttpPostRequest(dataObject, url) {
    const dataToSend = JSON.stringify(dataObject);
    console.log(dataToSend);
    fetch(url, {
        credentials: "same-origin",
        mode: "cors",
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: dataToSend
    })
        .then(resp => {
            if (resp.status === 200) {
                console.log("Status: " + resp.status)
                return resp.json()
            } else {
                console.log("Status: " + resp.status)
                return Promise.reject("server")
            }
        })
        .then(dataJson => {
            console.log(dataJson)
            window.location.href = './login.html';
        })
        .catch(err => {
            if (err === "server") return
            console.log(err)
        })
}

