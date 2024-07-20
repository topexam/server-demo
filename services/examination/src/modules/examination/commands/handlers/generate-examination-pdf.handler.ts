import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { generatePDFFromJson, EPDFMode } from '@topthithu/pdf-manager';

import { ExaminationRepository } from '../../repositories';
import { GenerateExaminationPDFCommand } from '../impl';

@CommandHandler(GenerateExaminationPDFCommand)
export class GenerateExaminationPDFHandler
  implements ICommandHandler<GenerateExaminationPDFCommand>
{
  constructor(private readonly repository: ExaminationRepository) {}

  async execute(command: GenerateExaminationPDFCommand): Promise<Buffer> {
    Logger.log(
      'Async GenerateExaminationPDFHandler...',
      'GenerateExaminationPDFCommand',
    );
    const { examinationId } = command;
    const examination = await this.repository.getExaminationItem(examinationId);

    const pdfBuffer = generatePDFFromJson({
      data: examination,
      mode: EPDFMode.EXAMINATION,
    });

    return pdfBuffer;
  }
}
