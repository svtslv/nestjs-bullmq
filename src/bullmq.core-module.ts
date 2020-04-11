import { Global, Module, DynamicModule, Provider } from '@nestjs/common';
import { BullMQModuleAsyncOptions, BullMQModuleOptions, BullMQModuleOptionsFactory } from './bullmq.interfaces';
import { createBullMQConnection, getBullMQOptionsToken, getBullMQConnectionToken } from './bullmq.utils'

@Global()
@Module({})
export class BullMQCoreModule {

  /* forRoot */
  static forRoot(options: BullMQModuleOptions, connection?: string): DynamicModule {

    const knexOptionsProvider: Provider = {
      provide: getBullMQOptionsToken(connection),
      useValue: options,
    };

    const knexConnectionProvider: Provider = {
      provide: getBullMQConnectionToken(connection),
      useValue: createBullMQConnection(connection, options),
    };

    return {
      module: BullMQCoreModule,
      providers: [
        knexOptionsProvider,
        knexConnectionProvider,
      ],
      exports: [
        knexOptionsProvider,
        knexConnectionProvider,
      ],
    };
  }

  /* forRootAsync */
  public static forRootAsync(options: BullMQModuleAsyncOptions, connection: string): DynamicModule {

    const knexConnectionProvider: Provider = {
      provide: getBullMQConnectionToken(connection),
      useFactory(options: BullMQModuleOptions) {
        return createBullMQConnection(connection, options)
      },
      inject: [getBullMQOptionsToken(connection)],
    };

    return {
      module: BullMQCoreModule,
      imports: options.imports,
      providers: [...this.createAsyncProviders(options, connection), knexConnectionProvider],
      exports: [knexConnectionProvider],
    };
  }

  /* createAsyncProviders */
  public static createAsyncProviders(options: BullMQModuleAsyncOptions, connection?: string): Provider[] {

    if(!(options.useExisting || options.useFactory || options.useClass)) {
      throw new Error('Invalid configuration. Must provide useFactory, useClass or useExisting');
    }

    if (options.useExisting || options.useFactory) {
      return [
        this.createAsyncOptionsProvider(options, connection)
      ];
    }

    return [ 
      this.createAsyncOptionsProvider(options, connection), 
      { provide: options.useClass, useClass: options.useClass },
    ];
  }

  /* createAsyncOptionsProvider */
  public static createAsyncOptionsProvider(options: BullMQModuleAsyncOptions, connection?: string): Provider {

    if(!(options.useExisting || options.useFactory || options.useClass)) {
      throw new Error('Invalid configuration. Must provide useFactory, useClass or useExisting');
    }

    if (options.useFactory) {
      return {
        provide: getBullMQOptionsToken(connection),
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: getBullMQOptionsToken(connection),
      async useFactory(optionsFactory: BullMQModuleOptionsFactory): Promise<BullMQModuleOptions> {
        return await optionsFactory.createBullMQModuleOptions();
      },
      inject: [options.useClass || options.useExisting],
    };
  }
}