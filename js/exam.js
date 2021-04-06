const URL_BASE = "https://collegem820210207221016.azurewebsites.net";
function onLoadExam() {
    var userData = JSON.parse(sessionStorage.getItem("userdata"));
    var user = new User();
    user.populateWithJson(userData);
    document.getElementById("nameTopScreen").innerHTML = user.firstName + " " + user.lastName;
    HttpRequest(null, "get", AfterGettingClasses, URL_BASE + "/api/Class/User/" + user.userId);
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

    populateWithJson(userJson) {
        this.classId = userJson.classId;
        this.termId = userJson.termId;
        this.userId = userJson.userId;
        this.courseCode = userJson.courseCode;
        this.className = userJson.className;
        this.startTime = userJson.startTime;
        this.endTime = userJson.endTime;
        this.monday = userJson.monday;
        this.tuesday = userJson.tuesday;
        this.wednesday = userJson.wednesday;
        this.thursday = userJson.thursday;
        this.friday = userJson.friday;
        this.saturday = userJson.saturday;
        this.sunday = userJson.sunday;
    }
}




class Exam {
    constructor() {
        this.examId = null;
        this.classId = null;
        this.termId = null;
        this.userId = null;
        this.startTime = null;
        this.endTime = null;
    }

    populateWithJson(userJson) {
        this.examId = userJson.examId;
        this.classId = userJson.classId;
        this.termId = userJson.termId;
        this.userId = userJson.userId;
        this.startTime = userJson.startTime;
        this.endTime = userJson.endTime;
    }

    createChartHTML(courseCode) {
        var dtStart = new Date(Date.parse(this.startTime));
        var dtEnd = new Date(Date.parse(this.endTime));

        var startMonth = updateHoursMonth(dtStart.getMonth() + 1);
        var startDay = updateHoursMonth(dtStart.getDate());

        var startHours = updateHoursMonth(dtStart.getHours());
        var startMins = updateMins(dtStart.getMinutes());

        var endHours = updateHoursMonth(dtEnd.getHours());
        var endMins = updateMins(dtEnd.getMinutes());

        var courseCode = "<td>" + courseCode + "</td>";
        var examDate = "<td>" + dtStart.getFullYear() + "-" + startMonth + "-" + startDay + "</td>";
        var tmStart = "<td>" + startHours + ":" + startMins + "</td>";
        var tmEnd = "<td>" + endHours + ":" + endMins + "</td>";
        var btnEdit = "<td>" + createEditButton(this.examId) + "</td>";
        var btnDelete = "<td>" + createDeleteButton(this.examId) + "</td>";

        return "<tr>" + courseCode + examDate + tmStart + tmEnd + btnEdit + btnDelete + "</tr>"
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

function CreateExamRows(exams) {
    var userData = JSON.parse(sessionStorage.getItem("userdata"));
    var classes = userData.classes;
    for (e = 0; e < exams.length; e++) {
        var exam = new Exam();
        exam.populateWithJson(exams[e]);
        document.getElementById("examList").innerHTML += exam.createChartHTML(getCourseCode(exam.classId, classes));
    }
}

function AfterGettingClasses(classes) {
    UpdateStoredUserClasses(classes);
    var userData = JSON.parse(sessionStorage.getItem("userdata"));
    var user = new User();
    user.populateWithJson(userData);
    HttpRequest(null, "get", CreateExamRows, URL_BASE + "/api/Exam/User/" + user.userId);
}

function getCourseCode(classId, classes) {
    for (c = 0; c < classes.length; c++) {
        var _class = new Class();
        _class.populateWithJson(classes[c]);
        if (_class.classId == classId) {
            return _class.courseCode;
        }
    }
    return "null";
}

function createDeleteButton(id) {
    var style = ' style="border: 2px solid black; border-radius: 2px; background-color:#f44336;margin: 0px 2px;display: inline-block;text-align:center;font-size: 12px;text-decoration: none;border: none;color: white;padding: 4px 8px;" '
    var onclick = ' onclick="DeleteExamOnClick(this.name)" '
    var name = ' name="' + id + '" '
    return '<button ' + name + style + onclick + 'type="button" >Delete</button>';
}

function createEditButton(id) {
    var style = ' style="border: 2px solid black; border-radius: 2px; background-color:#46C646;margin: 0px 2px;display: inline-block;text-align:center;font-size: 12px;text-decoration: none;border: none;color: white;padding: 4px 8px;" '
    var onclick = ' onclick="OpenEditExamModal(this.name)" '
    var name = ' name="' + id + '" '
    return '<button ' + name + style + onclick + 'type="button" >Edit</button>';
}

function DeleteExamOnClick(examId) {
    HttpRequest(null, "delete", RefreshPage, URL_BASE + "/api/Exam/" + examId);
}

function UpdateExamOnClick(examId) {
    if (IsValidAddExamInput()) {
        var exam = new Exam();
        var date = document.getElementById("examDate").value;
        var startTime = document.getElementById("startTime").value
        var endTime = document.getElementById("endTime").value
        exam.examId = examId;
        exam.startTime = CreateTimeString(date, startTime);
        exam.endTime = CreateTimeString(date, endTime);
        HttpRequest(exam, "put", RefreshPage, URL_BASE + "/api/Exam");
    }
}

function OpenEditExamModal(examId) {
    // Get the modal
    var modal = document.getElementById("modalEditExam");
    modal.style.display = "block";
    document.getElementById("editExamConfirm").name = examId;
    HttpRequest(null, "get", PopulateExamModal, URL_BASE + "/api/Exam/" + examId)

}

function PopulateExamModal(response) {
    var dtStart = new Date(Date.parse(response.startTime));
    var dtEnd = new Date(Date.parse(response.endTime));
    var startHours = updateHoursMonth(dtStart.getHours());
    var startMins = updateMins(dtStart.getMinutes());
    var endHours = updateHoursMonth(dtEnd.getHours());
    var endMins = updateMins(dtEnd.getMinutes());
    var startMonth = updateHoursMonth(dtStart.getMonth() + 1);
    var startDay = updateHoursMonth(dtStart.getDate());
    document.getElementById("examDate").value = dtStart.getFullYear() + "-" + startMonth + "-" + startDay;
    document.getElementById("startTime").value = startHours + ":" + startMins;
    document.getElementById("endTime").value = endHours + ":" + endMins;
}

function CloseEditExamModal(response = null) {
    // Get the modal
    var modal = document.getElementById("modalEditExam");
    modal.style.display = "none";
    if (response != null) {
        document.getElementById("examDate").value = "";
        document.getElementById("startTime").value = "";
        document.getElementById("endTime").value = "";
        location.reload();
    }
}

function IsValidAddExamInput() {
    inputVerified = true;
    ResetEditExamLabels();
    var examDateLblId = "lblexamDate";
    var examDate = document.getElementById("examDate").value;
    var startTimeLblId = "lblstartTime";
    var startTime = document.getElementById("startTime").value;
    var endTimeLblId = "lblendTime";
    var endTime = document.getElementById("endTime").value;

    if (!IsValidDate(examDate)) {
        UpdateErrorMessage(examDateLblId, "Exam Date input invalid. Use format YYYY-MM-DD");
        inputVerified = false;
    }
    if (!IsValidTime(startTime)) {
        UpdateErrorMessage(startTimeLblId, "Start Time input invalid. Use format hh:mm");
        inputVerified = false;
    }
    if (!IsValidTime(endTime)) {
        UpdateErrorMessage(endTimeLblId, "End Time input invalid. Use format hh:mm");
        inputVerified = false;
    }
    return inputVerified;
}

function ResetEditExamLabels() {
    document.getElementById("lblexamDate").innerHTML = "Exam Date";
    document.getElementById("lblexamDate").style.color = "#607d8b";
    document.getElementById("lblstartTime").innerHTML = "Start Time";
    document.getElementById("lblstartTime").style.color = "#607d8b";
    document.getElementById("lblendTime").innerHTML = "End Time";
    document.getElementById("lblendTime").style.color = "#607d8b";
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

function CreateTimeString(date, time){
    var datetimePrefix = date + "T";
    var datetimeSuffix = ":00";
    var fullDateTime = datetimePrefix + time + datetimeSuffix;
    return fullDateTime;
}

function UpdateErrorMessage(label, message) {
    document.getElementById(label).innerHTML = message;
    document.getElementById(label).style.color = "red";
}

function RefreshPage(response) {
    location.reload();
}

function UpdateStoredUserClasses(classes) {
    var userData = JSON.parse(sessionStorage.getItem("userdata"));
    userData.classes = classes;
    sessionStorage.setItem("userdata", JSON.stringify(userData));
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