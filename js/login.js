class Login {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

function LoginOnClick() {
    console.log("Button Clicked");
    var user = document.getElementById("txtUsername").value;
    var pass = document.getElementById("txtPassword").value;

    const login = new Login(user, pass);
    HttpPostRequest(login, "https://collegem820210207221016.azurewebsites.net/api/User/login");
}

function HttpPostRequest(dataObject, url) {
    const dataToSend = JSON.stringify(dataObject);
    let dataReceived = "";
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
                // UPDATE LOGIN PAGE FOR FAILED LOGIN
                document.getElementById("txtPassword").value = "";
                return Promise.reject("server")
            }
        })
        .then(dataJson => {
            sessionStorage.setItem("userdata", JSON.stringify(dataJson));
            window.location.href = './index.html';
        })
        .catch(err => {
            if (err === "server") return
            console.log(err)
        })
}