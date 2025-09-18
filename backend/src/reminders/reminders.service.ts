import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Reminder, ReminderDocument } from "./reminders.schema";
import { CreateReminderDto, UpdateReminderDto } from "./reminders.dto";


@Injectable()
export class RemindersService {
  constructor(
    @InjectModel(Reminder.name)
    private readonly reminderModel: Model<ReminderDocument>
  ) { }

  async create(
    createReminderDto: CreateReminderDto
  ): Promise<ReminderDocument> {
    const createdReminder = new this.reminderModel(createReminderDto);
    const savedReminder = await createdReminder.save();
    return savedReminder;
  }

  async findAll(
    page: number,
    limit: number,
    filter?: Partial<Reminder>
  ): Promise<{
    data: ReminderDocument[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    const query = filter
      ? this.reminderModel.find(filter)
      : this.reminderModel.find();

    const [data, total] = await Promise.all([
      query.sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.reminderModel.countDocuments(filter || {}),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }


  async findReminderByUser(
    id: string,
    page = 1,
    limit = 5,
    options?: { sort?: Record<string, 1 | -1> }
  ): Promise<{ reminders: Reminder[]; total: number }> {
    const skip = (page - 1) * limit;

    const remindersQuery = this.reminderModel.find({
      user: new Types.ObjectId(id),
    });

    if (options?.sort) {
      remindersQuery.sort(options.sort);
    }

    const [reminders, total] = await Promise.all([
      remindersQuery.skip(skip).limit(limit).exec(),
      this.reminderModel.countDocuments({ user: new Types.ObjectId(id) }),
    ]);

    return {
      reminders,
      total,
    };
  }

  async findOne(id: string): Promise<Reminder> {
    return await this.reminderModel.findById(id).lean<Reminder>().exec();
  }

  async findActiveReminder(
    id: string,
    page = 1,
    limit = 5,
    options?: { sort?: Record<string, 1 | -1> }
  ): Promise<{ reminders: Reminder[]; total: number }> {
    const skip = (page - 1) * limit;

    const remindersQuery = this.reminderModel.find({
      user: new Types.ObjectId(id),
    });


    if (options?.sort) {
      remindersQuery.sort(options.sort);
    }

    const [reminders, total] = await Promise.all([
      remindersQuery.skip(skip).limit(limit).exec(),
      this.reminderModel.countDocuments({ user: new Types.ObjectId(id) }),
    ]);

    const filteredReminders = reminders.filter((reminder) => {
      const currentTime = new Date();
      const startTime = new Date(reminder.start);
      const alertBeforeTime = new Date(startTime.getTime() - reminder.alert_before * 60000);
      return currentTime >= alertBeforeTime && currentTime <= startTime;
    });

    return {
      reminders: filteredReminders,
      total,
    };
  }

  async update(
    id: string,
    updateReminderDto: UpdateReminderDto
  ): Promise<ReminderDocument | null> {
    const updatedReminder = await this.reminderModel
      .findByIdAndUpdate(id, updateReminderDto, { new: true })
      .exec();
    return updatedReminder;
  }
}
