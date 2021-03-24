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
    } else {
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
        // Send Data to API
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
}



function VerifySleepInput() {
    var inputVerified = true;
    ResetSleepLabels();
    var weekdayTime = document.getElementById("weekdayTime").value;
    var weekdayHours = document.getElementById("weekdayHours").value;
    var weekendTime = document.getElementById("weekendTime").value;
    var weekendHours = document.getElementById("weekendHours").value;

    if (isNaN(weekdayHours) || parseInt(weekdayHours) <= 0 || parseInt(weekdayHours) >= 13) {
        document.getElementById("lblWeekdayHours").innerHTML = "Input invalid. Choose a number 1-12";
        document.getElementById("lblWeekdayHours").style.color = "red";
        inputVerified = false;
    }
    if (isNaN(weekendHours) || parseInt(weekendHours) <= 0 || parseInt(weekendHours) >= 13) {
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
            SleepLabelsGreen();
        })
        .catch(err => {
            if (err === "server") return
            console.log(err)
        })
}