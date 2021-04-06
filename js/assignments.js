const URL_BASE = "https://collegem820210207221016.azurewebsites.net";
function onLoadAssignment() {
    var userData = JSON.parse(sessionStorage.getItem("userdata"));
    var user = new User();
    user.populateWithJson(userData);
    document.getElementById("nameTopScreen").innerHTML = user.firstName + " " + user.lastName;
    console.log("test")
    HttpRequest(null, "get", AfterGettingClasses, URL_BASE + "/api/Class/User/" + user.userId)
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

    populateWithJson(userJson) {
        this.assignmentId = userJson.assignmentId;
        this.userId = userJson.userId;
        this.termId = userJson.termId;
        this.classId = userJson.classId;
        this.releaseDate = userJson.releaseDate;
        this.dueDate = userJson.dueDate;
        this.gradeWeight = userJson.gradeWeight;
        this.hoursToComplete = userJson.hoursToComplete;
    }

    createChartHTML(courseCode) {
        var dtRelease = new Date(Date.parse(this.releaseDate));
        var dtDue = new Date(Date.parse(this.dueDate));

        var releaseMonth = updateHoursMonth(dtRelease.getMonth() + 1);
        var releaseDay = updateHoursMonth(dtRelease.getDate());
        var dueMonth = updateHoursMonth(dtDue.getMonth() + 1);
        var dueDay = updateHoursMonth(dtDue.getDate());

        var courseCode = "<td>" + courseCode + "</td>";
        var releaseDate = "<td>" + dtRelease.getFullYear() + "-" + releaseMonth + "-" + releaseDay + "</td>";
        var dueDate = "<td>" + dtDue.getFullYear() + "-" + dueMonth + "-" + dueDay + "</td>";
        var gradeWeight = "<td>" + this.gradeWeight + "%</td>";
        var btnEdit = "<td>" + createEditButton(this.assignmentId) + "</td>";
        var btnDelete = "<td>" + createDeleteButton(this.assignmentId) + "</td>";

        return "<tr>" + courseCode + releaseDate + dueDate + gradeWeight + btnEdit + btnDelete + "</tr>"
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

function CreateAssignmentRows(assignments) {
    var userData = JSON.parse(sessionStorage.getItem("userdata"));
    var classes = userData.classes;
    for (a = 0; a < assignments.length; a++) {
        var assignment = new Assignment();
        assignment.populateWithJson(assignments[a]);
        document.getElementById("assignmentList").innerHTML += assignment.createChartHTML(getCourseCode(assignment.classId, classes));
    }
}

function AfterGettingClasses(classes) {
    UpdateStoredUserClasses(classes);
    var userData = JSON.parse(sessionStorage.getItem("userdata"));
    var user = new User();
    user.populateWithJson(userData);
    HttpRequest(null, "get", CreateAssignmentRows, URL_BASE + "/api/Assignment/User/" + user.userId);
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
    var onclick = ' onclick="DeleteAssignmentOnClick(this.name)" '
    var name = ' name="' + id + '" '
    return '<button ' + name + style + onclick + 'type="button" >Delete</button>';
}

function createEditButton(id) {
    var style = ' style="border: 2px solid black; border-radius: 2px; background-color:#46C646;margin: 0px 2px;display: inline-block;text-align:center;font-size: 12px;text-decoration: none;border: none;color: white;padding: 4px 8px;" '
    var onclick = ' onclick="OpenEditAssignmentModal(this.name)" '
    var name = ' name="' + id + '" '
    return '<button ' + name + style + onclick + 'type="button" >Edit</button>';
}

function DeleteAssignmentOnClick(assignmentId){
    HttpRequest(null, "delete", RefreshPage, URL_BASE + "/api/Assignment/" + assignmentId);
}

function RefreshPage(response){
    location.reload();
}

function OpenEditAssignmentModal(assignmentId) {
    // Get the modal
    var modal = document.getElementById("modalEditAssignment");
    modal.style.display = "block";
    document.getElementById("editAssignmentConfirm").name = assignmentId;
    HttpRequest(null, "get", PopulateAssignmentModal, URL_BASE + "/api/Assignment/" + assignmentId)

}

function CloseEditAssignmentModal(response = null) {
    // Get the modal
    var modal = document.getElementById("modalEditAssignment");
    modal.style.display = "none";
    if (response != null) {
        document.getElementById("releaseDate").value = "";
        document.getElementById("dueDate").value = "";
        document.getElementById("gradeWeight").value = "";
        document.getElementById("hoursNeeded").value = "";
        location.reload();
    }
}

function PopulateAssignmentModal(response) {
    document.getElementById("releaseDate").value = response.releaseDate.split("T")[0];
    document.getElementById("dueDate").value = response.dueDate.split("T")[0];
    document.getElementById("gradeWeight").value = response.gradeWeight;
    document.getElementById("hoursNeeded").value = response.hoursToComplete;
}

function EditAssignmentOnCLick(assignmentId){
    if(IsValidAddAssignmentInput()){
        var assignment = new Assignment();
        assignment.assignmentId = assignmentId;
        assignment.releaseDate = document.getElementById("releaseDate").value;
        assignment.dueDate = document.getElementById("dueDate").value;
        assignment.gradeWeight = parseInt(document.getElementById("gradeWeight").value);
        assignment.hoursToComplete = parseFloat(document.getElementById("hoursNeeded").value);
        HttpRequest(assignment, "put", RefreshPage, URL_BASE + "/api/Assignment");
    }
}

function IsValidAddAssignmentInput() {
    inputVerified = true;
    ResetEditAssignmentLabels();
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

function ResetEditAssignmentLabels() {
    document.getElementById("lblreleaseDate").innerHTML = "Release Date";
    document.getElementById("lblreleaseDate").style.color = "#607d8b";
    document.getElementById("lbldueDate").innerHTML = "Due Date";
    document.getElementById("lbldueDate").style.color = "#607d8b";
    document.getElementById("lblgradeWeight").innerHTML = "Grade Weight (%)";
    document.getElementById("lblgradeWeight").style.color = "#607d8b";
    document.getElementById("lblhoursNeeded").innerHTML = "Hours Needed To Complete";
    document.getElementById("lblhoursNeeded").style.color = "#607d8b";
}

function UpdateErrorMessage(label, message) {
    document.getElementById(label).innerHTML = message;
    document.getElementById(label).style.color = "red";
}

function IsValidHoursToComplete(hours) {
    var isValid = true;
    if (isNaN(hours) || parseFloat(hours) <= 0 || parseFloat(hours) >= 100) {
        isValid = false;
    }
    return isValid;
}

function IsValidGradeWeight(gradeWeight) {
    var isValid = true;
    if (isNaN(gradeWeight) || parseInt(gradeWeight) < 0 || parseInt(gradeWeight) > 100) {
        isValid = false;
    }
    return isValid;
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

function UpdateStoredUserClasses(classes){
    var userData = JSON.parse(sessionStorage.getItem("userdata"));
    userData.classes = classes;
    sessionStorage.setItem("userdata", JSON.stringify(userData));
}