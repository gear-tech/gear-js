import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { ReplyRequest, ReplySent } from '../../../model/index.js';
import { QueryRepliesDto } from './dto/query-replies.dto.js';
import { PaginatedResponse } from '../../common/dto/pagination.dto.js';
import { toBytea, toByteaBuffer } from '../../common/utils/hex.util.js';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(ReplyRequest)
    private readonly replyRequestRepository: Repository<ReplyRequest>,
    @InjectRepository(ReplySent)
    private readonly replySentRepository: Repository<ReplySent>,
  ) {}

  async findAllRequests(query: QueryRepliesDto): Promise<PaginatedResponse<ReplyRequest>> {
    const { limit, offset, sortBy, order, programId } = query;

    const where: FindOptionsWhere<ReplyRequest> = {};

    if (programId) {
      where.programId = programId.toLowerCase();
    }

    const [data, total] = await this.replyRequestRepository.findAndCount({
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

  async findAllSent(query: QueryRepliesDto): Promise<PaginatedResponse<ReplySent>> {
    const { limit, offset, order, programId, repliedToId } = query;

    const where: FindOptionsWhere<ReplySent> = {};

    if (programId) {
      where.sourceProgramId = programId.toLowerCase();
    }

    if (repliedToId) {
      where.repliedToId = toByteaBuffer(repliedToId);
    }

    const [data, total] = await this.replySentRepository.findAndCount({
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

  async findOneRequest(id: string): Promise<ReplyRequest> {
    const reply = await this.replyRequestRepository.findOne({
      where: { id: toBytea(id) },
      relations: ['program'],
    });

    if (!reply) {
      throw new NotFoundException(`Reply request with ID ${id} not found`);
    }

    return reply;
  }

  async findOneSent(id: string): Promise<ReplySent> {
    const reply = await this.replySentRepository.findOne({
      where: { id: toBytea(id) },
      relations: ['sourceProgram', 'stateTransition'],
    });

    if (!reply) {
      throw new NotFoundException(`Reply sent with ID ${id} not found`);
    }

    return reply;
  }
}
