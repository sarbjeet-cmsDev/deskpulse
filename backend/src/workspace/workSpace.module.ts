import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkSpaceController } from './workSpace.controller';
import { WorkSpace, WorkSpaceSchema } from './workSpace.schema';
import { WorkSpaceService } from './workSpace.service';
import { User, UserSchema } from 'src/user/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: WorkSpace.name, schema: WorkSpaceSchema },
            { name: User.name, schema: UserSchema }
        ]),
    ],
    controllers: [WorkSpaceController],
    providers: [WorkSpaceService],
    exports: [WorkSpaceService],
})
export class WorkSpaceModule { }
