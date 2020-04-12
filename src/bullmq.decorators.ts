import { Inject } from '@nestjs/common';
import { getBullMQConnectionToken } from './bullmq.utils';

export const InjectBullMQ = (queueName?: string, connection?: string) => {
  return Inject(getBullMQConnectionToken({ name: queueName }, connection));
};
