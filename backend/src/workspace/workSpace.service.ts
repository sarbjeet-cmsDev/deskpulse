import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { AcceptInviteDto, CreateWorkSpaceDto, InviteMemberDto, UpdateWorkSpaceDto } from "./workSpace.dto";
import { WorkSpace, WorkSpaceDocument } from "./workSpace.schema";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { User, UserDocument } from "src/user/user.schema";

@Injectable()
export class WorkSpaceService {
    constructor(
        @InjectModel(WorkSpace.name)
        private readonly workSpaceModel: Model<WorkSpaceDocument>,

        @InjectModel(User.name)   // ✅ FIX
        private readonly userModel: Model<UserDocument>,

        private eventEmitter: EventEmitter2,
    ) { }

    async create(
        CreateWorkSpaceDto: CreateWorkSpaceDto
    ): Promise<WorkSpaceDocument> {
        const createdWorkSpace = new this.workSpaceModel(CreateWorkSpaceDto);
        const savedWorkSpace = await createdWorkSpace.save();
        return savedWorkSpace;
    }

    async findAll(
        page: number,
        limit: number,
        filter?: Partial<WorkSpace>
    ): Promise<{
        data: WorkSpaceDocument[];
        total: number;
        page: number;
        limit: number;
    }> {
        const skip = (page - 1) * limit;

        const query = filter
            ? this.workSpaceModel.find(filter)
            : this.workSpaceModel.find();

        const [data, total] = await Promise.all([
            query.sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
            this.workSpaceModel.countDocuments(filter || {}),
        ]);

        return {
            data,
            total,
            page,
            limit,
        };
    }


    async findWorkSpaceByUser(
        id: string,
        page = 1,
        limit = 100,
    ): Promise<{ workspaces: WorkSpace[]; total: number }> {
        const skip = (page - 1) * limit;

        const workspacesQuery = this.workSpaceModel.find({
            user: new Types.ObjectId(id),
        });

        const [workspaces, total] = await Promise.all([
            workspacesQuery.skip(skip).limit(limit).exec(),
            this.workSpaceModel.countDocuments({ user: new Types.ObjectId(id) }),
        ]);

        return {
            workspaces,
            total,
        };
    }

    async findOne(id: string): Promise<WorkSpace> {
        return await this.workSpaceModel.findById(id).lean<WorkSpace>().exec();
    }

    async update(
        id: string,
        updateWorkSpaceDto: UpdateWorkSpaceDto
    ): Promise<WorkSpaceDocument | null> {
        const updatedWorkSpace = await this.workSpaceModel
            .findByIdAndUpdate(id, updateWorkSpaceDto, { new: true })
            .exec();
        return updatedWorkSpace;
    }

    async remove(id: string): Promise<boolean> {
        const workSpace = await this.workSpaceModel.findById(id).exec();
        if (!workSpace) {
            throw new NotFoundException(`WorkSpaxce with ID ${id} not found.`);
        }
        await this.workSpaceModel.findByIdAndDelete(id).exec();
        return true;
    }


    async invite(id: string, dto: InviteMemberDto) {
        this.eventEmitter.emit("workspace.invite", {
            id,
            ...dto,
        });
        return true;
    }


    async acceptInvite(workspaceId: string, dto: AcceptInviteDto) {
        const { email, role } = dto;
        const user: any = await this.findUserByEmail(email);
        const { username, firstName, lastName } = user
        if (!user) throw new NotFoundException("User not found");
        const workspace = await this.findWorkspaceById(workspaceId);
        if (!workspace) throw new NotFoundException("Workspace not found");
        const isMember = await this.checkMembership(workspaceId, user._id);
        if (isMember) throw new BadRequestException("User already in workspace");
        return await this.addMemberToWorkspace(workspaceId, user._id, role, username, firstName, lastName);
    }


    async findUserByEmail(email: string) {
        const user = await this.userModel.findOne({ email });
        if (!user) return null;

        return user;
    }

    async findWorkspaceById(workspaceId: string) {
        return { id: workspaceId, name: "Demo Workspace" };
    }

    async checkMembership(workspaceId: string, userId: string) {
        const workspace = await this.workSpaceModel.findById(workspaceId);

        if (!workspace) {
            throw new NotFoundException(`Workspace with id ${workspaceId} not found`);
        }

        return workspace.members.some(
            (member: any) => member.user.toString() === userId
        );
    }

    async addMemberToWorkspace(
        workspaceId: string,
        userId: any,
        role: string,
        username: string,
        firstName: string,
        lastName: string
    ) {
        const workspace: any = await this.workSpaceModel.findById(workspaceId);

        if (!workspace) {
            throw new NotFoundException(`Workspace with id ${workspaceId} not found`);
        }
        const alreadyMember = workspace.members.some(
            (member: any) => member.user.toString() === userId.toString()
        );


        if (alreadyMember) {
            throw new BadRequestException(`User ${userId} is already a member`);
        }
        workspace.members.push({
            user: userId,
            role: role,
            username: username,
            firstName: firstName,
            lastName: lastName
        });

        await workspace.save();

        return {
            message: `User ${userId} added to workspace ${workspaceId}`,
            workspace,
        };
    }



}
