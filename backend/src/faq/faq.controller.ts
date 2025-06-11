import { Controller, Post, Body, Param, Res, HttpStatus, Put, Get } from '@nestjs/common';
import { FaqService } from './faq.service';
import { IFaq } from './faq.interface';



@Controller('api/faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  async getAll(): Promise<{ data: IFaq[]; total: number }> {
    return await this.faqService.all();
  }
}

