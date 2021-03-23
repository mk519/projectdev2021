function onLoadSchedule() {
    var userData = JSON.parse(sessionStorage.getItem("userdata"));
    var user = new User();
    user.populateWithJson(userData);
    document.getElementById("nameTopScreen").innerHTML = user.firstName + " " + user.lastName;

    for (t = 0; t < userData.terms.length; t++) {
        for (c = 0; c < userData.terms[t].classes.length; c++) {
            var _class = new Class();
            _class.populateWithJson(userData.terms[t].classes[c]);
            document.getElementById("classList").innerHTML += _class.createChartHTML();
        }
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
        return "<tr>" + courseCode + courseName + tmStart + tmEnd + days + "</tr>"
    }
}

function updateMins(mins){
    if(mins == 0){
        return "00";
    }else{
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