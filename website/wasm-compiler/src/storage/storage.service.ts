import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wasm } from './wasm.entity';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(Wasm)
    private readonly repo: Repository<Wasm>,
  ) {}

  async save(file: Buffer, id: string) {
    const created = this.repo.create({ file, id });
    return this.repo.save(created);
  }

  async getFile(id: string) {
    const wasm = await this.repo.findOne({ id });
    if (wasm) {
      this.repo.remove(wasm);
      return wasm;
    }
    return 'not_compiled';
  }
}
