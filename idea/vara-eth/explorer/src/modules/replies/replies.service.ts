import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type PgByteaString, ReplyRequest, ReplySent } from '@vara-eth/idea-indexer-db';
import { plainToInstance } from 'class-transformer';
import type { FindOptionsWhere, Repository } from 'typeorm';

import type { PaginatedResponse } from '../../common/dto/pagination.dto.js';
import type { QueryRepliesDto } from './dto/query-replies.dto.js';
import { ReplyRequestResponseDto } from './dto/reply-request-response.dto.js';
import { ReplySentResponseDto } from './dto/reply-sent-response.dto.js';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(ReplyRequest)
    private readonly _replyRequestRepository: Repository<ReplyRequest>,
    @InjectRepository(ReplySent)
    private readonly _replySentRepository: Repository<ReplySent>,
  ) {}

  async findAllRequests(query: QueryRepliesDto): Promise<PaginatedResponse<ReplyRequestResponseDto>> {
    const { limit, offset, programId } = query;

    const where: FindOptionsWhere<ReplyRequest> = {};

    if (programId) {
      where.programId = programId;
    }

    const [data, total] = await this._replyRequestRepository.findAndCount({
      where,
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: plainToInstance(ReplyRequestResponseDto, data, { excludeExtraneousValues: true }),
      total,
      limit: limit!,
      offset: offset!,
    };
  }

  async findAllSent(query: QueryRepliesDto): Promise<PaginatedResponse<ReplySentResponseDto>> {
    const { limit, offset, programId, repliedToId } = query;

    const where: FindOptionsWhere<ReplySent> = {};

    if (programId) {
      where.sourceProgramId = programId;
    }

    if (repliedToId) {
      where.repliedToId = repliedToId;
    }

    const [data, total] = await this._replySentRepository.findAndCount({
      where,
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: plainToInstance(ReplySentResponseDto, data, { excludeExtraneousValues: true }),
      total,
      limit: limit!,
      offset: offset!,
    };
  }

  async findOneRequest(id: PgByteaString): Promise<ReplyRequestResponseDto> {
    const reply = await this._replyRequestRepository.findOne({
      where: { id },
      relations: ['program'],
    });

    if (!reply) {
      throw new NotFoundException(`Reply request with ID ${id} not found`);
    }

    return plainToInstance(ReplyRequestResponseDto, reply, { excludeExtraneousValues: true });
  }

  async findOneSent(id: PgByteaString): Promise<ReplySentResponseDto> {
    const reply = await this._replySentRepository.findOne({
      where: { id },
      relations: ['sourceProgram', 'stateTransition'],
    });

    if (!reply) {
      throw new NotFoundException(`Reply sent with ID ${id} not found`);
    }

    return plainToInstance(ReplySentResponseDto, reply, { excludeExtraneousValues: true });
  }
}
