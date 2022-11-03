import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { kafkaNetworkData } from '../common/kafka-network-data';
import { ProducerService } from '../producer/producer.service';

@Injectable()
export class TasksService {
  private logger = new Logger(TasksService.name);

  constructor(private producerService: ProducerService){}

  @Cron(CronExpression.EVERY_30_SECONDS)
  public async handleCron() {
    await this.runSchedulerNetworkData();
  }

  private async runSchedulerNetworkData(): Promise<void> {
    if(!kafkaNetworkData.partition && !(kafkaNetworkData.partition === 0)) {
      try {
        await this.producerService.setKafkaNetworkData();
        this.logger.log(`📡 Kafka network data ${JSON.stringify(kafkaNetworkData)}`);
      } catch (error) {
        this.logger.error('Run scheduler network data error');
        console.log(error);
      }
    }
  }
}
