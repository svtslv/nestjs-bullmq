import { Global, Module, DynamicModule, Provider } from '@nestjs/common';
import { BullMQModuleAsyncOptions, BullMQModuleOptions, BullMQModuleOptionsFactory } from './bullmq.interfaces';
import { createBullMQConnection, getBullMQOptionsToken, getBullMQConnectionToken } from './bullmq.utils'

@Global()
@Module({})
export class BullMQCoreModule {

  /* forRoot */
  static forRoot(options: BullMQModuleOptions, connection?: string): DynamicModule {

    const bullMQOptionsProvider: Provider = {
      provide: getBullMQOptionsToken(options, connection),
      useValue: options,
    };

    const bullMQConnectionProvider: Provider = {
      provide: getBullMQConnectionToken(options, connection),
      useValue: createBullMQConnection(options, connection),
    };

    return {
      module: BullMQCoreModule,
      providers: [
        bullMQOptionsProvider,
        bullMQConnectionProvider,
      ],
      exports: [
        bullMQOptionsProvider,
        bullMQConnectionProvider,
      ],
    };
  }

  /* forRootAsync */
  public static forRootAsync(options: BullMQModuleAsyncOptions, connection: string): DynamicModule {

    const bullMQConnectionProvider: Provider = {
      provide: getBullMQConnectionToken(options, connection),
      useFactory(syncOptions: BullMQModuleOptions) {
        syncOptions.name = options.name;
        return createBullMQConnection(syncOptions, connection)
      },
      inject: [getBullMQOptionsToken(options, connection)],
    };

    return {
      module: BullMQCoreModule,
      imports: options.imports,
      providers: [...this.createAsyncProviders(options, connection), bullMQConnectionProvider],
      exports: [bullMQConnectionProvider],
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
        provide: getBullMQOptionsToken(options, connection),
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: getBullMQOptionsToken(options, connection),
      async useFactory(optionsFactory: BullMQModuleOptionsFactory): Promise<BullMQModuleOptions> {
        return await optionsFactory.createBullMQModuleOptions();
      },
      inject: [options.useClass || options.useExisting],
    };
  }
}