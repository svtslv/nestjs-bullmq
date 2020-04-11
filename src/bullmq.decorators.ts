import { Inject } from '@nestjs/common';
import { getBullMQConnectionToken } from './bullmq.utils';

export const InjectBullMQ = (connection?: string) => {
  return Inject(getBullMQConnectionToken(connection));
};
