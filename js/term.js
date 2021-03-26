const URL_BASE = "https://collegem820210207221016.azurewebsites.net";
function onLoadSchedule() {
    var userData = JSON.parse(sessionStorage.getItem("userdata"));
    var user = new User();
    user.populateWithJson(userData);
    document.getElementById("nameTopScreen").innerHTML = user.firstName + " " + user.lastName;
    HttpRequest(null, "get", CreateTermColumns, URL_BASE + "/api/Term/User/" + user.userId)
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

class Term {
    constructor() {
        this.termId = null;
        this.userId = null;
        this.startDate = null;
        this.endDate = null;
    }

    populateWithJson(userJson) {
        this.termId = userJson.termId;
        this.userId = userJson.userId;
        this.startDate = userJson.startDate;
        this.endDate = userJson.endDate;
    }

    createChartHTML(int) {
        var dtStart = new Date(Date.parse(this.startDate));
        var dtEnd = new Date(Date.parse(this.endDate));

        var startMonth = updateHoursMonth(dtStart.getMonth() + 1);
        var startDay = updateHoursMonth(dtStart.getDate());
        var endMonth = updateHoursMonth(dtEnd.getMonth() + 1);
        var endDay = updateHoursMonth(dtEnd.getDate());

        var startFullDate = dtStart.getFullYear() + "-" + startMonth + "-" + startDay;
        var endFullDate = dtEnd.getFullYear() + "-" + endMonth + "-" + endDay;

        var termNum = "<td>" + int + "</td>";
        var startDate = "<td>" + startFullDate + "</td>";
        var endDate = "<td>" + endFullDate + "</td>";
        var btnClassAdd = "<td>" + createAddClassButton(this.termId) + "</td>";
        var btnDelete = "<td>" + createDeleteButton(this.termId) + "</td>";
        var btnSchedule = "<td>" + createScheduleButton(this.termId) + "</td>";
        return "<tr>" + termNum + startDate + endDate + btnClassAdd + btnSchedule + btnDelete + "</tr>"
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

function CreateTermColumns(responseJson) {
    for (t = 0; t < responseJson.length; t++) {
        var term = new Term();
        term.populateWithJson(responseJson[t]);
        document.getElementById("termsList").innerHTML += term.createChartHTML(t + 1);
    }
}

function createAddClassButton(id) {
    var style = 'style="border: 2px solid black;background-color:#008CBA;margin: 4px 2px;display: inline-block;text-align:center;font-size: 12px;text-decoration: none;border: none;color: white;padding: 4px 8px;"'
    var onclick = 'onclick="TODO(this.name)"'
    var name = ' name="' + id + '" '
    return '<button ' + name + style + onclick + 'type="button" >Add Class</button>';
}

function createDeleteButton(id) {
    var style = 'style="border: 2px solid black;background-color:#f44336;margin: 4px 2px;display: inline-block;text-align:center;font-size: 12px;text-decoration: none;border: none;color: white;padding: 4px 8px;"'
    var onclick = 'onclick="TODO(this.name)"'
    var name = ' id="' + id + '" '
    return '<button ' + name + style + onclick + 'type="button" >Delete</button>';
}

function createScheduleButton(id) {
    var style = 'style="border: 2px solid black;background-color:#008CBA;margin: 4px 2px;display: inline-block;text-align:center;font-size: 14px;text-decoration: none;border: none;color: white;padding: 4px 8px;"'
    var onclick = ' onclick="GenerateScheduleOnClick(this.name)" '
    var name = ' name="' + id + '" '
    return '<button ' + name + style + onclick + ' type="button" >Generate Schedule</button>';
}

function GenerateScheduleOnClick(id) {
    HttpRequest(null, "get", SetupGetSchedule, URL_BASE + "/api/Term/" + id);
}


class CreateSchedule {
    constructor(userId, startDate, endDate) {
        this.userId = userId;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}

function SetupGetSchedule(termResponse) {
    var term = new Term();
    term.populateWithJson(termResponse);
    var dtStart = new Date(Date.parse(term.startDate));
    var dtEnd = new Date(Date.parse(term.endDate));

    var startMonth = updateHoursMonth(dtStart.getMonth() + 1);
    var startDay = updateHoursMonth(dtStart.getDate());
    var endMonth = updateHoursMonth(dtEnd.getMonth() + 1);
    var endDay = updateHoursMonth(dtEnd.getDate());

    var startFullDate = dtStart.getFullYear() + "-" + startMonth + "-" + startDay;
    var endFullDate = dtEnd.getFullYear() + "-" + endMonth + "-" + endDay;

    var createSchedule = new CreateSchedule(term.userId, startFullDate, endFullDate);
    HttpRequest(createSchedule, "post", null, URL_BASE + "/api/Schedule");
}

function VerifyAddClassInput() {
    inputVerified = true;
    ResetAddClassLabels();
    var courseCodeLblId = "";
    var courseCode = document.getElementById("").value;
    var courseNameLblId = "";
    var courseName = document.getElementById("").value;
    var startTimeLblId = "";
    var startTime = document.getElementById("").value;
    var endTimeLblId = "";
    var endTime = document.getElementById("").value;

    if (!IsValidTime(startTime)) {
        UpdateErrorMessage(startTimeLblId, "Start Time input invalid. Use format hh:mm");
        inputVerified = false;
    }
    if (!IsValidTime(endTime)) {
        UpdateErrorMessage(endTimeLblId, "Start Time input invalid. Use format hh:mm");
        inputVerified = false;
    }
    if (IsValidInputString(courseCode, 1, 20)) {
        UpdateErrorMessage(courseCodeLblId, "Course Code must be 1-20 characters & not some special characters");
        inputVerified = false;
    }
    if (IsValidInputString(courseName, 1, 40)) {
        UpdateErrorMessage(courseNameLblId, "Course Code must be 1-40 characters & not some special characters");
        inputVerified = false;
    }
    return inputVerified;
}

function ResetAddClassLabels() {
    document.getElementById("").innerHTML = "Todo";
    document.getElementById("").style.color = "#607d8b";
}

function VerifyAddTermInput() {
    inputVerified = true;
    ResetAddTermLabels();
    var startDateLblId = "";
    var startDate = document.getElementById("").value;
    var endDateLblId = "";
    var endDate = document.getElementById("").value;

    if (!IsValidDate(startDate)) {
        UpdateErrorMessage(startDateLblId, "Start Date input invalid. Use format YYYY-MM-DD");
        inputVerified = false;
    }

    if (!IsValidDate(endDate)) {
        UpdateErrorMessage(endDateLblId, "End Date input invalid. Use format YYYY-MM-DD");
        inputVerified = false;
    }

    if (inputVerified && IsFirstDateAfter(startDate, endDate)) {
        UpdateErrorMessage(startDateLblId, "Start Date must be before End Date");
        inputVerified = false;
    }
    return inputVerified;
}

function ResetAddTermLabels() {
    document.getElementById("").innerHTML = "Todo";
    document.getElementById("").style.color = "#607d8b";
}

function UpdateErrorMessage(label, message) {
    document.getElementById(label).innerHTML = message;
    document.getElementById(label).style.color = "red";
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

function IsFirstDateAfter(firstDate, secondDate) { // Is first date after (or ==) the second date?
    var firstDate = new Date(Date.parse(firstDate));
    var secondDate = new Date(Date.parse(secondDate));
    if (firstDate >= secondDate) {
        return true;
    }
    return false;
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

function IsValidInputString(inputStr, minLength, maxLength) {
    const pattern = /^[a-zA-Z0-9 :()-]*$/;
    var isValid = true;
    if (inputStr.length < minLength || inputStr.length >= maxLength || !pattern.test(inputStr)) {
        isValid = false;
    }
    return isValid;
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