export interface IFaq extends Document {
  title: string;
  content: string;
  sort_order: string;
  category: FaqCategory;
  videoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum FaqCategory {
  TERMS = 'terms',
  PAYMENT = 'payment',
  CONTACT = 'contact',
  HELP = 'help',
  SUPPORT = 'support',
}