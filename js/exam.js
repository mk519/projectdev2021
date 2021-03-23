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
}