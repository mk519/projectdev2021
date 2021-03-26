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

class Class {
    constructor() {
        this.classId = null;
        this.termId = null;
        this.userId = null;
        this.courseCode = null;
        this.className = null;
        this.startTime = null;
        this.endTime = null;
        this.monday = null;
        this.tuesday = null;
        this.wednesday = null;
        this.thursday = null;
        this.friday = null;
        this.saturday = null;
        this.sunday = null;
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

function createAddClassButton(id) { //term id
    var style = ' style="border: 2px solid black;background-color:#008CBA;margin: 4px 2px;display: inline-block;text-align:center;font-size: 12px;text-decoration: none;border: none;color: white;padding: 4px 8px;" '
    var onclick = ' onclick="OpenAddClassModal(this.name)"'
    var name = ' name="' + id + '" '
    return '<button ' + name + style + onclick + 'type="button" >Add Class</button>';
}

function createDeleteButton(id) { // term id
    var style = ' style="border: 2px solid black;background-color:#f44336;margin: 4px 2px;display: inline-block;text-align:center;font-size: 12px;text-decoration: none;border: none;color: white;padding: 4px 8px;" '
    var onclick = ' onclick="DeleteTermOnClick(this.name)" '
    var name = ' name="' + id + '" '
    return '<button ' + name + style + onclick + 'type="button" >Delete</button>';
}

function DeleteTermOnClick(termId) {
    console.log("Termid: " + termId);
    HttpRequest(null, "delete", RefreshPage, URL_BASE + "/api/Term/" + termId);
}

function RefreshPage(response) {
    location.reload();
}

function createScheduleButton(id) { // term id
    var style = ' style="border: 2px solid black;background-color:#008CBA;margin: 4px 2px;display: inline-block;text-align:center;font-size: 14px;text-decoration: none;border: none;color: white;padding: 4px 8px;" '
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

function AddClassOnClick(termId) {
    if (IsValidAddClassInput()) {
        var userData = JSON.parse(sessionStorage.getItem("userdata"));
        var _class = new Class();
        _class.termId = termId;
        _class.userId = userData.userId;
        _class.courseCode = document.getElementById("courseCode").value;
        _class.className = document.getElementById("className").value;
        _class.startTime = TimeToDateTimeStr(document.getElementById("startTime").value);
        _class.endTime = TimeToDateTimeStr(document.getElementById("endTime").value);
        _class.monday = document.getElementById("chkMonday").checked;
        _class.tuesday = document.getElementById("chkTuesday").checked;
        _class.wednesday = document.getElementById("chkWednesday").checked;
        _class.thursday = document.getElementById("chkThursday").checked;
        _class.friday = document.getElementById("chkFriday").checked;
        _class.saturday = document.getElementById("chkSaturday").checked;
        _class.sunday = document.getElementById("chkSunday").checked;
        HttpRequest(_class, "post", CloseAddClassModal, URL_BASE + "/api/Class");
    }
}

function IsValidAddClassInput() {
    inputVerified = true;
    ResetAddClassLabels();
    var courseCodeLblId = "lblCourseCode";
    var courseCode = document.getElementById("courseCode").value;
    var courseNameLblId = "lblClassName";
    var courseName = document.getElementById("className").value;
    var startTimeLblId = "lblStartTime";
    var startTime = document.getElementById("startTime").value;
    var endTimeLblId = "lblEndTime";
    var endTime = document.getElementById("endTime").value;

    if (!IsValidTime(startTime)) {
        UpdateErrorMessage(startTimeLblId, "Start Time input invalid. Use format hh:mm");
        inputVerified = false;
    }
    if (!IsValidTime(endTime)) {
        UpdateErrorMessage(endTimeLblId, "Start Time input invalid. Use format hh:mm");
        inputVerified = false;
    }
    if (!IsValidInputString(courseCode, 1, 20)) {
        UpdateErrorMessage(courseCodeLblId, "Course Code must be 1-20 characters & not some special characters");
        inputVerified = false;
    }
    if (!IsValidInputString(courseName, 1, 40)) {
        UpdateErrorMessage(courseNameLblId, "Course Code must be 1-40 characters & not some special characters");
        inputVerified = false;
    }
    return inputVerified;
}

function ResetAddClassLabels() {
    document.getElementById("lblCourseCode").innerHTML = "Course Code";
    document.getElementById("lblCourseCode").style.color = "#607d8b";
    document.getElementById("lblClassName").innerHTML = "Class Name";
    document.getElementById("lblClassName").style.color = "#607d8b";
    document.getElementById("lblEndTime").innerHTML = "End Time";
    document.getElementById("lblEndTime").style.color = "#607d8b";
    document.getElementById("lblStartTime").innerHTML = "Start Time";
    document.getElementById("lblStartTime").style.color = "#607d8b";
}

function AddTermOnClick() {
    if (IsValidAddTermInput()) {
        var userData = JSON.parse(sessionStorage.getItem("userdata"));
        var term = new Term();
        term.userId = userData.userId;
        term.startDate = document.getElementById("startDate").value;
        term.endDate = document.getElementById("endDate").value;
        HttpRequest(term, "post", CloseAddTermModal, URL_BASE + "/api/Term");
    }
}

function IsValidAddTermInput() {
    inputVerified = true;
    ResetAddTermLabels();
    var startDateLblId = "lblStartDate";
    var startDate = document.getElementById("startDate").value;
    var endDateLblId = "lblEndDate";
    var endDate = document.getElementById("endDate").value;

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
    document.getElementById("lblStartDate").innerHTML = "Start Date";
    document.getElementById("lblStartDate").style.color = "#607d8b";
    document.getElementById("lblEndDate").innerHTML = "End Date";
    document.getElementById("lblEndDate").style.color = "#607d8b";
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



function OpenAddTermModal() {
    // Get the modal
    var modal = document.getElementById("modalAddTerm");
    modal.style.display = "block";
}

function CloseAddTermModal(response = null) {
    // Get the modal
    var modal = document.getElementById("modalAddTerm");
    modal.style.display = "none";
    if (response != null) {
        document.getElementById("startDate").value = "";
        document.getElementById("endDate").value = "";
        location.reload();
    }
}

function OpenAddClassModal(termId) {
    // Get the modal
    var modal = document.getElementById("modalAddClass");
    modal.style.display = "block";
    document.getElementById("addClassConfirm").name = termId;
}

function CloseAddClassModal(response = null) {
    var modal = document.getElementById("modalAddClass");
    modal.style.display = "none";
    document.getElementById("addClassConfirm").name = "addClassConfirm";
    if (response != null) {
        document.getElementById("courseCode").value = "";
        document.getElementById("className").value = "";
        document.getElementById("startTime").value = "";
        document.getElementById("endTime").value = "";
        document.getElementById("chkMonday").checked = false;
        document.getElementById("chkTuesday").checked = false;
        document.getElementById("chkWednesday").checked = false;
        document.getElementById("chkThursday").checked = false;
        document.getElementById("chkFriday").checked = false;
        document.getElementById("chkSaturday").checked = false;
        document.getElementById("chkSunday").checked = false;
    }
}

function TimeToDateTimeStr(timeStr){
    var datetimePrefix = "0001-01-01T";
    var datetimeSuffix = ":00";
    var timeAsDateTime = datetimePrefix + updateHoursMonth(parseInt(timeStr.split(":")[0])) + ":" + updateMins(parseInt(timeStr.split(":")[1])) + datetimeSuffix;
    return timeAsDateTime;
}