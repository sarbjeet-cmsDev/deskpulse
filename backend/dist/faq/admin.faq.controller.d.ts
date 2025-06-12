import { FaqService } from './faq.service';
import { IFaq } from './faq.interface';
export declare class AdminFaqController {
    private readonly faqService;
    constructor(faqService: FaqService);
    getAllFaqs(page?: number, limit?: number, keyword?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        data: IFaq[];
        total: number;
    }>;
    getFaq(id: string): Promise<IFaq>;
    createFaq(faqData: Partial<IFaq>): Promise<IFaq>;
    updateFaq(id: string, faqData: Partial<IFaq>): Promise<IFaq>;
    deleteFaq(id: string): Promise<void>;
}
