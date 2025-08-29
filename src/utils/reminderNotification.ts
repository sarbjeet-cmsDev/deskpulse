export function checkReminders(remindersRef: React.MutableRefObject<any[]>) {
    const now = new Date();

    remindersRef.current.forEach((reminder) => {
        let startTime = new Date(reminder.start);
        const endTime = reminder.end ? new Date(reminder.end) : null;

        // Skip expired reminders
        if (endTime && now > endTime) return;

        // Skip already triggered reminders
        if (reminder.triggered) return;

        const startTimeLocal = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            startTime.getHours(),
            startTime.getMinutes(),
            startTime.getSeconds()
        );

        let timeDiff = startTimeLocal.getTime() - now.getTime();

        // Handle repeats
        if (reminder.repeat) {
            if (reminder.repeat === "daily" && timeDiff < 0) {
                startTimeLocal.setDate(startTimeLocal.getDate() + 1);
                reminder.start = startTimeLocal.toISOString();
                timeDiff = startTimeLocal.getTime() - now.getTime();
            } else if (reminder.repeat === "monthly" && timeDiff < 0) {
                startTimeLocal.setMonth(startTimeLocal.getMonth() + 1);
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

                // 🔹 Only trigger on selected weekdays
                if (!reminderDays.includes(today)) {
                    return; // skip today
                }

                // If the time already passed today → find the next valid day
                if (timeDiff < 0) {
                    let nextDayOffset = Infinity;
                    for (let d of reminderDays) {
                        let diff = (d - today + 7) % 7;
                        if (diff > 0 && diff < nextDayOffset) {
                            nextDayOffset = diff;
                        }
                    }
                    if (nextDayOffset === Infinity) {
                        nextDayOffset = 7; // fallback: same day next week
                    }
                    startTimeLocal.setDate(startTimeLocal.getDate() + nextDayOffset);
                    reminder.start = startTimeLocal.toISOString();
                    timeDiff = startTimeLocal.getTime() - now.getTime();
                }
            }
        }

        // Trigger notification
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

            // Reschedule
            if (reminder.repeat === "daily") {
                const nextDay = new Date(startTimeLocal);
                nextDay.setDate(nextDay.getDate() + 1);
                reminder.start = nextDay.toISOString();
                reminder.triggered = false;
                console.log("➡️ Scheduled next daily reminder:", reminder.start);
            } else if (reminder.repeat === "monthly") {
                const nextMonth = new Date(startTimeLocal);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                reminder.start = nextMonth.toISOString();
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
                    nextDayOffset = 7; // fallback same day next week
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
