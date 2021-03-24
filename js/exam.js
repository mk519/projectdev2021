function onLoadExam() {
    var userData = JSON.parse(sessionStorage.getItem("userdata"));
    var user = new User();
    user.populateWithJson(userData);
    document.getElementById("nameTopScreen").innerHTML = user.firstName + " " + user.lastName;
    HttpGetPageLoadRequestClasses("https://collegem820210207221016.azurewebsites.net/api/Class/User/" + user.userId, user.userId)
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
        var btnDelete = "<td>" + createDeleteButton(this.examId) + "</td>";

        return "<tr>" + courseCode + examDate + tmStart + tmEnd + btnDelete + "</tr>"
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

function HttpGetPageLoadRequest(url, classes) {
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
            exams = JSON.parse(JSON.stringify(dataJson));
            for (e = 0; e < exams.length; e++) {
                var exam = new Exam();
                exam.populateWithJson(exams[e]);
                document.getElementById("examList").innerHTML += exam.createChartHTML(getCourseCode(exam.classId, classes));
            }
        })
        .catch(err => {
            if (err === "server") return
            console.log(err)
        })
}

function HttpGetPageLoadRequestClasses(url, userId) {
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
            classes = JSON.parse(JSON.stringify(dataJson));
            HttpGetPageLoadRequest("https://collegem820210207221016.azurewebsites.net/api/Exam/User/" + userId, classes)
        })
        .catch(err => {
            if (err === "server") return
            console.log(err)
        })
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

function createDeleteButton(id){
    var style = 'style="border: 2px solid black;background-color:#f44336;margin: 4px 2px;display: inline-block;text-align:center;font-size: 12px;text-decoration: none;border: none;color: white;padding: 4px 8px;'
    var onclick = 'onclick="TODO(this.id)"'
    var id = ' id="'+id+'" '
    return '<button '+ id + style + onclick +'type="button" >Delete</button>';
}