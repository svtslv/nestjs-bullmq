import { Injectable, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BullMQModule, InjectBullMQ, BullMQ, } from '../src';

const run = async() => {
  let  app: INestApplication = null;
  let moduleRef: TestingModule = null;
  
    @Injectable()
    class BullMQService {
      constructor(@InjectBullMQ() private readonly bullMq: BullMQ) {}
    
      async getTest() {
        this.bullMq.process(async job => {
          console.log('process', job); 
        })
        await this.bullMq.queue.add('test', { hello: 'world' });
        return null;
      }
    }
  
    moduleRef = await Test.createTestingModule({
      imports: [
        BullMQModule.forRootAsync({
          useFactory: () => ({
            name: 'QueueName',
            config: { connection: { host: 'localhost', port: 6378 } },
          }),
        }),
      ],
      providers: [BullMQService],
    }).compile();
  
    app = moduleRef.createNestApplication();
  
    await app.init();
  
    const bullMQModule = moduleRef.get(BullMQModule);
    const bullMQService = moduleRef.get(BullMQService);

    await bullMQService.getTest();
    console.log(bullMQModule.constructor.name);
    console.log(bullMQService.constructor.name);
    
    await app.close();
};

run().then();

