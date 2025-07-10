import { Controller, Post, Body, UseGuards, Req, Get, Param, Put, NotFoundException } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './notification.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@Controller('api/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}


  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    const notifications = await this.notificationService.findByUser(userId);
    return { notifications };
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.update(id, { is_read: true });
  }
}
