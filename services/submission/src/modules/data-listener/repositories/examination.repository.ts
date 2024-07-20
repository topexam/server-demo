import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';

import { CreateExaminationDTO, UpdateExaminationDTO } from '../dto';
import {
  ExaminationModel,
  IExaminationDocument,
  ILeanExaminationDocument,
} from '../schemas';

export class ExaminationRepository {
  constructor(
    @InjectModel(ExaminationModel.name)
    private readonly examinationModel: SoftDeleteModel<IExaminationDocument>,
  ) {}

  async createExamination(
    createExaminationDTO: CreateExaminationDTO,
  ): Promise<string> {
    const examinationCreated = await new this.examinationModel({
      ...createExaminationDTO,
      _id: createExaminationDTO.id,
    }).save();

    return examinationCreated.id;
  }

  async updateExamination(
    updateExaminationDTO: UpdateExaminationDTO,
  ): Promise<string> {
    const examinationUpdated = await this.examinationModel.findById(
      updateExaminationDTO.id,
    );
    examinationUpdated.set(updateExaminationDTO);
    await examinationUpdated.save();

    return examinationUpdated.id;
  }

  async getExaminationItem(
    examinationId: string,
  ): Promise<ILeanExaminationDocument> {
    return this.examinationModel.findById(examinationId);
  }
}
