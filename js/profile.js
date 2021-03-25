function onLoadProfile() {
    var userData = JSON.parse(sessionStorage.getItem("userdata"));
    var user = new User();
    user.populateWithJson(userData);
    HttpRequest(null, "get", FillUserFormDetail, "https://collegem820210207221016.azurewebsites.net/api/User/" + user.userId);
    HttpRequest(null, "get", FillSleepFormDetail, "https://collegem820210207221016.azurewebsites.net/api/Sleep/" + user.userId);
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

function FillUserFormDetail(response) {
    var user = new User();
    user.populateWithJson(response);
    document.getElementById("nameTopScreen").innerHTML = user.firstName + " " + user.lastName;
    document.getElementById("firstName").value = user.firstName;
    document.getElementById("lastName").value = user.lastName;
    document.getElementById("programName").value = user.programName;
    document.getElementById("schoolName").value = user.schoolName;
    document.getElementById("frmEmail").value = user.emailAddress;
    document.getElementById("birthDate").value = getDate(user.birthDate);
}

function FillSleepFormDetail(response) {
    var sleep = new Sleep();
    sleep.populateWithJson(response);
    document.getElementById("weekdayTime").value = getTime(sleep.wakeTimeWeekday);
    document.getElementById("weekdayHours").value = sleep.hoursWeekday;
    document.getElementById("weekendTime").value = getTime(sleep.wakeTimeWeekend);
    document.getElementById("weekendHours").value = sleep.hoursWeekend;
}

function UpdateSleepDetailsOnClick() {
    if (VerifySleepInput()) {
        var userData = JSON.parse(sessionStorage.getItem("userdata"));
        var user = new User();
        user.populateWithJson(userData);
        HttpRequest(null, "get", CreateOrUpdateSleepInfo, "https://collegem820210207221016.azurewebsites.net/api/User/" + user.userId + "?expand=true");
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
    HttpRequest(sleep, "put", AfterSleepDataUpdate, "https://collegem820210207221016.azurewebsites.net/api/Sleep");
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
    HttpRequest(sleep, "post", PostSleepResponse, "https://collegem820210207221016.azurewebsites.net/api/Sleep");
}

function CreateOrUpdateSleepInfo(response){
    if (response.sleep == undefined) {
        SendPostSleepData();
    } else {
        SendPutSleepData();
    }
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
        HttpRequest(newUser, "put", GetUserStoredData, "https://collegem820210207221016.azurewebsites.net/api/User");
    }
}

function GetUserStoredData(response) {
    HttpRequest(null, "get", UpdateStoredUserData, "https://collegem820210207221016.azurewebsites.net/api/User/" + response.userId + "?expand=true");
    UserLabelsGreen();
}

function UpdateStoredUserData(dataJson) {
    sessionStorage.setItem("userdata", JSON.stringify(dataJson));
    var userData = JSON.parse(JSON.stringify(dataJson));
    var user = new User();
    user.populateWithJson(userData);
    document.getElementById("nameTopScreen").innerHTML = user.firstName + " " + user.lastName;
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

    if (!IsValidInputString(firstName, 1, 40)) {
        document.getElementById("lblFirstName").innerHTML = "Input invalid. Cannot be empty, longer than 40 character, or contain some special characters.";
        document.getElementById("lblFirstName").style.color = "red";
        inputVerified = false;
    }
    if (!IsValidInputString(lastName, 1, 40)) {
        document.getElementById("lblLastName").innerHTML = "Input invalid. Cannot be empty, longer than 40 character, or contain some special characters.";
        document.getElementById("lblLastName").style.color = "red";
        inputVerified = false;
    }
    if (!IsValidInputString(programName, 1, 40)) {
        document.getElementById("lblProgramName").innerHTML = "Input invalid. Cannot be empty, longer than 40 character, or contain some special characters.";
        document.getElementById("lblProgramName").style.color = "red";
        inputVerified = false;
    }
    if (!IsValidInputString(schoolName, 1, 40)) {
        document.getElementById("lblSchoolName").innerHTML = "Input invalid. Cannot be empty, longer than 40 character, or contain some special characters.";
        document.getElementById("lblSchoolName").style.color = "red";
        inputVerified = false;
    }
    if (!IsValidDate(birthDate)) {
        document.getElementById("lblBirthDate").innerHTML = "Input invalid. Use format YYYY-MM-DD";
        document.getElementById("lblBirthDate").style.color = "red";
        inputVerified = false;
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

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function IsValidInputString(inputStr, minLength, maxLength) {
    const pattern = /^[a-zA-Z0-9 :()-]*$/;
    var isValid = true;
    if (inputStr.length < minLength || inputStr.length >= maxLength || !pattern.test(inputStr)) {
        isValid = false;
    }
    return isValid;
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

    if (IsValidSleepLength(weekdayHours, 12)) {
        document.getElementById("lblWeekdayHours").innerHTML = "Input invalid. Choose a number 1-12";
        document.getElementById("lblWeekdayHours").style.color = "red";
        inputVerified = false;
    }
    if (IsValidSleepLength(weekendHours, 12)) {
        document.getElementById("lblWeekendHours").innerHTML = "Input invalid. Choose a number 1-12";
        document.getElementById("lblWeekendHours").style.color = "red";
        inputVerified = false;
    }
    if (!IsValidTime(weekdayTime)) {
        document.getElementById("lblWeekdayTime").innerHTML = "Input invalid. Enter Format hh:mm";
        document.getElementById("lblWeekdayTime").style.color = "red";
        inputVerified = false;
    }
    if (!IsValidTime(weekendTime)) {
        document.getElementById("lblWeekendTime").innerHTML = "Input invalid. Enter Format hh:mm";
        document.getElementById("lblWeekendTime").style.color = "red";
        inputVerified = false;
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

function IsValidTime(time) {
    var isTimeValid = true;
    if (!time.includes(":") || time.split(":").length != 2) {
        isTimeValid = false;
    } else {
        var times = time.split(":");
        var hours = times[0];
        var mins = times[1];
        if (isNaN(hours) || isNaN(mins) || parseInt(hours) < 0 || parseInt(hours) >= 24 || parseInt(mins) < 0 || parseInt(mins) >= 60) {
            isTimeValid = false;
        }
    }
    return isTimeValid
}

function IsValidSleepLength(sleepHours, maxSleepTime) {
    var isValid = true;
    if (sleepHours.length == 0 || isNaN(sleepHours) || parseInt(sleepHours) <= 0 || parseInt(sleepHours) > maxSleepTime)
        return isValid;
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

function AfterSleepDataUpdate(response) {
    HttpRequest(null, "get", GetUserStoredData, "https://collegem820210207221016.azurewebsites.net/api/User/" + response.userId + "?expand=true");
    SleepLabelsGreen();
}

function PostSleepResponse() {
    SleepLabelsGreen();
}

function HttpRequest(dataObject, method, afterResponseFunction, url) {
    var dataToSend = null;
    if (dataObject != null) {
        dataToSend = JSON.stringify(dataObject)
    }
    fetch(url, {
        credentials: "same-origin",
        mode: "cors",
        method: method,
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
            response = JSON.parse(JSON.stringify(dataJson));
            if (afterResponseFunction != null) {
                afterResponseFunction(response);
            }
        })
        .catch(err => {
            if (err === "server") return
            console.log(err)
        })
}