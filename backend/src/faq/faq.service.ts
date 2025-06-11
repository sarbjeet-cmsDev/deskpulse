import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFaq } from './faq.interface';

@Injectable()
export class FaqService {
	constructor(
		@InjectModel('Faq') private readonly faqModel:Model<IFaq> ,
) {}

	async all(
		page: number = 1,
		limit: number = 10,
		keyword?: string,
		sortOrder: 'asc' | 'desc' = 'asc'
	): Promise<{ data: IFaq[]; total: number }> {
		const skip = (page - 1) * limit;
		
		// Build query
		let query = {};
		if (keyword) {
			query = {
				$or: [
					{ title: { $regex: keyword, $options: 'i' } },
					{ content: { $regex: keyword, $options: 'i' } },
					{ category: { $regex: keyword, $options: 'i' } }
				]
			};
		}

		// Get total count for pagination
		const total = await this.faqModel.countDocuments(query);

		// Execute query with pagination and sorting
		const data = await this.faqModel
			.find(query)
			.sort({ sort_order: sortOrder === 'asc' ? 1 : -1 })
			.skip(skip)
			.limit(limit)
			.exec();

		return {
			data,
			total
		};
	}

	async create(faqData: Partial<IFaq>): Promise<IFaq> {
		// Check if sort_order already exists
		const existingFaq = await this.faqModel.findOne({ sort_order: faqData.sort_order });
		if (existingFaq) {
			throw new ConflictException('Sort order already exists');
		}

		const createdFaq = new this.faqModel(faqData);
		return await createdFaq.save();
	}

	async update(id: string, faqData: Partial<IFaq>): Promise<IFaq> {
		// Check if sort_order already exists on a different document
		if (faqData.sort_order) {
			const existingFaq = await this.faqModel.findOne({
				sort_order: faqData.sort_order,
				_id: { $ne: id }
			});
			if (existingFaq) {
				throw new ConflictException('Sort order already exists');
			}
		}

		const updatedFaq = await this.faqModel
			.findByIdAndUpdate(id, faqData, { new: true })
			.exec();

		if (!updatedFaq) {
			throw new NotFoundException('FAQ not found');
		}

		return updatedFaq;
	}

	async delete(id: string): Promise<void> {
		const result = await this.faqModel.findByIdAndDelete(id).exec();
		if (!result) {
			throw new NotFoundException('FAQ not found');
		}
	}

	async findById(id: string): Promise<IFaq> {
		const faq = await this.faqModel.findById(id).exec();
		if (!faq) {
			throw new NotFoundException('FAQ not found');
		}
		return faq;
	}

}

