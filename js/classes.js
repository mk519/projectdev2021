function onLoadSchedule() {
    var userData = JSON.parse(sessionStorage.getItem("userdata"));
    var user = new User();
    user.populateWithJson(userData);
    document.getElementById("nameTopScreen").innerHTML = user.firstName + " " + user.lastName;
    HttpRequest(null, "get", CreateClassesRows, "https://collegem820210207221016.azurewebsites.net/api/Class/User/" + user.userId);
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
        if(this.monday){
            daysOfWeek += "Mon "
        }
        if(this.tuesday){
            daysOfWeek += "Tue "
        }
        if(this.wednesday){
            daysOfWeek += "Wed "
        }
        if(this.thursday){
            daysOfWeek += "Thu "
        }
        if(this.friday){
            daysOfWeek += "Fri "
        }
        if(this.saturday){
            daysOfWeek += "Sat "
        }
        if(this.sunday){
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
        return "<tr>" + courseCode + courseName + tmStart + tmEnd + days + btnAssignmentAdd + btnExamAdd + btnDelete +"</tr>"
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

function updateHoursMonth(hours){
    if(hours <= 9){
        return "0" + hours;
    }else{
        return hours;
    }
}

function CreateClassesRows(classes){
    for (c = 0; c < classes.length; c++) {
        var _class = new Class();
        _class.populateWithJson(classes[c]);
        document.getElementById("classList").innerHTML += _class.createChartHTML();
    }
}

function createAddAssignmentButton(classId){
    var style = 'style="border: 2px solid black;background-color:#008CBA;margin: 4px 2px;display: inline-block;text-align:center;font-size: 10px;text-decoration: none;border: none;color: white;padding: 4px 8px;'
    var onclick = 'onclick="TODO(this.name)"'
    var name = ' name="'+classId+'" '
    return '<button ' + name + style + onclick +'type="button" >Add Assignment</button>';
}

function createAddExamButton(classId){
    var style = 'style="border: 2px solid black;background-color:#008CBA;margin: 4px 2px;display: inline-block;text-align:center;font-size: 10px;text-decoration: none;border: none;color: white;padding: 4px 8px;'
    var onclick = 'onclick="TODO(this.name)"'
    var name = ' name="'+classId+'" '
    return '<button ' + name + style + onclick +'type="button" >Add Exam</button>';
}

function createDeleteButton(classId){
    var style = 'style="border: 2px solid black;background-color:#f44336;margin: 4px 2px;display: inline-block;text-align:center;font-size: 10px;text-decoration: none;border: none;color: white;padding: 4px 8px;'
    var onclick = 'onclick="TODO(this.name)"'
    var name = ' name="'+classId+'" '
    return '<button '+ name + style + onclick +'type="button" >Delete</button>';
}

function VerifyAddAssignmentInput() {
    inputVerified = true;
    ResetAddAssignmentLabels();
    var releaseDateLblId = "";
    var releaseDate = document.getElementById("").value;
    var dueDateLblId = "";
    var dueDateDate = document.getElementById("").value;
    var gradeWeightLblId = "";
    var gradeWeight = document.getElementById("").value;
    var hoursToCompleteLblId = "";
    var hoursToComplete = document.getElementById("").value;

    if (!IsValidDate(releaseDate)) {
        document.getElementById(releaseDateLblId).innerHTML = "Release Date input invalid. Use format YYYY-MM-DD";
        document.getElementById(releaseDateLblId).style.color = "red";
        inputVerified = false;
    }
    if (!IsValidDate(dueDateDate)) {
        document.getElementById(dueDateLblId).innerHTML = "Due Date input invalid. Use format YYYY-MM-DD";
        document.getElementById(dueDateLblId).style.color = "red";
        inputVerified = false;
    }
    if (!IsValidGradeWeight(gradeWeight)) {
        document.getElementById(gradeWeightLblId).innerHTML = "Grade Weight must be 0-100";
        document.getElementById(gradeWeightLblId).style.color = "red";
        inputVerified = false;
    }
    if (!IsValidHoursToComplete(hoursToComplete)) {
        document.getElementById(hoursToCompleteLblId).innerHTML = "Hours to Complete must be between 0-100";
        document.getElementById(hoursToCompleteLblId).style.color = "red";
        inputVerified = false;
    }
    return inputVerified;
}

function ResetAddAssignmentLabels() {
    document.getElementById("").innerHTML = "Todo";
    document.getElementById("").style.color = "#607d8b";
}

function VerifyAddExamInput() {
    inputVerified = true;
    ResetAddExamLabels();
    var examDateLblId = "";
    var examDate = document.getElementById("").value;
    var startTimeLblId = "";
    var startTime = document.getElementById("").value;
    var endTimeLblId = "";
    var endTime = document.getElementById("").value;

    if (!IsValidDate(examDate)) {
        document.getElementById(examDateLblId).innerHTML = "Exam Date input invalid. Use format YYYY-MM-DD";
        document.getElementById(examDateLblId).style.color = "red";
        inputVerified = false;
    }
    if (!IsValidTime(startTime)) {
        document.getElementById(startTimeLblId).innerHTML = "Start Time input invalid. Use format hh:mm";
        document.getElementById(startTimeLblId).style.color = "red";
        inputVerified = false;
    }
    if (!IsValidTime(endTime)) {
        document.getElementById(endTimeLblId).innerHTML = "End Time input invalid. Use format hh:mm";
        document.getElementById(endTimeLblId).style.color = "red";
        inputVerified = false;
    }
    return inputVerified;
}

function ResetAddExamLabels() {
    document.getElementById("").innerHTML = "Todo";
    document.getElementById("").style.color = "#607d8b";
}

function IsValidHoursToComplete(hours){
    var isValid = true;
    if(isNaN(hours) || parseFloat(hours) <= 0 || parseFloat(hours) >= 100){
        isValid = false;
    }
    return isValid;
}

function IsValidGradeWeight(gradeWeight){
    var isValid = true;
    if(isNaN(gradeWeight) || parseInt(gradeWeight) < 0 || parseInt(gradeWeight) > 100){
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

