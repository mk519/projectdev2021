class Sleep {
    constructor() {
        this.userId = null;
        this.hoursWeekday = null;
        this.hoursWeekend = null;
        this.wakeTimeWeekday = null;
        this.wakeTimeWeekend = null;
    }

    populateWithJson(userJson) {
        this.userId = userJson.userId;
        this.hoursWeekday = userJson.hoursWeekday;
        this.hoursWeekend = userJson.hoursWeekend;
        this.wakeTimeWeekday = userJson.wakeTimeWeekday;
        this.wakeTimeWeekend = userJson.wakeTimeWeekend;
      }
}