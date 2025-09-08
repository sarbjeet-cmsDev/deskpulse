import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
    Query,
    Get,
    Param,
    Put,
    Delete,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { WorkSpaceService } from "./workSpace.service";
import { AcceptInviteDto, CreateWorkSpaceDto, InviteMemberDto, UpdateWorkSpaceDto } from "./workSpace.dto";
import { WorkSpace } from "./workSpace.interface";

@Controller("api/workspace")
@UseGuards(JwtAuthGuard)

export class WorkSpaceController {
    constructor(private readonly workSpaceService: WorkSpaceService) { }

    @Post()
    async create(
        @Body() createWorkSpaceDto: CreateWorkSpaceDto,
        @Req() req: Request
    ): Promise<{ message: string; workSpace: WorkSpace }> {

        const userId = (req as any).user.userId;
        if (!userId) {
            return { message: "User not authenticated", workSpace: null };
        }
        const workSpaceData = { ...createWorkSpaceDto, user: userId };
        const workSpace = await this.workSpaceService.create(workSpaceData);
        return { message: "WorkSpace created successfully", workSpace };
    }

    @Get()

    async findAll(
        @Query("page") page: string = "1",
        @Query("limit") limit: string = "5"
    ): Promise<{
        workSpaces: WorkSpace[];
        total: number;
        page: number;
        limit: number;
    }> {
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        const result = await this.workSpaceService.findAll(
            pageNumber,
            limitNumber
        );
        return {
            workSpaces: result.data,
            total: result.total,
            page: result.page,
            limit: result.limit,
        };
    }

    @Get(':id')
    async findOne(@Param("id") id: string): Promise<any> {
        return await this.workSpaceService.findOne(id);

    }


    @Get("user/:id")

    async findWorkSpaceByUserId(
        @Param("id") id: string,
        @Query("page") page: string = "1",
    ): Promise<{
        workspaces: any;
        total: number;
        page?: number;
    }> {
        const pageNumber = parseInt(page, 10);


        const { workspaces, total } = await this.workSpaceService.findWorkSpaceByUser(
            id,
            pageNumber,
        );

        return {
            workspaces,
            total,
            page: pageNumber,
        };
    }


    @Put(":id")

    async update(
        @Param("id") id: string,
        @Body() updateWorkSpaceDto: UpdateWorkSpaceDto
    ): Promise<{ message: string; workSpace: WorkSpace | null }> {
        const workSpace = await this.workSpaceService.findOne(id);
        if (!workSpace) {
            return { message: "WorkSpace not found", workSpace: null };
        }
        const updatedWorkSpace = await this.workSpaceService.update(
            id,
            updateWorkSpaceDto
        );
        return {
            message: "WorkSpace updated successfully",
            workSpace: updatedWorkSpace,
        };
    }

    @Delete(":id")

    async remove(@Param("id") id: string): Promise<any> {
        await this.workSpaceService.remove(id);
        return {
            message: "WorkSpace deleted successfully!",
        };
    }


    @Post('invite-member/:id')

    async inviteMember(
        @Param("id") id: string,
        @Body() dto: InviteMemberDto
    ): Promise<any> {
        await this.workSpaceService.invite(id, dto);

        return {
            message: `Invitation sent successfully to given email`,
        };
    }

    @Post("accept-invite/:id")
    async acceptInvite(
        @Param("id") workspaceId: string,
        @Body() dto: AcceptInviteDto
    ): Promise<any> {
        await this.workSpaceService.acceptInvite(workspaceId, dto);

        return {
            statusCode: 200,
            message: `User with email ${dto.email} has been added to workspace ${workspaceId}`,
        };
    }

}
