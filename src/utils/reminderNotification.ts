export function checkReminders(remindersRef: React.MutableRefObject<any[]>) {
    const now = new Date();
    remindersRef.current.forEach((reminder) => {
        let startTime = new Date(reminder.start);
        if (reminder.repeat === "daily" || reminder.repeat === "weekly") {

            const endTime = reminder.end ? new Date(reminder.end) : null;
            if (endTime && now > endTime) return;
            if (reminder.triggered) return;
        }
        const startTimeLocal = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            startTime.getHours(),
            startTime.getMinutes(),
            startTime.getSeconds()
        );
        let timeDiff = startTimeLocal.getTime() - now.getTime();
        if (reminder.repeat) {
            if (reminder.repeat === "daily" && timeDiff < 0) {
                startTimeLocal.setDate(startTimeLocal.getDate() + 1);
                reminder.start = startTimeLocal.toISOString();
                timeDiff = startTimeLocal.getTime() - now.getTime();
            } else if (reminder.repeat === "monthly" && reminder.monthdays?.length) {

                const endTime = reminder.end ? new Date(reminder.end) : null;
                const cutoffDay = endTime ? endTime.getDate() : 31;
                const reminderDays = reminder.monthdays
                    .map((d: string) => parseInt(d, 10))
                    .filter((d: number) => d <= cutoffDay)
                    .sort((a: any, b: any) => a - b);
                if (reminderDays.length === 0) return;
                const today = now.getDate();
                let nextDay = reminderDays.find((d: any) => d >= today);
                if (!nextDay) {
                    startTimeLocal.setMonth(startTimeLocal.getMonth() + 1);
                    startTimeLocal.setDate(reminderDays[0]);
                } else {
                    startTimeLocal.setDate(nextDay);
                }
                startTimeLocal.setHours(startTime.getHours());
                startTimeLocal.setMinutes(startTime.getMinutes());
                startTimeLocal.setSeconds(startTime.getSeconds());
                reminder.start = startTimeLocal.toISOString();
                timeDiff = startTimeLocal.getTime() - now.getTime();
            } else if (reminder.repeat === "weekly" && reminder.days?.length) {
                const daysMap: Record<string, number> = {
                    sunday: 0,
                    monday: 1,
                    tuesday: 2,
                    wednesday: 3,
                    thursday: 4,
                    friday: 5,
                    saturday: 6,
                };
                const today = now.getDay();
                const reminderDays = reminder.days.map(
                    (d: string) => daysMap[d.toLowerCase()]
                );
                if (!reminderDays.includes(today)) {
                    return;
                }
                if (timeDiff < 0) {
                    let nextDayOffset = Infinity;
                    for (let d of reminderDays) {
                        let diff = (d - today + 7) % 7;
                        if (diff > 0 && diff < nextDayOffset) {
                            nextDayOffset = diff;
                        }
                    }
                    if (nextDayOffset === Infinity) {
                        nextDayOffset = 7;
                    }
                    startTimeLocal.setDate(startTimeLocal.getDate() + nextDayOffset);
                    reminder.start = startTimeLocal.toISOString();
                    timeDiff = startTimeLocal.getTime() - now.getTime();
                }
            }
        }
        if (timeDiff >= 0 && timeDiff < 1000) {
            if (Notification.permission === "granted") {
                const notification = new Notification("Reminder Alert", {
                    body: reminder.title,
                    icon: "/bell.png",
                });
                notification.onclick = () => {
                    if (window.focus) window.focus();
                    window.location.href = `/reminder/detail/${reminder._id}`;
                };
            }
            reminder.triggered = true;
            if (reminder.repeat === "daily") {
                const nextDay = new Date(startTimeLocal);
                nextDay.setDate(nextDay.getDate() + 1);
                reminder.start = nextDay.toISOString();
                reminder.triggered = false;
                console.log("➡️ Scheduled next daily reminder:", reminder.start);
            } else if (reminder.repeat === "monthly" && reminder.monthdays?.length) {
                const reminderDays = reminder.monthdays.map((d: string) =>
                    parseInt(d, 10)
                );
                reminderDays.sort((a: any, b: any) => a - b);
                const currentDay = startTimeLocal.getDate();
                let nextDay: number | null = null;
                for (let d of reminderDays) {
                    if (d > currentDay) {
                        nextDay = d;
                        break;
                    }
                }
                if (nextDay !== null) {
                    startTimeLocal.setDate(nextDay);
                } else {
                    const nextMonth = new Date(startTimeLocal);
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    nextMonth.setDate(reminderDays[0]);
                    startTimeLocal.setTime(nextMonth.getTime());
                }
                reminder.start = startTimeLocal.toISOString();
                reminder.triggered = false;
                console.log("➡️ Scheduled next monthly reminder:", reminder.start);
            } else if (reminder.repeat === "weekly" && reminder.days?.length) {
                const daysMap: Record<string, number> = {
                    sunday: 0,
                    monday: 1,
                    tuesday: 2,
                    wednesday: 3,
                    thursday: 4,
                    friday: 5,
                    saturday: 6,
                };
                const today = now.getDay();
                const reminderDays = reminder.days.map(
                    (d: string) => daysMap[d.toLowerCase()]
                );
                let nextDayOffset = Infinity;
                for (let d of reminderDays) {
                    let diff = (d - today + 7) % 7;
                    if (diff > 0 && diff < nextDayOffset) {
                        nextDayOffset = diff;
                    }
                }
                if (nextDayOffset === Infinity) {
                    nextDayOffset = 7;
                }
                const nextWeek = new Date(startTimeLocal);
                nextWeek.setDate(nextWeek.getDate() + nextDayOffset);
                reminder.start = nextWeek.toISOString();
                reminder.triggered = false;
                console.log("➡️ Scheduled next weekly reminder:", reminder.start);
            }
        }
    });
}
