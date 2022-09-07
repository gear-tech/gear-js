import { Injectable, Logger } from '@nestjs/common';
import { MessageEnqueuedData } from '@gear-js/api';
import { filterEvents } from '@polkadot/api/util';
import { GenericEventData } from '@polkadot/types';
import { ProgramStatus, Keys, MessageType, UpdateMessageData } from '@gear-js/common';

import { gearService } from './gear-service';
import { ProgramService } from '../program/program.service';
import { MessageService } from '../message/message.service';
import { MetadataService } from '../metadata/metadata.service';
import { CodeService } from '../code/code.service';
import { getPayloadByGearEvent, getUpdateMessageData } from '../common/helpers';
import { HandleExtrinsicsData } from './types';


@Injectable()
export class GearEventListener {
  private logger: Logger = new Logger('GearEventListener');

  constructor(private programService: ProgramService,
              private messageService: MessageService,
              private metaService: MetadataService,
              private codeService: CodeService) {
  }

  public async listen(){
    // eslint-disable-next-line no-constant-condition
    while (true) {
      await gearService.connect();
      await this.listener();
    }
  }

  private async listener() {
    const gearApi = gearService.getApi();
    const genesis = gearApi.genesisHash.toHex();

    gearApi.query.system.events(async (events) => {
      const blockHash = events.createdAtHash!.toHex();

      const [blockTimestamp, block, extrinsicStatus] = await Promise.all([
        gearApi.blocks.getBlockTimestamp(blockHash),
        gearApi.blocks.get(blockHash),
        gearApi.createType('ExtrinsicStatus', { finalized: blockHash }),
      ]);

      const base = {
        genesis,
        blockHash,
        timestamp: blockTimestamp.toNumber(),
      };

      for (const {
        event: { data, method },
      } of events) {
        try {
          const payload = getPayloadByGearEvent(method, data as GenericEventData);
          if (payload !== null) await this.handleEvents(method, { ...payload, ...base });
        } catch (error) {
          console.error(error);
          this.logger.log({ method, data: data.toHuman() });
          this.logger.log('--------------END_ERROR--------------');
        }
      }

      await this.handleExtrinsics({
        genesis,
        events,
        status: extrinsicStatus,
        signedBlock: block
      });
    });
  }

  private async handleEvents(method: string, payload: any): Promise<void> {
    const { id, genesis } = payload;
    const eventsMethod = {
      [Keys.MessageEnqueued]: async () => {
        const { destination, source, timestamp, blockHash, entry } = payload;
        if (entry === 'Init') {
          await this.programService.createProgram({
            id: destination,
            owner: source,
            genesis,
            timestamp,
            blockHash,
          });
          return;
        }
        await this.messageService.createMessage({
          id,
          destination,
          source,
          entry,
          payload: null,
          replyToMessageId: null,
          exitCode: null,
          genesis,
          blockHash,
          timestamp,
          type: MessageType.ENQUEUED,
        });
      },
      [Keys.UserMessageSent]: async () => {
        await this.messageService.createMessage({
          ...payload,
          type: MessageType.USER_MESS_SENT
        });
      },
      [Keys.ProgramChanged]: async () => {
        const { id, genesis } = payload;
        if(payload.isActive) await this.programService.setStatus(id, genesis, ProgramStatus.ACTIVE);
      },
      [Keys.MessagesDispatched]: async () => {
        await this.messageService.setDispatchedStatus(payload);
      },
      [Keys.UserMessageRead]: async () => {
        await this.messageService.updateReadStatus(payload.id, payload.reason);
      },
      [Keys.DatabaseWiped]: async () => {
        await Promise.all([
          this.messageService.deleteRecords(genesis),
          this.programService.deleteRecords(genesis),
          this.codeService.deleteRecords(genesis),
        ]);
      }
    };

    try {
      method in eventsMethod && await eventsMethod[method]();
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async handleExtrinsics(handleExtrinsicsData: HandleExtrinsicsData): Promise<void> {
    const { signedBlock, events, status, genesis } = handleExtrinsicsData;

    const eventMethods = ['sendMessage', 'submitProgram', 'sendReply'];
    const extrinsics = signedBlock.block.extrinsics.filter(({ method: { method } }) => eventMethods.includes(method));

    const result = extrinsics.map((extrinsic) => {
      const {
        hash,
        args,
        method: { method },
      } = extrinsic;

      const filteredEvents = filterEvents(hash, signedBlock, events, status).events!.filter(
        ({ event: { method } }) => method === Keys.MessageEnqueued,
      );

      const eventData = filteredEvents[0].event.data as MessageEnqueuedData;

      const messageId = eventData.id.toHex();
      const [payload, value] = getUpdateMessageData(args, method);

      return { messageId, payload, genesis, value } as UpdateMessageData;
    });

    try {
      await this.messageService.updateMessagesData(result);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
