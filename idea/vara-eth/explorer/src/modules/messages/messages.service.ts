import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageRequest, MessageSent, type PgByteaString } from '@vara-eth/idea-indexer-db';
import { plainToInstance } from 'class-transformer';
import { Between, type FindOptionsWhere, type Repository } from 'typeorm';

import type { PaginatedResponse } from '../../common/dto/pagination.dto.js';
import { MessageRequestResponseDto } from './dto/message-request-response.dto.js';
import { MessageSentResponseDto } from './dto/message-sent-response.dto.js';
import type { QueryMessagesDto } from './dto/query-messages.dto.js';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageRequest)
    private readonly _messageRequestRepository: Repository<MessageRequest>,
    @InjectRepository(MessageSent)
    private readonly _messageSentRepository: Repository<MessageSent>,
  ) {}

  async findAllRequests(query: QueryMessagesDto): Promise<PaginatedResponse<MessageRequestResponseDto>> {
    const { limit, offset, programId, sourceAddress, fromBlock, toBlock } = query;

    const where: FindOptionsWhere<MessageRequest> = {};

    if (programId) {
      where.programId = programId;
    }

    if (sourceAddress) {
      where.sourceAddress = sourceAddress;
    }

    if (fromBlock !== undefined && toBlock !== undefined) {
      where.blockNumber = Between(BigInt(fromBlock), BigInt(toBlock));
    } else if (fromBlock !== undefined) {
      where.blockNumber = Between(BigInt(fromBlock), BigInt(Number.MAX_SAFE_INTEGER));
    } else if (toBlock !== undefined) {
      where.blockNumber = Between(BigInt(0), BigInt(toBlock));
    }

    const [data, total] = await this._messageRequestRepository.findAndCount({
      where,
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: plainToInstance(MessageRequestResponseDto, data, { excludeExtraneousValues: true }),
      total,
      limit: limit!,
      offset: offset!,
    };
  }

  async findAllSent(query: QueryMessagesDto): Promise<PaginatedResponse<MessageSentResponseDto>> {
    const { limit, offset, programId } = query;

    const where: FindOptionsWhere<MessageSent> = {};

    if (programId) {
      where.sourceProgramId = programId;
    }

    const [data, total] = await this._messageSentRepository.findAndCount({
      where,
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: plainToInstance(MessageSentResponseDto, data, { excludeExtraneousValues: true }),
      total,
      limit: limit!,
      offset: offset!,
    };
  }

  async findOneRequest(id: PgByteaString): Promise<MessageRequestResponseDto> {
    const message = await this._messageRequestRepository.findOne({
      where: { id },
      relations: ['program'],
    });

    if (!message) {
      throw new NotFoundException(`Message request with ID ${id} not found`);
    }

    return plainToInstance(MessageRequestResponseDto, message, { excludeExtraneousValues: true });
  }

  async findOneSent(id: PgByteaString): Promise<MessageSentResponseDto> {
    const message = await this._messageSentRepository.findOne({
      where: { id },
      relations: ['sourceProgram', 'stateTransition'],
    });

    if (!message) {
      throw new NotFoundException(`Message sent with ID ${id} not found`);
    }

    return plainToInstance(MessageSentResponseDto, message, { excludeExtraneousValues: true });
  }
}
