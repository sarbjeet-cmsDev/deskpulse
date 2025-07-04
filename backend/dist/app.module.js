"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const faq_module_1 = require("./faq/faq.module");
const project_module_1 = require("./project/project.module");
const task_module_1 = require("./task/task.module");
const timeline_module_1 = require("./timeline/timeline.module");
const comment_module_1 = require("./comment/comment.module");
const user_module_1 = require("./user/user.module");
const auth_module_1 = require("./auth/auth.module");
const project_kanban_module_1 = require("./project-kanban/project_kanban.module");
const reminders_module_1 = require("./reminders/reminders.module");
const taskchecklist_module_1 = require("./taskchecklist/taskchecklist.module");
const notification_module_1 = require("./notification/notification.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: ['.env'],
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGO_URI'),
                }),
                inject: [config_1.ConfigService],
            }),
            faq_module_1.FaqModule,
            project_module_1.ProjectModule,
            task_module_1.TaskModule,
            timeline_module_1.TimelineModule,
            comment_module_1.CommentModule,
            user_module_1.UserModule,
            project_kanban_module_1.ProjectKanbanModule,
            auth_module_1.AuthModule,
            reminders_module_1.RemindersModule,
            taskchecklist_module_1.TaskChecklistModule,
            notification_module_1.NotificationModule
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map