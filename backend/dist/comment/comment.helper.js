"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTaskId = validateTaskId;
const common_1 = require("@nestjs/common");
async function validateTaskId(taskService, taskId) {
    const task = await taskService.findOne(taskId.toString());
    if (!task) {
        throw new common_1.NotFoundException(`Task with ID ${taskId} not found.`);
    }
    return task;
}
//# sourceMappingURL=comment.helper.js.map