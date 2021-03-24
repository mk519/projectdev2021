function onLoadSchedule() {
    var userData = JSON.parse(sessionStorage.getItem("userdata"));
    var user = new User();
    user.populateWithJson(userData);
    document.getElementById("nameTopScreen").innerHTML = user.firstName + " " + user.lastName;
    HttpGetPageLoadRequest("https://collegem820210207221016.azurewebsites.net/api/Term/User/" + user.userId)
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

        var termNum = "<td>" + int + "</td>";
        var startDate = "<td>" + dtStart.getFullYear() + "-" + startMonth + "-" + startDay + "</td>";
        var endDate = "<td>" + dtEnd.getFullYear() + "-" + endMonth + "-" + endDay + "</td>";
        var btnClassAdd = "<td>" + createAddClassButton(this.termId) + "</td>";
        var btnDelete = "<td>" + createDeleteButton(this.termId) + "</td>";
        return "<tr>" + termNum + startDate + endDate + btnClassAdd + btnDelete + "</tr>"
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

function HttpGetPageLoadRequest(url) {
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
            terms = JSON.parse(JSON.stringify(dataJson));
            for (t = 0; t < terms.length; t++) {
                var term = new Term();
                term.populateWithJson(terms[t]);
                document.getElementById("termsList").innerHTML += term.createChartHTML(t+1);
            }
        })
        .catch(err => {
            if (err === "server") return
            console.log(err)
        })
}

function createAddClassButton(classId){
    var style = 'style="border: 2px solid black;background-color:#008CBA;margin: 4px 2px;display: inline-block;text-align:center;font-size: 12px;text-decoration: none;border: none;color: white;padding: 4px 8px;'
    var onclick = 'onclick="TODO('+classId+')"'
    return '<button ' + style + onclick +'type="button" >Add Class</button>';
}

function createDeleteButton(classId){
    var style = 'style="border: 2px solid black;background-color:#f44336;margin: 4px 2px;display: inline-block;text-align:center;font-size: 12px;text-decoration: none;border: none;color: white;padding: 4px 8px;'
    var onclick = 'onclick="TODO('+classId+')"'
    return '<button ' + style + onclick +'type="button" >Delete</button>';
}