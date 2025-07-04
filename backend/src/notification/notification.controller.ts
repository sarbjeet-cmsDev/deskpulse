import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';


@Controller('notifications')

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.notificationService.findByUser(userId);
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.update(id, { is_read: true });
  }
}
