import { FaqService } from './faq.service';
import { IFaq } from './faq.interface';
export declare class FaqController {
    private readonly faqService;
    constructor(faqService: FaqService);
    getAll(): Promise<{
        data: IFaq[];
        total: number;
    }>;
}
