function onLoadProfile() {
    var userData = JSON.parse(sessionStorage.getItem("userdata"));
    var user = new User();
    user.populateWithJson(userData);
    HttpGetPageLoadRequestProfileData("https://collegem820210207221016.azurewebsites.net/api/User/" + user.userId)
    HttpGetPageLoadRequestSleepData("https://collegem820210207221016.azurewebsites.net/api/Sleep/" + user.userId)
}


class Sleep {
    constructor() {
        this.userId = null;
        this.hoursWeekday = null;
        this.hoursWeekend = null;
        this.wakeTimeWeekday = null;
        this.wakeTimeWeekend = null;
    }

    populateWithJson(userJson) {
        this.userId = userJson.userId;
        this.hoursWeekday = userJson.hoursWeekday;
        this.hoursWeekend = userJson.hoursWeekend;
        this.wakeTimeWeekday = userJson.wakeTimeWeekday;
        this.wakeTimeWeekend = userJson.wakeTimeWeekend;
    }
}

class User {
    constructor() {
        this.userId = null;
        this.username = null;
        this.firstName = null;
        this.lastName = null;
        this.schoolName = null;
        this.programName = null;
        this.emailAddress = null;
        this.birthDate = null;
    }

    populateWithJson(userJson) {
        this.userId = userJson.userId;
        this.username = userJson.username;
        this.firstName = userJson.firstName;
        this.lastName = userJson.lastName;
        this.schoolName = userJson.schoolName;
        this.programName = userJson.programName;
        this.emailAddress = userJson.emailAddress;
        this.birthDate = userJson.birthDate;
    }
}

function updateMins(mins) {
    if (mins == 0) {
        return "00";
    } else if (mins <= 9) {
        return "0" + mins;
    }
    else {
        return mins;
    }
}

function updateHoursMonth(hours) {
    if (hours <= 9) {
        return "0" + hours;
    } else {
        return hours;
    }
}

function getDate(dateStr) {
    var date = new Date(Date.parse(dateStr));
    var month = updateHoursMonth(date.getMonth() + 1);
    var day = updateHoursMonth(date.getDate());
    return date.getFullYear() + "-" + month + "-" + day
}

function getTime(timeStr) {
    var time = new Date(Date.parse(timeStr));
    var hours = updateHoursMonth(time.getHours());
    var mins = updateMins(time.getMinutes());
    return hours + ":" + mins;
}

function HttpGetPageLoadRequestProfileData(url) {
    fetch(url, {
        credentials: "same-origin",
        mode: "cors",
        method: "get",
        headers: { "Content-Type": "application/json" }
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
            response = JSON.parse(JSON.stringify(dataJson));
            var user = new User();
            user.populateWithJson(response);
            document.getElementById("nameTopScreen").innerHTML = user.firstName + " " + user.lastName;
            document.getElementById("firstName").value = user.firstName;
            document.getElementById("lastName").value = user.lastName;
            document.getElementById("programName").value = user.programName;
            document.getElementById("schoolName").value = user.schoolName;
            document.getElementById("frmEmail").value = user.emailAddress;
            document.getElementById("birthDate").value = getDate(user.birthDate);
        })
        .catch(err => {
            if (err === "server") return
            console.log(err)
        })
}

function HttpGetPageLoadRequestSleepData(url) {
    fetch(url, {
        credentials: "same-origin",
        mode: "cors",
        method: "get",
        headers: { "Content-Type": "application/json" }
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
            response = JSON.parse(JSON.stringify(dataJson));
            var sleep = new Sleep();
            sleep.populateWithJson(response);
            document.getElementById("weekdayTime").value = getTime(sleep.wakeTimeWeekday);
            document.getElementById("weekdayHours").value = sleep.hoursWeekday;
            document.getElementById("weekendTime").value = getTime(sleep.wakeTimeWeekend);
            document.getElementById("weekendHours").value = sleep.hoursWeekend;
        })
        .catch(err => {
            if (err === "server") return
            console.log(err)
        })
}

function UpdateSleepDetailsOnClick() {
    if (VerifySleepInput()) {
        var userData = JSON.parse(sessionStorage.getItem("userdata"));
        var user = new User();
        user.populateWithJson(userData);
        HttpGetPageLoadRequestUserExpand("https://collegem820210207221016.azurewebsites.net/api/User/" + user.userId + "?expand=true");
    }
}

function SendPutSleepData() {
    var userData = JSON.parse(sessionStorage.getItem("userdata"));
    var user = new User();
    user.populateWithJson(userData);
    var weekdayTime = document.getElementById("weekdayTime").value;
    var weekdayHours = document.getElementById("weekdayHours").value;
    var weekendTime = document.getElementById("weekendTime").value;
    var weekendHours = document.getElementById("weekendHours").value;

    var datetimePrefix = "0001-01-01T";
    var datetimeSuffix = ":00";

    var fullWeekdayTime = datetimePrefix + updateHoursMonth(parseInt(weekdayTime.split(":")[0])) + ":" + updateMins(parseInt(weekdayTime.split(":")[1])) + datetimeSuffix;
    var fullWeekendTime = datetimePrefix + updateHoursMonth(parseInt(weekendTime.split(":")[0])) + ":" + updateMins(parseInt(weekendTime.split(":")[1])) + datetimeSuffix;

    var sleep = new Sleep();
    sleep.userId = user.userId
    sleep.hoursWeekday = parseInt(weekdayHours);
    sleep.hoursWeekend = parseInt(weekendHours);
    sleep.wakeTimeWeekday = fullWeekdayTime;
    sleep.wakeTimeWeekend = fullWeekendTime;
    HttpPutRequestSleep(sleep, "https://collegem820210207221016.azurewebsites.net/api/Sleep")
}

function SendPostSleepData() {
    var userData = JSON.parse(sessionStorage.getItem("userdata"));
    var user = new User();
    user.populateWithJson(userData);
    var weekdayTime = document.getElementById("weekdayTime").value;
    var weekdayHours = document.getElementById("weekdayHours").value;
    var weekendTime = document.getElementById("weekendTime").value;
    var weekendHours = document.getElementById("weekendHours").value;

    var datetimePrefix = "0001-01-01T";
    var datetimeSuffix = ":00";

    var fullWeekdayTime = datetimePrefix + updateHoursMonth(parseInt(weekdayTime.split(":")[0])) + ":" + updateMins(parseInt(weekdayTime.split(":")[1])) + datetimeSuffix;
    var fullWeekendTime = datetimePrefix + updateHoursMonth(parseInt(weekendTime.split(":")[0])) + ":" + updateMins(parseInt(weekendTime.split(":")[1])) + datetimeSuffix;

    var sleep = new Sleep();
    sleep.userId = user.userId
    sleep.hoursWeekday = parseInt(weekdayHours);
    sleep.hoursWeekend = parseInt(weekendHours);
    sleep.wakeTimeWeekday = fullWeekdayTime;
    sleep.wakeTimeWeekend = fullWeekendTime;
    HttpPostRequestSleep(sleep, "https://collegem820210207221016.azurewebsites.net/api/Sleep")
}

function HttpGetPageLoadRequestUserExpand(url) {
    fetch(url, {
        credentials: "same-origin",
        mode: "cors",
        method: "get",
        headers: { "Content-Type": "application/json" }
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
            response = JSON.parse(JSON.stringify(dataJson));
            if (response.sleep == undefined) {
                SendPostSleepData();
            } else {
                SendPutSleepData();
            }
        })
        .catch(err => {
            if (err === "server") return
            console.log(err)
        })
}

function UpdateProfileOnClick() {
    if (VerifyUserDataInput()) {
        var userData = JSON.parse(sessionStorage.getItem("userdata"));
        var user = new User();
        user.populateWithJson(userData);
        var firstName = document.getElementById("firstName").value;
        var lastName = document.getElementById("lastName").value;
        var programName = document.getElementById("programName").value;
        var schoolName = document.getElementById("schoolName").value;
        var birthDate = document.getElementById("birthDate").value;
        var formEmail = document.getElementById("frmEmail").value;
        var newUser = new User();
        newUser.userId = user.userId;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.programName = programName;
        newUser.schoolName = schoolName;
        newUser.birthDate = birthDate;
        newUser.emailAddress = formEmail;
        HttpPutRequestUser(newUser, "https://collegem820210207221016.azurewebsites.net/api/User");
    }
}

function HttpPutRequestUser(dataObject, url) {
    const dataToSend = JSON.stringify(dataObject);
    let dataReceived = "";
    fetch(url, {
        credentials: "same-origin",
        mode: "cors",
        method: "put",
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
            HttpGetUserStoredData("https://collegem820210207221016.azurewebsites.net/api/User/" + dataObject.userId + "?expand=true");
            UserLabelsGreen();
        })
        .catch(err => {
            if (err === "server") return
            console.log(err)
        })
}

function HttpGetUserStoredData(url) {
    fetch(url, {
        credentials: "same-origin",
        mode: "cors",
        method: "get",
        headers: { "Content-Type": "application/json" }
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
            sessionStorage.setItem("userdata", JSON.stringify(dataJson));
            var userData = JSON.parse(JSON.stringify(dataJson));
            var user = new User();
            user.populateWithJson(userData);
            document.getElementById("nameTopScreen").innerHTML = user.firstName + " " + user.lastName;
        })
        .catch(err => {
            if (err === "server") return
            console.log(err)
        })
}

function VerifyUserDataInput() {
    inputVerified = true;
    ResetUserLabels();
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var programName = document.getElementById("programName").value;
    var schoolName = document.getElementById("schoolName").value;
    var birthDate = document.getElementById("birthDate").value;
    var formEmail = document.getElementById("frmEmail").value;

    if (firstName.length == 0 || firstName.length >= 40 || firstName.includes(")")) {
        document.getElementById("lblFirstName").innerHTML = "Input invalid. Cannot be empty, longer than 40 character, or contain some special characters.";
        document.getElementById("lblFirstName").style.color = "red";
        inputVerified = false;
    }
    if (lastName.length == 0 || lastName.length >= 40 || lastName.includes(")")) {
        document.getElementById("lblLastName").innerHTML = "Input invalid. Cannot be empty, longer than 40 character, or contain some special characters.";
        document.getElementById("lblLastName").style.color = "red";
        inputVerified = false;
    }
    if (programName.length == 0 || programName.length >= 40 || programName.includes(")")) {
        document.getElementById("lblProgramName").innerHTML = "Input invalid. Cannot be empty, longer than 40 character, or contain some special characters.";
        document.getElementById("lblProgramName").style.color = "red";
        inputVerified = false;
    }
    if (schoolName.length == 0 || schoolName.length >= 40 || schoolName.includes(")")) {
        document.getElementById("lblSchoolName").innerHTML = "Input invalid. Cannot be empty, longer than 40 character, or contain some special characters.";
        document.getElementById("lblSchoolName").style.color = "red";
        inputVerified = false;
    }
    if (birthDate.split("-").length != 3) {
        document.getElementById("lblBirthDate").innerHTML = "Input invalid. Use format YYYY-MM-DD";
        document.getElementById("lblBirthDate").style.color = "red";
        inputVerified = false;
    } else {
        var splitDate = birthDate.split("-");
        var year = splitDate[0];
        var month = splitDate[1];
        var day = splitDate[2];
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            document.getElementById("lblBirthDate").innerHTML = "Input invalid. Use format YYYY-MM-DD";
            document.getElementById("lblBirthDate").style.color = "red";
            inputVerified = false;
        } else {
            var date = new Date(Date.parse(birthDate));
            if (isNaN(date)) {
                document.getElementById("lblBirthDate").innerHTML = "Input invalid. Use format YYYY-MM-DD";
                document.getElementById("lblBirthDate").style.color = "red";
                inputVerified = false;
            }
        }
    }
    if (!validateEmail(formEmail)) {
        document.getElementById("lblFrmEmail").innerHTML = "Input invalid. Must be valid email.";
        document.getElementById("lblFrmEmail").style.color = "red";
        inputVerified = false;
    }
    var userData = JSON.parse(sessionStorage.getItem("userdata"));
    var user = new User();
    user.populateWithJson(userData);
    // The case where no data has been changed.
    if (firstName == user.firstName &&
        lastName == user.lastName &&
        programName == user.programName &&
        schoolName == user.schoolName &&
        birthDate == user.birthDate.split("T")[0] &&
        formEmail == user.emailAddress) {
        inputVerified = false;
    }

    return inputVerified;
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function ResetUserLabels() {
    document.getElementById("lblFirstName").innerHTML = "First Name";
    document.getElementById("lblFirstName").style.color = "#263238";
    document.getElementById("lblLastName").innerHTML = "Last Name";
    document.getElementById("lblLastName").style.color = "#263238";
    document.getElementById("lblProgramName").innerHTML = "Program Name";
    document.getElementById("lblProgramName").style.color = "#263238";
    document.getElementById("lblSchoolName").innerHTML = "Name of School/Institution";
    document.getElementById("lblSchoolName").style.color = "#263238";
    document.getElementById("lblBirthDate").innerHTML = "Birth Date";
    document.getElementById("lblBirthDate").style.color = "#263238";
    document.getElementById("lblFrmEmail").innerHTML = "Email";
    document.getElementById("lblFrmEmail").style.color = "#263238";
}

function UserLabelsGreen() {
    document.getElementById("lblFirstName").innerHTML = "First Name (Saved)";
    document.getElementById("lblFirstName").style.color = "#006400";
    document.getElementById("lblLastName").innerHTML = "Last Name (Saved)";
    document.getElementById("lblLastName").style.color = "#006400";
    document.getElementById("lblProgramName").innerHTML = "Program Name (Saved)";
    document.getElementById("lblProgramName").style.color = "#006400";
    document.getElementById("lblSchoolName").innerHTML = "Name of School/Institution (Saved)";
    document.getElementById("lblSchoolName").style.color = "#006400";
    document.getElementById("lblBirthDate").innerHTML = "Birth Date (Saved)";
    document.getElementById("lblBirthDate").style.color = "#006400";
    document.getElementById("lblFrmEmail").innerHTML = "Email (Saved)";
    document.getElementById("lblFrmEmail").style.color = "#006400";
}


function VerifySleepInput() {
    var inputVerified = true;
    ResetSleepLabels();
    var weekdayTime = document.getElementById("weekdayTime").value;
    var weekdayHours = document.getElementById("weekdayHours").value;
    var weekendTime = document.getElementById("weekendTime").value;
    var weekendHours = document.getElementById("weekendHours").value;

    if (weekdayHours.length == 0 || isNaN(weekdayHours) || parseInt(weekdayHours) <= 0 || parseInt(weekdayHours) >= 13) {
        document.getElementById("lblWeekdayHours").innerHTML = "Input invalid. Choose a number 1-12";
        document.getElementById("lblWeekdayHours").style.color = "red";
        inputVerified = false;
    }
    if (weekendHours.length == 0 || isNaN(weekendHours) || parseInt(weekendHours) <= 0 || parseInt(weekendHours) >= 13) {
        document.getElementById("lblWeekendHours").innerHTML = "Input invalid. Choose a number 1-12";
        document.getElementById("lblWeekendHours").style.color = "red";
        inputVerified = false;
    }

    if (!weekdayTime.includes(":") || weekdayTime.split(":").length != 2) {
        document.getElementById("lblWeekdayTime").innerHTML = "Input invalid. Enter Format ##:##";
        document.getElementById("lblWeekdayTime").style.color = "red";
        inputVerified = false;
    } else {
        var times = weekdayTime.split(":");
        var hours = times[0];
        var mins = times[1];
        if (isNaN(hours) || isNaN(mins) || parseInt(hours) < 0 || parseInt(hours) >= 24 || parseInt(mins) < 0 || parseInt(mins) >= 60) {
            document.getElementById("lblWeekdayTime").innerHTML = "Input invalid. Enter Format ##:##";
            document.getElementById("lblWeekdayTime").style.color = "red";
            inputVerified = false;
        }
    }

    if (!weekendTime.includes(":") || weekendTime.split(":").length != 2) {
        document.getElementById("lblWeekendTime").innerHTML = "Input invalid. Enter Format ##:##";
        document.getElementById("lblWeekendTime").style.color = "red";
        inputVerified = false;
    } else {
        var times = weekendTime.split(":");
        var hours = times[0];
        var mins = times[1];
        if (isNaN(hours) || isNaN(mins) || parseInt(hours) < 0 || parseInt(hours) >= 24 || parseInt(mins) < 0 || parseInt(mins) >= 60) {
            document.getElementById("lblWeekendTime").innerHTML = "Input invalid. Enter Format ##:##";
            document.getElementById("lblWeekendTime").style.color = "red";
            inputVerified = false;
        }
    }
    // Case where no data has been changed
    var userData = JSON.parse(sessionStorage.getItem("userdata"));
    if (userData.sleep != undefined) {
        var sleep = new Sleep();
        sleep.populateWithJson(userData.sleep);
        if (sleep.hoursWeekday == weekdayHours &&
            sleep.hoursWeekend == weekendHours &&
            sleep.wakeTimeWeekday.includes(weekdayTime) &&
            sleep.wakeTimeWeekend.includes(weekendTime)) {
            inputVerified = false;
        }
    }

    return inputVerified;
}

function ResetSleepLabels() {
    document.getElementById("lblWeekdayHours").innerHTML = "Hours of Sleep";
    document.getElementById("lblWeekdayHours").style.color = "#263238";
    document.getElementById("lblWeekendHours").innerHTML = "Hours of Sleep";
    document.getElementById("lblWeekendHours").style.color = "#263238";
    document.getElementById("lblWeekdayTime").innerHTML = "Wake Time";
    document.getElementById("lblWeekdayTime").style.color = "#263238";
    document.getElementById("lblWeekendTime").innerHTML = "Wake Time";
    document.getElementById("lblWeekendTime").style.color = "#263238";
}

function SleepLabelsGreen() {
    document.getElementById("lblWeekdayHours").style.color = "#006400";
    document.getElementById("lblWeekendHours").style.color = "#006400";
    document.getElementById("lblWeekdayTime").style.color = "#006400";
    document.getElementById("lblWeekendTime").style.color = "#006400";
    document.getElementById("lblWeekdayHours").innerHTML = "Hours of Sleep (saved)";
    document.getElementById("lblWeekendHours").innerHTML = "Hours of Sleep (saved)";
    document.getElementById("lblWeekdayTime").innerHTML = "Wake Time (saved)";
    document.getElementById("lblWeekendTime").innerHTML = "Wake Time (saved)";
}

function HttpPutRequestSleep(dataObject, url) {
    const dataToSend = JSON.stringify(dataObject);
    let dataReceived = "";
    fetch(url, {
        credentials: "same-origin",
        mode: "cors",
        method: "put",
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
            HttpGetUserStoredData("https://collegem820210207221016.azurewebsites.net/api/User/" + dataObject.userId + "?expand=true");
            SleepLabelsGreen();
        })
        .catch(err => {
            if (err === "server") return
            console.log(err)
        })
}

function HttpPostRequestSleep(dataObject, url) {
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
                return Promise.reject("server")
            }
        })
        .then(dataJson => {
            SleepLabelsGreen();
        })
        .catch(err => {
            if (err === "server") return
            console.log(err)
        })
}