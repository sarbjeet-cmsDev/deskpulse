import { Injectable, Logger } from '@nestjs/common';
import { PerformanceService } from './performance.service';

@Injectable()
export class PerformanceListener {
  private readonly logger = new Logger(PerformanceListener.name);

  constructor(private readonly performanceService: PerformanceService) { }

}

