import { ModuleMetadata, Type } from "@nestjs/common/interfaces";
import type { QueueBaseOptions, Queue, Worker, QueueEvents, QueueScheduler, Job } from 'bullmq';

export type BullMQ = {
  queue: Queue,
  process: (callback: (job: Job) => any) => Worker,
  queueEvents: QueueEvents,
  queueScheduler: QueueScheduler
}

export interface BullMQModuleOptions {
  config: QueueBaseOptions;
}

export interface BullMQModuleOptionsFactory {
  createBullMQModuleOptions(): Promise<BullMQModuleOptions> | BullMQModuleOptions;
}

export interface BullMQModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<BullMQModuleOptionsFactory>;
  useExisting?: Type<BullMQModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<BullMQModuleOptions> | BullMQModuleOptions;
}
