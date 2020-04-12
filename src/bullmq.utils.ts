import { BullMQModuleOptions, BullMQ } from "./bullmq.interfaces";
import { Queue, Worker, QueueEvents, QueueScheduler, Job } from 'bullmq';
import {
  BULLMQ_MODULE_CONNECTION,
  BULLMQ_MODULE_CONNECTION_TOKEN,
  BULLMQ_MODULE_OPTIONS_TOKEN
} from './bullmq.constants';

export { Queue, Worker, QueueEvents, QueueScheduler }
export * as bullmq from 'bullmq';

export function getBullMQOptionsToken(options: Partial<BullMQModuleOptions>, connection: string): string {
  const queueName = options?.name || connection || BULLMQ_MODULE_CONNECTION;
  return `${ queueName }_${ connection || queueName }_${ BULLMQ_MODULE_OPTIONS_TOKEN }`;
}

export function getBullMQConnectionToken(options: Partial<BullMQModuleOptions>, connection: string): string {
  const queueName = options?.name || connection || BULLMQ_MODULE_CONNECTION;
  return `${ queueName }_${ connection || queueName }_${ BULLMQ_MODULE_CONNECTION_TOKEN }`;
}

export function createBullMQConnection(options: BullMQModuleOptions, connection: string): BullMQ {
  const { config, name } = options;
  const queueName = name || connection || BULLMQ_MODULE_CONNECTION;

  if(config?.url) {
    const url = new URL(config.url);
    config.connection = {
      host: url.hostname,
      port: +url.port,
      password: url.password,
    }
  }

  return {
    process: (callback: (job: Job) => any): Worker => {
      return new Worker(queueName, callback, config);
    },
    queue: new Queue(queueName, config),
    queueEvents: new QueueEvents(queueName, config),
    queueScheduler: new QueueScheduler(queueName, config),
  };
}
