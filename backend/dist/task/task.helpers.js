"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProjectId = validateProjectId;
const common_1 = require("@nestjs/common");
async function validateProjectId(projectService, projectId) {
    const project = await projectService.findOne(projectId.toString());
    if (!project) {
        throw new common_1.NotFoundException(`Project with ID ${projectId} not found.`);
    }
    return project;
}
//# sourceMappingURL=task.helpers.js.map