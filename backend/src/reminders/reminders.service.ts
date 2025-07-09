import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reminder, ReminderDocument } from './reminders.schema';
import { CreateReminderDto ,UpdateReminderDto} from './reminders.dto';

@Injectable()
export class RemindersService {
  constructor(
    @InjectModel(Reminder.name)
    private readonly reminderModel: Model<ReminderDocument>,
  ) {}

  async create(createReminderDto: CreateReminderDto): Promise<ReminderDocument> {
    const createdReminder = new this.reminderModel(createReminderDto);
    const savedReminder = await createdReminder.save();
    return savedReminder;
  }

async findAll(filter?: Partial<Reminder>): Promise<ReminderDocument[]> {
  if (filter) {
    return this.reminderModel.find(filter).sort({ createdAt: -1 }).exec();
  }
  return this.reminderModel.find().exec();
}

async findOne(id: string): Promise<ReminderDocument | null> {
    return this.reminderModel.findById(id).exec();
}
async update(id: string, updateReminderDto: UpdateReminderDto): Promise<ReminderDocument | null> {
    const updatedReminder = await this.reminderModel.findByIdAndUpdate(id, updateReminderDto, { new: true }).exec();
        return updatedReminder;
    }

  // other service methods...
}
