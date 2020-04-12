# NestJS BullMQ

<a href="https://www.npmjs.com/package/nestjs-bullmq"><img src="https://img.shields.io/npm/v/nestjs-bullmq.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/nestjs-bullmq"><img src="https://img.shields.io/npm/l/nestjs-bullmq.svg" alt="Package License" /></a>

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Examples](#examples)
- [License](#license)

## Description
Integrates BullMQ with Nest

## Installation

```bash
npm install nestjs-bullmq bullmq
```

You can also use the interactive CLI

```sh
npx nestjs-modules
```

## Examples

### BullMQModule.forRoot(options, connection?)

```ts
import { Module } from '@nestjs/common';
import { BullMQModule } from 'nestjs-bullmq';
import { AppController } from './app.controller';

@Module({
  imports: [
    BullMQModule.forRoot({
      config: {
        connection: { host: 'localhost', port: 6379 },
      },
    }, 'QueueName'),
  ],
  controllers: [AppController],
})
export class AppModule {}
```

### BullMQModule.forRootAsync(options, connection?)

```ts
import { Module } from '@nestjs/common';
import { BullMQModule } from 'nestjs-bullmq';
import { AppController } from './app.controller';

@Module({
  imports: [
    BullMQModule.forRootAsync({
      useFactory: () => ({
        config: {
          connection: { host: 'localhost', port: 6379 }, 
        },
      }),
    }, 'QueueName'),
  ],
  controllers: [AppController],
})
export class AppModule {}
```

### InjectBullMQ(connection?)

```ts
import { Controller, Get, } from '@nestjs/common';
import { InjectBullMQ, BullMQ } from 'nestjs-bullmq';

@Controller()
export class AppController {
  constructor(
    @InjectBullMQ('QueueName') private readonly bullMQ: BullMQ,
  ) {}

  @Get()
  async getHello() {
    this.bullMQ.process(async job => {
      console.log('process', job); 
    })
    this.bullMQ.queue.add('myJobName', { foo: 'bar' });
    // this.bullMQ.queueEvents.on();
    // this.bullMQ.queueScheduler.on();
  }
}
```

## License

MIT
