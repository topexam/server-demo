import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { SortOrder, Types } from 'mongoose';
import { IApiQueryParams } from '@topexam/api.lib.common';

import { CreateTagDTO } from '../dto';
import { TagEntity } from '../entities';
import { TagModel, ITagDocument, ILeanTagDocument } from '../schemas';

export class TagRepository {
  constructor(
    @InjectModel(TagModel.name)
    private readonly tagModel: SoftDeleteModel<ITagDocument>,
  ) {}

  async getTagList(aqp: IApiQueryParams): Promise<ILeanTagDocument[]> {
    return this.tagModel
      .find({
        ...aqp.filter,
        _id: {
          $gte: aqp.pagination.page_token
            ? Types.ObjectId.createFromHexString(aqp.pagination.page_token)
            : null,
        },
      })
      .sort(aqp.sort as Record<string, SortOrder>)
      .limit(aqp.pagination.page_size)
      .lean();
  }

  async getTagItem(tagId: string): Promise<ILeanTagDocument> {
    return this.tagModel.findById(tagId).lean();
  }

  async createTag(createTagDTO: CreateTagDTO): Promise<TagEntity> {
    const tagCreated = new this.tagModel(createTagDTO);
    await tagCreated.save();
    return new TagEntity(tagCreated.id);
  }
}
