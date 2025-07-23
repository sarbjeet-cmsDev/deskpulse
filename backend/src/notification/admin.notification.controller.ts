import {
  Controller,
  Get,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { INotification } from "./notification.interface";


@Controller("api/admin/notification")
export class AdminNotificationController {
  constructor(private readonly notificationService: NotificationService) {}


  @Get()
  async findAll(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("keyword") keyword?: string,
    @Query("sortOrder") sortOrder: "asc" | "desc" = "asc"
  ): Promise<{ data: INotification[]; total: number }> {
    return this.notificationService.findAll(
      page,
      limit,
      keyword,
      sortOrder
    );
  }


 
  @Delete(":id")
  async remove(@Param("id") id: string): Promise<any> {
    await this.notificationService.remove(id);
    return {
      message: "Notification deleted successfully!",
    };
  }
}
