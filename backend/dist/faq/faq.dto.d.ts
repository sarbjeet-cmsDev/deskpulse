export declare class FaqDto {
    title: string;
    content: string;
    sort_order: string;
    category: 'terms' | 'payment' | 'contact' | 'help' | 'support';
    videoUrl?: string;
}
