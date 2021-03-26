const URL_BASE = "https://collegem820210207221016.azurewebsites.net";
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
        HttpPostRequest(user, URL_BASE + "/api/User");
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

    if (!IsValidInputString(username, 1, 40)) {
        UpdateErrorMessage("lblUsername", "Username input invalid. Must have length 1-40, and not contain some special characters.");
        inputVerified = false;
    }
    if (!IsValidInputString(firstName, 1, 40)) {
        UpdateErrorMessage("lblFirstName", "First Name input invalid. Must have length 1-40, and not contain some special characters.");
        inputVerified = false;
    }
    if (!IsValidInputString(lastName, 1, 40)) {
        UpdateErrorMessage("lblLastName", "Last Name input invalid. Must have length 1-40, and not contain some special characters.");
        inputVerified = false;
    }
    if (!IsValidInputString(programName, 1, 40)) {
        UpdateErrorMessage("lblProgramName", "Program Name input invalid. Must have length 1-40, and not contain some special characters.");
        inputVerified = false;
    }
    if (!IsValidInputString(schoolName, 1, 40)) {
        UpdateErrorMessage("lblSchoolName", "School Name input invalid. Must have length 1-40, and not contain some special characters.");
        inputVerified = false;
    }
    if (!IsValidDate(birthDate)) {
        UpdateErrorMessage("lblBirthDate", "Birth Date input invalid. Use format YYYY-MM-DD");
        inputVerified = false;
    }
    if (!validateEmail(formEmail)) {
        UpdateErrorMessage("lblFrmEmail", "Email input invalid. Must be valid email.");
        inputVerified = false;
    }
    if (!IsValidPasswordString(password, 8, 20)) {
        UpdateErrorMessage("lblPassword", "Password input invalid. Must have length 8-20.");
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

function UpdateErrorMessage(label, message) {
    document.getElementById(label).innerHTML = message;
    document.getElementById(label).style.color = "red";
    document.getElementById(label).style.fontSize = "11px";
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function IsValidDate(dateStr) {
    var isValidDate = true;
    if (dateStr.split("-").length != 3) {
        isValidDate = false;
    } else {
        var splitDate = dateStr.split("-");
        var year = splitDate[0];
        var month = splitDate[1];
        var day = splitDate[2];
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            isValidDate = false;
        } else {
            var date = new Date(Date.parse(dateStr));
            if (isNaN(date)) {
                isValidDate = false;
            }
        }
    }
    return isValidDate;
}

function IsValidInputString(inputStr, minLength, maxLength) {
    const pattern = /^[a-zA-Z0-9 :()-]*$/;
    var isValid = true;
    if (inputStr.length < minLength || inputStr.length >= maxLength || !pattern.test(inputStr)) {
        isValid = false;
    }
    return isValid;
}

function IsValidPasswordString(inputStr, minLength, maxLength) {
    var isValid = true;
    if (inputStr.length < minLength || inputStr.length >= maxLength) {
        isValid = false;
    }
    return isValid;
}

