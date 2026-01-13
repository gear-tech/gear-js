import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashRegistry, EntityType } from '../../../model/index.js';
import { BatchesService } from '../batches/batches.service.js';
import { CodesService } from '../codes/codes.service.js';
import { MessagesService } from '../messages/messages.service.js';
import { ProgramsService } from '../programs/programs.service.js';
import { RepliesService } from '../replies/replies.service.js';
import { StateTransitionsService } from '../state-transitions/state-transitions.service.js';
import { TransactionsService } from '../transactions/transactions.service.js';

type EntityResult =
  | { type: 'Batch'; data: any }
  | { type: 'Code'; data: any }
  | { type: 'MessageRequest'; data: any }
  | { type: 'MessageSent'; data: any }
  | { type: 'Program'; data: any }
  | { type: 'StateTransition'; data: any }
  | { type: 'Tx'; data: any }
  | { type: 'ReplyRequest'; data: any }
  | { type: 'ReplySent'; data: any }
  | { type: 'Announces'; data: null };

@Injectable()
export class LookupService {
  constructor(
    @InjectRepository(HashRegistry)
    private readonly hashRegistryRepository: Repository<HashRegistry>,
    private readonly batchesService: BatchesService,
    private readonly codesService: CodesService,
    private readonly messagesService: MessagesService,
    private readonly programsService: ProgramsService,
    private readonly repliesService: RepliesService,
    private readonly stateTransitionsService: StateTransitionsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  async lookupByHash(hash: string): Promise<EntityResult> {
    // Step 1: Look up the hash in the registry
    const registry = await this.hashRegistryRepository.findOne({
      where: { id: hash.toLowerCase() },
    });

    if (!registry) {
      throw new NotFoundException(`Hash ${hash} not found`);
    }

    // Step 2: Find the corresponding entity in the target table based on type
    switch (registry.type) {
      case EntityType.Batch: {
        const data = await this.batchesService.findOne(hash);
        return { type: 'Batch', data };
      }

      case EntityType.Code: {
        const data = await this.codesService.findOne(hash);
        return { type: 'Code', data };
      }

      case EntityType.MessageRequest: {
        const data = await this.messagesService.findOneRequest(hash);
        return { type: 'MessageRequest', data };
      }

      case EntityType.MessageSent: {
        const data = await this.messagesService.findOneSent(hash);
        return { type: 'MessageSent', data };
      }

      case EntityType.Program: {
        const data = await this.programsService.findOne(hash);
        return { type: 'Program', data };
      }

      case EntityType.StateTransition: {
        const data = await this.stateTransitionsService.findOne(hash);
        return { type: 'StateTransition', data };
      }

      case EntityType.Tx: {
        const data = await this.transactionsService.findOne(hash);
        return { type: 'Tx', data };
      }

      case EntityType.Announces: {
        // Announces are not stored in a separate table
        return { type: 'Announces', data: null };
      }

      default: {
        throw new NotFoundException(`Unknown entity type: ${registry.type}`);
      }
    }
  }
}
