import { ILeanDocumentWithMissingFields } from '@topexam/api.lib.common';

export type ILeanChallengeDocumentWithMissingFields =
  ILeanDocumentWithMissingFields & {
    time_opening: string;
    time_limit?: string | null;
  };
