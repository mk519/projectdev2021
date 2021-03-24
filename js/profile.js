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
            console.log(dataJson)
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
            console.log(dataJson)
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