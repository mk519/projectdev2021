const URL_BASE = "https://collegem820210207221016.azurewebsites.net";
function onLoadSchedule() {
    var userData = JSON.parse(sessionStorage.getItem("userdata"));
    var user = new User();
    user.populateWithJson(userData);
    document.getElementById("nameTopScreen").innerHTML = user.firstName + " " + user.lastName;
    HttpRequest(null, "get", CreateClassesRows, URL_BASE + "/api/Class/User/" + user.userId);
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

    createChartHTML() {
        var dtStart = new Date(Date.parse(this.startTime));
        var dtEnd = new Date(Date.parse(this.endTime));
        var startHours = updateHoursMonth(dtStart.getHours());
        var startMins = updateMins(dtStart.getMinutes());
        var endHours = updateHoursMonth(dtEnd.getHours());
        var endMins = updateMins(dtEnd.getMinutes());

        var daysOfWeek = "";
        if (this.monday) {
            daysOfWeek += "Mon "
        }
        if (this.tuesday) {
            daysOfWeek += "Tue "
        }
        if (this.wednesday) {
            daysOfWeek += "Wed "
        }
        if (this.thursday) {
            daysOfWeek += "Thu "
        }
        if (this.friday) {
            daysOfWeek += "Fri "
        }
        if (this.saturday) {
            daysOfWeek += "Sat "
        }
        if (this.sunday) {
            daysOfWeek += "Sun "
        }


        var courseCode = "<td>" + this.courseCode + "</td>";
        var courseName = "<td>" + this.className + "</td>";
        var tmStart = "<td>" + startHours + ":" + startMins + "</td>";
        var tmEnd = "<td>" + endHours + ":" + endMins + "</td>";
        var days = "<td>" + daysOfWeek + "</td>";
        var btnAssignmentAdd = "<td>" + createAddAssignmentButton(this.classId) + "</td>";
        var btnExamAdd = "<td>" + createAddExamButton(this.classId) + "</td>";
        var btnDelete = "<td>" + createDeleteButton(this.classId) + "</td>";
        return "<tr>" + courseCode + courseName + tmStart + tmEnd + days + btnAssignmentAdd + btnExamAdd + btnDelete + "</tr>"
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
}

class Assignment {
    constructor() {
        this.assignmentId = null;
        this.userId = null;
        this.termId = null;
        this.classId = null;
        this.releaseDate = null;
        this.dueDate = null;
        this.gradeWeight = null;
        this.hoursToComplete = null;
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

function CreateClassesRows(classes) {
    for (c = 0; c < classes.length; c++) {
        var _class = new Class();
        _class.populateWithJson(classes[c]);
        document.getElementById("classList").innerHTML += _class.createChartHTML();
    }
}

function createAddAssignmentButton(classId) {
    var style = ' style="border: 2px solid black; border-radius: 2px;background-color:#41b3f9;margin: 0px 2px;display: inline-block;text-align:center;font-size: 12px;text-decoration: none;border: none;color: white;padding: 4px 8px;" '
    var onclick = ' onclick="OpenAddAssignmentModal(this.name)" '
    var name = ' name="' + classId + '" '
    return '<button ' + name + style + onclick + ' type="button" >Add Assignment</button>';
}

function createAddExamButton(classId) {
    var style = ' style="border: 2px solid black; border-radius: 2px;background-color:#41b3f9;margin: 0px 2px;display: inline-block;text-align:center;font-size: 12px;text-decoration: none;border: none;color: white;padding: 4px 8px;" '
    var onclick = ' onclick="OpenAddExamModal(this.name)" '
    var name = ' name="' + classId + '" '
    return '<button ' + name + style + onclick + ' type="button" >Add Exam</button>';
}

function createDeleteButton(classId) {
    var style = ' style="border: 2px solid black; border-radius: 2px;background-color:#f44336;margin: 0px 2px;display: inline-block;text-align:center;font-size: 12px;text-decoration: none;border: none;color: white;padding: 4px 8px;" '
    var onclick = ' onclick="DeleteClassOnClick(this.name)" '
    var name = ' name="' + classId + '" '
    return '<button ' + name + style + onclick + ' type="button" >Delete</button>';
}

function DeleteClassOnClick(classId) {
    HttpRequest(null, "delete", RefreshPage, URL_BASE + "/api/Class/" + classId);
}

function RefreshPage(response) {
    location.reload();
}

function AddAssignmentOnCLick(classId) {
    if (IsValidAddAssignmentInput()) {
        var releaseDate = document.getElementById("releaseDate").value;
        var dueDate = document.getElementById("dueDate").value;
        var gradeWeight = document.getElementById("gradeWeight").value;
        var hoursToComplete = document.getElementById("hoursNeeded").value;
        var userData = JSON.parse(sessionStorage.getItem("userdata"));
        var assignment = new Assignment();
        assignment.userId = userData.userId;
        assignment.classId = classId;
        assignment.releaseDate = releaseDate;
        assignment.dueDate = dueDate;
        assignment.gradeWeight = parseInt(gradeWeight);
        assignment.hoursToComplete = parseFloat(hoursToComplete);
        HttpRequest(assignment, "post", CloseAddAssignmentModal, URL_BASE + "/api/Assignment");
    }
}

function IsValidAddAssignmentInput() {
    inputVerified = true;
    ResetAddAssignmentLabels();
    var releaseDateLblId = "lblreleaseDate";
    var releaseDate = document.getElementById("releaseDate").value;
    var dueDateLblId = "lbldueDate";
    var dueDate = document.getElementById("dueDate").value;
    var gradeWeightLblId = "lblgradeWeight";
    var gradeWeight = document.getElementById("gradeWeight").value;
    var hoursToCompleteLblId = "lblhoursNeeded";
    var hoursToComplete = document.getElementById("hoursNeeded").value;

    if (!IsValidDate(releaseDate)) {
        UpdateErrorMessage(releaseDateLblId, "Release Date input invalid. Use format YYYY-MM-DD");
        inputVerified = false;
    }
    if (!IsValidDate(dueDate)) {
        UpdateErrorMessage(dueDateLblId, "Due Date input invalid. Use format YYYY-MM-DD");
        inputVerified = false;
    }
    if (!IsValidGradeWeight(gradeWeight)) {
        UpdateErrorMessage(gradeWeightLblId, "Grade Weight must be 0-100");
        inputVerified = false;
    }
    if (!IsValidHoursToComplete(hoursToComplete)) {
        UpdateErrorMessage(hoursToCompleteLblId, "Hours to Complete must be between 0-100");
        inputVerified = false;
    }
    return inputVerified;
}

function ResetAddAssignmentLabels() {
    document.getElementById("lblreleaseDate").innerHTML = "Release Date";
    document.getElementById("lblreleaseDate").style.color = "#607d8b";
    document.getElementById("lbldueDate").innerHTML = "Due Date";
    document.getElementById("lbldueDate").style.color = "#607d8b";
    document.getElementById("lblgradeWeight").innerHTML = "Grade Weight (%)";
    document.getElementById("lblgradeWeight").style.color = "#607d8b";
    document.getElementById("lblhoursNeeded").innerHTML = "Hours Needed To Complete";
    document.getElementById("lblhoursNeeded").style.color = "#607d8b";
}

function AddExamOnCLick(classId) {
    if (IsValidAddExamInput()) {
        var examDate = document.getElementById("examDate").value;
        var startTime = document.getElementById("startTime").value;
        var endTime = document.getElementById("endTime").value;
        var userData = JSON.parse(sessionStorage.getItem("userdata"));
        var exam = new Exam();
        exam.userId = userData.userId;
        exam.classId = classId;
        exam.startTime = examDate + "T" + TimeToDateTimeStr(startTime).split("T")[1];
        exam.endTime = examDate + "T" + TimeToDateTimeStr(endTime).split("T")[1];
        HttpRequest(exam, "post", CloseAddExamModal, URL_BASE + "/api/Exam");
    }
}

function IsValidAddExamInput() {
    inputVerified = true;
    ResetAddExamLabels();
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

function ResetAddExamLabels() {
    document.getElementById("lblexamDate").innerHTML = "Exam Date";
    document.getElementById("lblexamDate").style.color = "#607d8b";
    document.getElementById("lblstartTime").innerHTML = "Start Time";
    document.getElementById("lblstartTime").style.color = "#607d8b";
    document.getElementById("lblendTime").innerHTML = "End Time";
    document.getElementById("lblendTime").style.color = "#607d8b";
}

function UpdateErrorMessage(label, message) {
    document.getElementById(label).innerHTML = message;
    document.getElementById(label).style.color = "red";
}

function IsValidHoursToComplete(hours) {
    var isValid = true;
    if (hours == "" || isNaN(hours) || parseFloat(hours) <= 0 || parseFloat(hours) >= 100) {
        isValid = false;
    }
    return isValid;
}

function IsValidGradeWeight(gradeWeight) {
    var isValid = true;
    if (gradeWeight == "" || isNaN(gradeWeight) || parseInt(gradeWeight) < 0 || parseInt(gradeWeight) > 100) {
        isValid = false;
    }
    return isValid;
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

function OpenAddAssignmentModal(classId) {
    // Get the modal
    var modal = document.getElementById("modalAddAssignment");
    modal.style.display = "block";
    document.getElementById("addAssignmentConfirm").name = classId;
}

function CloseAddAssignmentModal(response = null) {
    var modal = document.getElementById("modalAddAssignment");
    modal.style.display = "none";
    document.getElementById("addAssignmentConfirm").name = "addAssignmentConfirm";
    if (response != null) {
        document.getElementById("releaseDate").value = "";
        document.getElementById("dueDate").value = "";
        document.getElementById("gradeWeight").value = "";
        document.getElementById("hoursNeeded").value = "";
    }
}

function OpenAddExamModal(classId) {
    // Get the modal
    var modal = document.getElementById("modalAddExam");
    modal.style.display = "block";
    document.getElementById("addExamConfirm").name = classId;
}

function CloseAddExamModal(response = null) {
    var modal = document.getElementById("modalAddExam");
    modal.style.display = "none";
    document.getElementById("addExamConfirm").name = "addExamConfirm";
    if (response != null) {
        document.getElementById("examDate").value = "";
        document.getElementById("startTime").value = "";
        document.getElementById("endTime").value = "";
    }
}

function TimeToDateTimeStr(timeStr) {
    var datetimePrefix = "0001-01-01T";
    var datetimeSuffix = ":00";
    var timeAsDateTime = datetimePrefix + updateHoursMonth(parseInt(timeStr.split(":")[0])) + ":" + updateMins(parseInt(timeStr.split(":")[1])) + datetimeSuffix;
    return timeAsDateTime;
}
