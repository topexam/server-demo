import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';

import { CreateTagDTO } from '../dto';
import { ILeanTagDocument, ITagDocument, TagModel } from '../schemas';

export class TagRepository {
  constructor(
    @InjectModel(TagModel.name)
    private readonly tagModel: SoftDeleteModel<ITagDocument>,
  ) {}

  async createTag(createTagDTO: CreateTagDTO): Promise<string> {
    const tagCreated = await new this.tagModel({
      name: createTagDTO.name,
      slug: createTagDTO.slug,
      _id: createTagDTO.id,
    }).save();
    return tagCreated.id;
  }

  async getTagItem(tagId: string): Promise<ILeanTagDocument> {
    return this.tagModel.findById(tagId).lean();
  }
}
