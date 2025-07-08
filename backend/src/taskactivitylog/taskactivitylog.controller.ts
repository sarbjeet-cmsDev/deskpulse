import { Body, Controller, Post, UseGuards,  Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { TaskactivitylogService } from './taskactivitylog.service';
import { Taskactivitylog } from './taskactivitylog.schema';
@Controller('api/taskactivitylog')
export class TaskactivitylogController {
      constructor(private readonly taskactivitylogservice: TaskactivitylogService) {}
        @Get()
        async findAll(): Promise<{ message: string; taskactivitylog: Taskactivitylog[] }> {
            const taskactivitylog = await this.taskactivitylogservice.findAll();
            return {
            message: 'taskactivitylog fetched successfully',
            taskactivitylog,
            };
        }
                

}
