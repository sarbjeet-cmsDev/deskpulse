import NotificationService from "@/service/notification.service";
import { RootState } from "@/store/store";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

// interface NotificationData {
//   id: string;
//   title: string;
//   message: string;
//   icon?: string;
// }

export function NotifyNotifications(pollInterval = 10000) {
  const lastNotificationId = useRef<string | null>(null);

  const userData: any = useSelector((state: RootState) => state.auth.user);

 function hasBeenShown(id: string): boolean {
  const shownIds = JSON.parse(localStorage.getItem("shownNotifications") || "[]");
  return shownIds.includes(id);
}

function markAsShown(id: string) {
  const shownIds = JSON.parse(localStorage.getItem("shownNotifications") || "[]");
  if (!shownIds.includes(id)) {
    shownIds.push(id);
    localStorage.setItem("shownNotifications", JSON.stringify(shownIds));
  }
}
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission !== "granted") {
          console.warn("Desktop notifications not granted by user.");   
        }
      });
    }

    const fetchNotifications = async () => {
      try {
        const res = await NotificationService.getNotificationByUserId(
        userData?.id
      ); 

      const notificationData: any = res?.notifications;
       
      if (!notificationData?.notifications.length) return;

      const latest = notificationData?.notifications[0]; 

        if (lastNotificationId.current !== latest._id) {
          lastNotificationId.current = latest._id;
          if(!hasBeenShown(latest._id)){
            if (Notification.permission === "granted") {
              new Notification(('New Notification Recieved'), {
                body: latest.content,
                icon: '/bell.png' ,
              });
              markAsShown(latest._id);
            }

          }
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, pollInterval);

    return () => clearInterval(interval);
  }, [pollInterval]);
}


