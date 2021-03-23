class Login {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

function LoginOnClick() {
    console.log("Button Clicked")
    var user = document.getElementById("txtUsername").value;
    var pass = document.getElementById("txtPassword").value;

    const login = new Login(user, pass);
    SendLogin(login);

}


function SendLogin(instance) {
    const dataToSend = JSON.stringify(instance);
    console.log(dataToSend)
    let dataReceived = "";
    fetch("https://collegem820210207221016.azurewebsites.net/api/User/login", {
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
            dataReceived = JSON.parse(JSON.stringify(dataJson))
            console.log(dataReceived.terms[0])
        })
        .catch(err => {
            if (err === "server") return
            console.log(err)
        })

    console.log(`Received: ${dataReceived}`)
}