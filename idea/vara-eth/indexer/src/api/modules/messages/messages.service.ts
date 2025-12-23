import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Between } from 'typeorm';
import { MessageRequest, MessageSent } from '../../../model/index.js';
import { QueryMessagesDto } from './dto/query-messages.dto.js';
import { PaginatedResponse } from '../../common/dto/pagination.dto.js';
import { toBytea, toByteaBuffer } from '../../common/utils/hex.util.js';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageRequest)
    private readonly messageRequestRepository: Repository<MessageRequest>,
    @InjectRepository(MessageSent)
    private readonly messageSentRepository: Repository<MessageSent>,
  ) {}

  async findAllRequests(query: QueryMessagesDto): Promise<PaginatedResponse<MessageRequest>> {
    const { limit, offset, sortBy, order, programId, sourceAddress, fromBlock, toBlock } = query;

    const where: FindOptionsWhere<MessageRequest> = {};

    if (programId) {
      where.programId = toByteaBuffer(programId);
    }

    if (sourceAddress) {
      where.sourceAddress = toByteaBuffer(sourceAddress);
    }

    if (fromBlock !== undefined && toBlock !== undefined) {
      where.blockNumber = Between(BigInt(fromBlock), BigInt(toBlock));
    } else if (fromBlock !== undefined) {
      where.blockNumber = Between(BigInt(fromBlock), BigInt(Number.MAX_SAFE_INTEGER));
    } else if (toBlock !== undefined) {
      where.blockNumber = Between(BigInt(0), BigInt(toBlock));
    }

    const [data, total] = await this.messageRequestRepository.findAndCount({
      where,
      take: limit,
      skip: offset,
      order: {
        [sortBy!]: order,
      },
    });

    return {
      data,
      total,
      limit: limit!,
      offset: offset!,
    };
  }

  async findAllSent(query: QueryMessagesDto): Promise<PaginatedResponse<MessageSent>> {
    const { limit, offset, order, programId } = query;

    const where: FindOptionsWhere<MessageSent> = {};

    if (programId) {
      where.sourceProgramId = toByteaBuffer(programId);
    }

    const [data, total] = await this.messageSentRepository.findAndCount({
      where,
      take: limit,
      skip: offset,
      order: {
        createdAt: order,
      },
    });

    return {
      data,
      total,
      limit: limit!,
      offset: offset!,
    };
  }

  async findOneRequest(id: string): Promise<MessageRequest> {
    const message = await this.messageRequestRepository.findOne({
      where: { id: toBytea(id) },
      relations: ['program'],
    });

    if (!message) {
      throw new NotFoundException(`Message request with ID ${id} not found`);
    }

    return message;
  }

  async findOneSent(id: string): Promise<MessageSent> {
    const message = await this.messageSentRepository.findOne({
      where: { id: toBytea(id) },
      relations: ['sourceProgram', 'stateTransition'],
    });

    if (!message) {
      throw new NotFoundException(`Message sent with ID ${id} not found`);
    }

    return message;
  }
}
