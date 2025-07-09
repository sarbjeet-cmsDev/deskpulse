import { NotFoundException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
export const getUserDetailsById = async (userService: UserService, userId: string) => {
    const user = await userService.findOne(userId);
    if (!user) throw new NotFoundException(`User with ID "${userId}" was not found.`);
    return { id: user._id, username: user.username, email: user.email };
};

