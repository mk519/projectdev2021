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
}