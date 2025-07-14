import { Button } from "@heroui/button";
import { H5 } from "../Heading/H5";
import leftarrow from "@/assets/images/back.png";
import Image from "next/image";
import { closeDrawer } from "@/store/slices/drawerSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import NotficationService from "@/service/notification.service";
import { RootState } from "@/store/store";
import { Avatar } from "@heroui/react";
import userAvtar from "@/assets/images/avt1.jpg";
import { useRouter } from "next/navigation";
import Pagination from "../Pagination/pagination";

export const Notification = () => {
  const dispatch = useDispatch();
  const [notification, setNotification] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const user: any | null = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  const fetchNotification = async () => {
    try {
      const res: any = await NotficationService.getNotificationByUserId(
        user?.id
      );
      setNotification(res?.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const updateStatus = async (notificationID: string) => {
    try {
      await NotficationService.updateNotificationStatus(notificationID || "");
      setNotification((prevNotifications: any) =>
        prevNotifications.map((item: any) =>
          item._id === notificationID ? { ...item, is_read: true } : item
        )
      );
      fetchNotification();
    } catch (error) {
      console.error("Error updating notification status", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = notification.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex justify-between items-center">
      <div className="w-full">
        <div className="flex justify-center items-center p-[24px] border-b border-[#31394f14]">
          <div className="w-[2%]">
            <Button
              className="bg-transparent justify-start p-0 gap-0"
              onPress={() => dispatch(closeDrawer())}
            >
              <Image src={leftarrow} alt="Back" width={16} height={16} />
            </Button>
          </div>
          <H5 className="w-[98%] text-center">Notification</H5>
        </div>
        {currentItems.length > 0 ? (
          currentItems.map((item: any, index) => {
            const bgColor = item.is_read ? "bg-white" : "bg-gray-200";

            return (
              <div
                key={index}
                className={`flex items-start gap-4 p-4 mt-6 rounded-xl shadow-sm border transition-all ${bgColor}`}
              >
                <Avatar
                  src={userAvtar?.src}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                  // onClick={() => router.push(item?.redirect_url)}
                />

                <div
                  className="flex-1 text-sm text-gray-700"
                  // onClick={() => router.push(item?.redirect_url)}
                >
                  <p className="mb-1">
                    <span className="font-medium text-indigo-600 cursor-pointer">
                      {item?.content}
                    </span>
                  </p>

                  <div className="flex items-center text-xs text-gray-400">
                    <span>{formatDate(item?.createdAt)}</span>
                  </div>
                </div>

                {!item?.is_read && (
                  <Button
                    className="text-xs text-blue-600 border-none px-2 py-1 rounded hover:bg-blue-50"
                    onPress={() => updateStatus(item?._id)}
                    variant="bordered"
                  >
                    Mark as read
                  </Button>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center mt-10 h-full flex justify-center items-center text-gray-400 text-sm">
            No notifications found.
          </div>
        )}
        {notification.length > itemsPerPage && (
          <div className="flex justify-center mt-6">
            <Pagination
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              totalItems={notification.length}
              onPageChange={(page: number) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
