class DateUtil {

    
    public toInputDate(date: string | Date): string {

        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;

    }

    public todayInputDate(): string {
        return this.toInputDate(new Date());
    }

}

export const dateUtil = new DateUtil();
