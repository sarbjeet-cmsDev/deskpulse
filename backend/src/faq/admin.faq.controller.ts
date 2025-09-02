import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { IFaq } from './faq.interface';
import { AdminGuard } from 'src/guard/admin.guard';

@Controller('api/admin/faq')
@UseGuards(AdminGuard)
export class AdminFaqController {
  constructor(private readonly faqService: FaqService) { }

  @Get()
  async getAllFaqs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('keyword') keyword?: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<{ data: IFaq[]; total: number }> {
    return await this.faqService.all(page, limit, keyword, sortOrder);
  }

  @Get(':id')
  async getFaq(@Param('id') id: string): Promise<IFaq> {
    const faq = await this.faqService.findById(id);
    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }
    return faq;
  }

  @Post()
  async createFaq(@Body() faqData: Partial<IFaq>): Promise<IFaq> {
    try {
      return await this.faqService.create(faqData);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  async updateFaq(
    @Param('id') id: string,
    @Body() faqData: Partial<IFaq>
  ): Promise<IFaq> {
    const faq = await this.faqService.findById(id);
    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }

    try {
      return await this.faqService.update(id, faqData);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  async deleteFaq(@Param('id') id: string): Promise<void> {
    const faq = await this.faqService.findById(id);
    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }

    await this.faqService.delete(id);
  }
}
