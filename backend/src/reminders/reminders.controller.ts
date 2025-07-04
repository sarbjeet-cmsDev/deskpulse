import { Controller, Post, Body, UseGuards, Req, Get, Param, Put } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { Reminder } from './reminders.interface';
import { CreateReminderDto, UpdateReminderDto } from './reminders.dto';
import { RemindersService } from './reminders.service';
import { log } from 'node:console';

@Controller('reminders')
@UseGuards(JwtAuthGuard)
export class RemindersController {
    constructor(private readonly remindersService: RemindersService) { }

    @Post()
    async create(@Body() createReminderDto: CreateReminderDto, @Req() req: Request): Promise<{ message: string; reminder: Reminder }> {
        // Here you can access the user from the request object if needed
        const userId = (req as any).user.userId;
        const reminderData = { ...createReminderDto, user: userId };
        const reminder = await this.remindersService.create(reminderData);
        return { message: 'Reminder created successfully', reminder };
    }
    @Get()
    async findAll(): Promise<{ message: string; reminders: Reminder[] }> {
        // Fetch only reminders with status 'pending'
        const reminders = await this.remindersService.findAll({ status: 'pending' });
        return { message: 'reminders fetched successfully', reminders };
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<{ message: string; reminder: Reminder | null }> {
        const reminder = await this.remindersService.findOne(id);
        if (!reminder) {
            return { message: 'Reminder not found', reminder: null };
        }
        return { message: 'Reminder fetched successfully', reminder };
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateReminderDto: UpdateReminderDto): Promise<{ message: string; reminder: Reminder | null }> {
        const reminder = await this.remindersService.findOne(id);
        if (!reminder) {
            return { message: 'Reminder not found', reminder: null };
        }
        const updatedReminder = await this.remindersService.update(id, updateReminderDto);
        return { message: 'Reminder updated successfully', reminder: updatedReminder };
    }


}
