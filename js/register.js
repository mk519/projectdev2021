
function CreateUserOnClick() {
    if (VerifyRegisterInput()) {
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
                document.getElementById("divRegisterBtn").innerHTML = '<input type="button" value="Register" onclick="CreateUserOnClick()" name="">';
                return Promise.reject("server")
            }
        })
        .then(dataJson => {
            console.log(dataJson)
            sessionStorage.setItem("txtAccountCreated", "User account created. Please Login");
            sessionStorage.setItem("uName", dataObject.username);
            window.location.href = './login.html';
        })
        .catch(err => {
            if (err === "server") return
            console.log(err)
        })
    document.getElementById("divRegisterBtn").innerHTML = '<div class="loader"></div>';
}

function VerifyRegisterInput() {
    inputVerified = true;
    ResetUserLabels();
    var username = document.getElementById("username").value;
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var programName = document.getElementById("programName").value;
    var schoolName = document.getElementById("schoolName").value;
    var birthDate = document.getElementById("birthDate").value;
    var formEmail = document.getElementById("emailAddress").value;
    var password = document.getElementById("password").value;

    if (username.length == 0 || username.length >= 40 || username.includes(")")) {
        document.getElementById("lblUsername").innerHTML = "Username input invalid. Must have length 1-40, and not contain some special characters.";
        document.getElementById("lblUsername").style.color = "red";
        document.getElementById("lblUsername").style.fontSize = "11px";
        inputVerified = false;
    }
    if (firstName.length == 0 || firstName.length >= 40 || firstName.includes(")")) {
        document.getElementById("lblFirstName").innerHTML = "First Name input invalid. Must have length 1-40, and not contain some special characters.";
        document.getElementById("lblFirstName").style.color = "red";
        document.getElementById("lblFirstName").style.fontSize = "11px";
        inputVerified = false;
    }
    if (lastName.length == 0 || lastName.length >= 40 || lastName.includes(")")) {
        document.getElementById("lblLastName").innerHTML = "Last Name input invalid. Must have length 1-40, and not contain some special characters.";
        document.getElementById("lblLastName").style.color = "red";
        document.getElementById("lblLastName").style.fontSize = "11px";
        inputVerified = false;
    }
    if (programName.length == 0 || programName.length >= 40 || programName.includes(")")) {
        document.getElementById("lblProgramName").innerHTML = "Program Name input invalid. Must have length 1-40, and not contain some special characters.";
        document.getElementById("lblProgramName").style.color = "red";
        document.getElementById("lblProgramName").style.fontSize = "11px";
        inputVerified = false;
    }
    if (schoolName.length == 0 || schoolName.length >= 40 || schoolName.includes(")")) {
        document.getElementById("lblSchoolName").innerHTML = "School Name input invalid. Must have length 1-40, and not contain some special characters.";
        document.getElementById("lblSchoolName").style.color = "red";
        document.getElementById("lblSchoolName").style.fontSize = "11px";
        inputVerified = false;
    }
    if (birthDate.split("-").length != 3) {
        document.getElementById("lblBirthDate").innerHTML = "Birth Date input invalid. Use format YYYY-MM-DD";
        document.getElementById("lblBirthDate").style.color = "red";
        document.getElementById("lblBirthDate").style.fontSize = "11px";
        inputVerified = false;
    } else {
        var splitDate = birthDate.split("-");
        var year = splitDate[0];
        var month = splitDate[1];
        var day = splitDate[2];
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            document.getElementById("lblBirthDate").innerHTML = " Birth Date input invalid. Use format YYYY-MM-DD";
            document.getElementById("lblBirthDate").style.color = "red";
            document.getElementById("lblBirthDate").style.fontSize = "11px";
            inputVerified = false;
        } else {
            var date = new Date(Date.parse(birthDate));
            if (isNaN(date)) {
                document.getElementById("lblBirthDate").innerHTML = " Birth Date input invalid. Use format YYYY-MM-DD";
                document.getElementById("lblBirthDate").style.color = "red";
                document.getElementById("lblBirthDate").style.fontSize = "11px";
                inputVerified = false;
            }
        }
    }
    if (!validateEmail(formEmail)) {
        document.getElementById("lblFrmEmail").innerHTML = "Email input invalid. Must be valid email.";
        document.getElementById("lblFrmEmail").style.color = "red";
        document.getElementById("lblFrmEmail").style.fontSize = "12px";
        inputVerified = false;
    }
    if (password.length <= 7 || password.length > 20 || password.includes(")")) {
        document.getElementById("lblPassword").innerHTML = "Password input invalid. Must have length 8-20, and not contain some special characters.";
        document.getElementById("lblPassword").style.color = "red";
        document.getElementById("lblPassword").style.fontSize = "11px";
        inputVerified = false;
    }
    return inputVerified;
}

function ResetUserLabels() {
    document.getElementById("lblUsername").innerHTML = "Username";
    document.getElementById("lblUsername").style.color = "#607d8b";
    document.getElementById("lblUsername").style.fontSize = "16px";
    document.getElementById("lblFirstName").innerHTML = "First Name";
    document.getElementById("lblFirstName").style.color = "#607d8b";
    document.getElementById("lblFirstName").style.fontSize = "16px";
    document.getElementById("lblLastName").innerHTML = "Last Name";
    document.getElementById("lblLastName").style.color = "#607d8b";
    document.getElementById("lblLastName").style.fontSize = "16px";
    document.getElementById("lblProgramName").innerHTML = "Program Name";
    document.getElementById("lblProgramName").style.color = "#607d8b";
    document.getElementById("lblProgramName").style.fontSize = "16px";
    document.getElementById("lblSchoolName").innerHTML = "Name of School/Institution";
    document.getElementById("lblSchoolName").style.color = "#607d8b";
    document.getElementById("lblSchoolName").style.fontSize = "16px";
    document.getElementById("lblBirthDate").innerHTML = "Birth Date";
    document.getElementById("lblBirthDate").style.color = "#607d8b";
    document.getElementById("lblBirthDate").style.fontSize = "16px";
    document.getElementById("lblFrmEmail").innerHTML = "Email Address";
    document.getElementById("lblFrmEmail").style.color = "#607d8b";
    document.getElementById("lblFrmEmail").style.fontSize = "16px";
    document.getElementById("lblPassword").innerHTML = "Password";
    document.getElementById("lblPassword").style.color = "#607d8b";
    document.getElementById("lblPassword").style.fontSize = "16px";
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

