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
}