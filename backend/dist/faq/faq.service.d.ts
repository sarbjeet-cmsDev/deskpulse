import { Model } from 'mongoose';
import { IFaq } from './faq.interface';
export declare class FaqService {
    private readonly faqModel;
    constructor(faqModel: Model<IFaq>);
    all(page?: number, limit?: number, keyword?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        data: IFaq[];
        total: number;
    }>;
    create(faqData: Partial<IFaq>): Promise<IFaq>;
    update(id: string, faqData: Partial<IFaq>): Promise<IFaq>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<IFaq>;
}
