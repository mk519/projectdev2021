function onLoadAssignment() {
    var userData = JSON.parse(sessionStorage.getItem("userdata"));
    var user = new User();
    user.populateWithJson(userData);
    document.getElementById("nameTopScreen").innerHTML = user.firstName + " " + user.lastName;
    console.log("test")
    HttpRequest(null, "get", AfterGettingClasses, "https://collegem820210207221016.azurewebsites.net/api/Class/User/" + user.userId)
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
        var btnDelete = "<td>" + createDeleteButton(this.assignmentId) + "</td>";

        return "<tr>" + courseCode + releaseDate + dueDate + gradeWeight + btnDelete + "</tr>"
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
    HttpRequest(null, "get", CreateAssignmentRows, "https://collegem820210207221016.azurewebsites.net/api/Assignment/User/" + user.userId);
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
    var style = 'style="border: 2px solid black;background-color:#f44336;margin: 4px 2px;display: inline-block;text-align:center;font-size: 12px;text-decoration: none;border: none;color: white;padding: 4px 8px;'
    var onclick = 'onclick="TODO(this.name)"'
    var name = ' name="' + id + '" '
    return '<button ' + name + style + onclick + 'type="button" >Delete</button>';
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