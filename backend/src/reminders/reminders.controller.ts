import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Put,
  Query,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { Reminder } from "./reminders.interface";
import { CreateReminderDto, UpdateReminderDto } from "./reminders.dto";
import { RemindersService } from "./reminders.service";
import { log } from "node:console";
import { ReminderDocument } from "./reminders.schema";

@Controller("api/reminders")
@UseGuards(JwtAuthGuard)
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post()
  async create(
    @Body() createReminderDto: CreateReminderDto,
    @Req() req: Request
  ): Promise<{ message: string; reminder: Reminder }> {

    const userId = (req as any).user.userId;
    if (!userId) {
      return { message: "User not authenticated", reminder: null };
    }
    const reminderData = { ...createReminderDto, user: userId };
    const reminder = await this.remindersService.create(reminderData);
    return { message: "Reminder created successfully", reminder };
  }

  @Get()
  async findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "5"
  ): Promise<{
    message: string;
    reminders: Reminder[];
    total: number;
    page: number;
    limit: number;
  }> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const result = await this.remindersService.findAll(
      pageNumber,
      limitNumber,
      {
        status: "pending",
      }
    );

    return {
      message: "Reminders fetched successfully",
      reminders: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

    @Get(':id')
    async findOne(@Param("id") id: string): Promise<any> {
    return await this.remindersService.findOne(id);
    
    }

  @Get("user/:id")
  async findReminderByUserId(
    @Param("id") id: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "5",
    @Query("sort") sort: string = "createdAt:desc" // default sorting
  ): Promise<{
    message: string;
    reminders: any;
    total: number;
    page: number;
    limit: number;
  }> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const [sortField, sortOrder] = sort.split(":");

    const { reminders, total } = await this.remindersService.findReminderByUser(
      id,
      pageNumber,
      limitNumber,
      {
        sort: { [sortField]: sortOrder === "desc" ? -1 : 1 },
      }
    );

    return {
      message: "Reminders fetched successfully",
      reminders,
      total,
      page: pageNumber,
      limit: limitNumber,
    };
  }

  @Get("active/:id")
  async findActiveReminder(
    @Param("id") id: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "5",
    @Query("sort") sort: string = "createdAt:desc" 
  ): Promise<{
    // message: string;
    reminders: any;
    total: number;
    page: number;
    limit: number;
  }> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const [sortField, sortOrder] = sort.split(":");

    const { reminders, total } = await this.remindersService.findActiveReminder(
      id,
      pageNumber,
      limitNumber,
      {
        sort: { [sortField]: sortOrder === "desc" ? -1 : 1 },
      }
    );

    return {
      // message: "Reminders fetched successfully",
      reminders,
      total,
      page: pageNumber,
      limit: limitNumber,
    };
  }


  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateReminderDto: UpdateReminderDto
  ): Promise<{ message: string; reminder: Reminder | null }> {
    const reminder = await this.remindersService.findOne(id);
    if (!reminder) {
      return { message: "Reminder not found", reminder: null };
    }
    const updatedReminder = await this.remindersService.update(
      id,
      updateReminderDto
    );
    return {
      message: "Reminder updated successfully",
      reminder: updatedReminder,
    };
  }
}
