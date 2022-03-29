import { Repository } from 'typeorm';
import { GearKeyring } from '@gear-js/api';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignNotVerified, MetadataNotFound } from '../errors';
import { ProgramsService } from '../programs/programs.service';
import { Meta } from '../entities/meta.entity';
import { AddMetaParams, AddMetaResult, GetMetaParams, GetMetaResult } from '@gear-js/interfaces';

@Injectable()
export class MetadataService {
  constructor(
    @InjectRepository(Meta)
    private readonly metaRepo: Repository<Meta>,
    private readonly programService: ProgramsService,
  ) {}

  async addMeta(params: AddMetaParams): Promise<AddMetaResult> {
    const program = await this.programService.findProgram({
      id: params.programId,
      genesis: params.genesis,
    });
    console.log(program);
    console.log(params);
    console.log(
      `*** CHECK GearKeyring.checkSign: ${GearKeyring.checkSign(
        '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
        '0x6801a46b226ba38525213a7654bad6bf2f562feef281b2ae699d6a5d982504275bf75280594781871236f9800babefdde583a855240b619a8e31d06717a3ca8f',
        '{"init_input":"MessageInitIn","init_output":"MessageInitOut","handle_input":"MessageIn","handle_output":"MessageOut","types":"0x5000082464656d6f5f6d657461344d657373616765496e6974496e0000080118616d6f756e74040108753800012063757272656e6379080118537472696e6700000400000503000800000502000c082464656d6f5f6d657461384d657373616765496e69744f7574000008013465786368616e67655f72617465100138526573756c743c75382c2075383e00010c73756d04010875380000100418526573756c740804540104044501040108084f6b040004000000000c457272040004000001000014082464656d6f5f6d657461484d657373616765496e69744173796e63496e0000040114656d707479180108282900001800000400001c082464656d6f5f6d6574614c4d657373616765496e69744173796e634f75740000040114656d7074791801082829000020082464656d6f5f6d657461244d657373616765496e000004010869642401084964000024082464656d6f5f6d657461084964000008011c646563696d616c28010c75363400010c6865782c011c5665633c75383e00002800000506002c000002040030082464656d6f5f6d657461284d6573736167654f7574000004010c7265733401384f7074696f6e3c57616c6c65743e00003404184f7074696f6e04045401380108104e6f6e6500000010536f6d65040038000001000038082464656d6f5f6d6574611857616c6c6574000008010869642401084964000118706572736f6e3c0118506572736f6e00003c082464656d6f5f6d65746118506572736f6e000008011c7375726e616d65080118537472696e670001106e616d65080118537472696e67000040082464656d6f5f6d657461504d65737361676548616e646c654173796e63496e0000040114656d7074791801082829000044082464656d6f5f6d657461544d65737361676548616e646c654173796e634f75740000040114656d707479180108282900004804184f7074696f6e04045401240108104e6f6e6500000010536f6d6504002400000100004c0000023800"}',
      )}`,
    );
    console.log(`!GearKeyring.checkSign(${program.owner}, ${params.signature}, ${params.meta})`);
    if (!GearKeyring.checkSign(program.owner, params.signature, params.meta)) {
      throw new SignNotVerified();
    }

    const metadata = this.metaRepo.create({
      owner: program.owner,
      meta: typeof params.meta === 'string' ? params.meta : JSON.stringify(params.meta),
      metaFile: params.metaFile,
      program: program.id,
    });
    const savedMeta = await this.metaRepo.save(metadata);
    await this.programService.addProgramInfo(params.programId, params.genesis, params.name, params.title, savedMeta);

    return { status: 'Metadata added' };
  }

  async getMeta(params: GetMetaParams): Promise<GetMetaResult> {
    const program = await this.programService.findProgram({
      id: params.programId,
      genesis: params.genesis,
    });
    const meta = await this.metaRepo.findOne({ program: params.programId });
    if (meta) {
      return { program: meta.program, meta: meta.meta, metaFile: meta.metaFile };
    } else {
      throw new MetadataNotFound();
    }
  }
}
