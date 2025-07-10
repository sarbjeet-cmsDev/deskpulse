import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Performance, PerformanceDocument } from './performance.schema';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<PerformanceDocument>,

  ) {}

}
