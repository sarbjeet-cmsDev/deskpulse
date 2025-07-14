import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Reminder, ReminderDocument } from "./reminders.schema";
import { CreateReminderDto, UpdateReminderDto } from "./reminders.dto";
import { Reminder as ReminderInterface } from "./reminders.interface";

import { log } from "console";

@Injectable()
export class RemindersService {
  constructor(
    @InjectModel(Reminder.name)
    private readonly reminderModel: Model<ReminderDocument>
  ) {}

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

  async findOne(id: string): Promise<ReminderDocument | null> {
    return this.reminderModel.findById(id).exec();
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

  // // other service methods...

  // async findByUser(
  //   userId: string,
  //   page: number,
  //   limit: number
  // ): Promise<{
  //   data: ReminderInterface[];
  //   total: number;
  //   page: number;
  //   limit: number;
  // }> {
  //   const skip = (page - 1) * limit;

  //   const [data, total] = await Promise.all([
  //     this.reminderModel
  //       .find({ user: userId })
  //       .skip(skip)
  //       .limit(limit)
  //       .sort({ createdAt: -1 })
  //       .lean() // returns plain JS objects
  //       .exec()
  //       .then((res) => res as ReminderInterface[]), // Cast here to match the interface
  //     this.reminderModel.countDocuments({ user: userId }),
  //   ]);

  //   return {
  //     data,
  //     total,
  //     page,
  //     limit,
  //   };
  // }
}
