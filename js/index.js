function onLoadIndex() {  
    var userData = JSON.parse(sessionStorage.getItem("userdata"));
    var user = new User(); 
    user.populateWithJson(userData);

    HttpGetPageLoadRequestUserExpand("https://collegem820210207221016.azurewebsites.net/api/User/" + user.userId +"?expand=true")
    HttpGetPageLoadRequestSchedule("https://collegem820210207221016.azurewebsites.net/api/Schedule/" + user.userId)
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

class ScheduleItem {
    constructor() {
        this.scheduleItemId = null;
        this.userId = null;
        this.title = null;
        this.startTime = null;
        this.endTime = null;
    }

    populateWithJson(scheduleJson) {
        this.scheduleItemId = scheduleJson.scheduleItemId;
        this.userId = scheduleJson.userId;
        this.title = scheduleJson.title;
        this.startTime = scheduleJson.startTime;
        this.endTime = scheduleJson.endTime;
    }

    createChartHTML() {
        var dtStart =new Date(Date.parse(this.startTime));
        var dtEnd =new Date(Date.parse(this.endTime));

        var startHours = updateHoursMonth(dtStart.getHours());
        var startMins = updateMins(dtStart.getMinutes());
        var endHours = updateHoursMonth(dtEnd.getHours());
        var endMins = updateMins(dtEnd.getMinutes());
        var startMonth = updateHoursMonth(dtStart.getMonth()+1);
        var startDay = updateHoursMonth(dtStart.getDate());
        var eventTitle = "<td>" + this.title + "</td>";
        var eventDate = "<td>" + dtStart.getFullYear() + "-" + startMonth + "-" + startDay + "</td>";
        var tmStart = "<td>" + startHours + ":" + startMins + "</td>";
        var tmEnd = "<td>" + endHours + ":" + endMins + "</td>";
        return "<tr>" + eventTitle + eventDate + tmStart + tmEnd + "</tr>"
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

function HttpGetPageLoadRequestUserExpand(url) {
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
            response = JSON.parse(JSON.stringify(dataJson));
            var user = new User();
            user.populateWithJson(response);
        
            var numClasses = 0;
            var numExams = 0;
            var numAssignments = 0;
        
            for (t = 0; t < response.terms.length; t++) {
                for (c = 0; c < response.terms[t].classes.length; c++) {
                    numClasses++;
                    for (e = 0; e < response.terms[t].classes[c].exams.length; e++) {
                        numExams++;
                    }
                    for (a = 0; a < response.terms[t].classes[c].assignments.length; a++) {
                        numAssignments++;
                    }
                }
            }
            document.getElementById("nameTopScreen").innerHTML = user.firstName + " " + user.lastName;
            document.getElementById("totalCourses").innerHTML = numClasses;
            document.getElementById("totalAssignments").innerHTML = numExams;
            document.getElementById("totalExams").innerHTML = numAssignments;
        })
        .catch(err => {
            if (err === "server") return
            console.log(err)
        })
}

function HttpGetPageLoadRequestSchedule(url) {
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
            response = JSON.parse(JSON.stringify(dataJson));
            for (s = 0; s < response.schedule.length; s++) {
                var item = new ScheduleItem();
                item.populateWithJson(response.schedule[s]);
                document.getElementById("eventList").innerHTML += item.createChartHTML();
            }
        })
        .catch(err => {
            if (err === "server") return
            console.log(err)
        })
}