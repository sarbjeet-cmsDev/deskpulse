import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Put,
  Query,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
import { SearchService } from "./search.service";
import { CurrentUser } from "src/shared/current-user.decorator";

@Controller("api/search")
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('')
  async searchData(@Query('q') query: string, @CurrentUser() user: any) {
   return this.searchService.searchAll(query,user.userId.toString());
  }
  
}
