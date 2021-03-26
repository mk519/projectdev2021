const URL_BASE = "https://collegem820210207221016.azurewebsites.net";
class Login {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

function LoginOnClick() {
    if (VerifyLoginInfo()) {
        console.log("Login Sequence Started");
        var user = document.getElementById("txtUsername").value;
        var pass = document.getElementById("txtPassword").value;

        const login = new Login(user, pass);
        HttpPostRequest(login, URL_BASE + "/api/User/login");
    } else {
        console.error("Empty Login Info");
    }
}

function VerifyLoginInfo() {
    var infoFilled = true;
    var user = document.getElementById("txtUsername").value;
    var pass = document.getElementById("txtPassword").value;
    if (user.length == 0 || pass.length == 0) {
        infoFilled = false;
    }
    return infoFilled;
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
                document.getElementById("divSignIn").innerHTML = '<input id="btnLogin" type="button" value="Sign in" onclick="LoginOnClick()" name=""></input>';
                document.getElementById("txtPassword").value = "";
                document.getElementById("errorMsg").innerHTML = "Username or password is invalid";
                document.getElementById("errorMsg").style.color = "red";
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
    document.getElementById("divSignIn").innerHTML = '<div class="loader"></div>';
}

function LoginOnLoad() {
    // This only matters if the user came directly from the create account page.
    var txtToDisplay = sessionStorage.getItem("txtAccountCreated");
    var username = sessionStorage.getItem("uName");
    if (txtToDisplay != undefined && txtToDisplay.length>0 && username != undefined && username.length>0) {
        document.getElementById("txtUsername").value = username;
        document.getElementById("errorMsg").innerHTML = txtToDisplay;
        document.getElementById("errorMsg").style.color = "#006400";
        sessionStorage.removeItem("txtAccountCreated");
        sessionStorage.removeItem("uName");
    }
}