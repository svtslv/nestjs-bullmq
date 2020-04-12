import { BullMQModuleOptions, BullMQ } from "./bullmq.interfaces";
import { Queue, Worker, QueueEvents, QueueScheduler, Job } from 'bullmq';
import {
  BULLMQ_MODULE_CONNECTION,
  BULLMQ_MODULE_CONNECTION_TOKEN,
  BULLMQ_MODULE_OPTIONS_TOKEN
} from './bullmq.constants';

// import * as Redis from 'ioredis';

export { Queue, Worker, QueueEvents, QueueScheduler }
export * as bullmq from 'bullmq';

export function getBullMQOptionsToken(connection: string): string {
  return `${ connection || BULLMQ_MODULE_CONNECTION }_${ BULLMQ_MODULE_OPTIONS_TOKEN }`;
}

export function getBullMQConnectionToken(connection?: string): string {
  return `${ connection || BULLMQ_MODULE_CONNECTION }_${ BULLMQ_MODULE_CONNECTION_TOKEN }`;
}

export function createBullMQConnection(connection: string, options: BullMQModuleOptions): BullMQ {
  const { config } = options;
  const queueName = connection || BULLMQ_MODULE_CONNECTION;

  // if(!(config.connection instanceof Redis)) {
  //   config.connection = new Redis(config.connection);
  // }

  return {
    queue: new Queue(queueName, config),
    process: (callback: (job: Job) => any): Worker => {
      return new Worker(queueName, callback, config);
    },
    queueEvents: new QueueEvents(queueName, config),
    queueScheduler: new QueueScheduler(queueName, config),
  };
}
