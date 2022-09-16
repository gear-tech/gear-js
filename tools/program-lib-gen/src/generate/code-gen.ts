import { TypeInfoRegistry } from '@gear-js/api';
import { Codec } from '@polkadot/types-codec/types';
import { join } from 'path';

import { Template } from '../interfaces/template.js';
import { Scheme } from '../interfaces/scheme.js';
import { Output } from './output.js';
import { joinTypePath } from './utils.js';

function className(name: string) {
  if (!name) {
    return 'Wrapper';
  }
  return name
    .split(/[\s_]/)
    .map((value) => `${value[0].toUpperCase()}${value.slice(1).toLowerCase()}`)
    .join('');
}

function getGeneric(typeName: string, variant?: string, resultTypeName?: string, resultVariant?: string) {
  return `${variant ? `${typeName}Enum.${variant}` : typeName}${
    resultTypeName ? `, ${resultVariant ? `${resultTypeName}Enum.${resultVariant}` : resultTypeName}` : ''
  }`;
}

export class CodeGen {
  #out: Output;
  #templates: Set<Template> = new Set();

  constructor(private scheme: Scheme, private registryTypes: TypeInfoRegistry, saveTo: string) {
    this.#out = new Output(join(saveTo, scheme.name ? `${scheme.name.split(' ').join('-')}.ts` : './program-lib.ts'));
  }

  #generateInit() {
    if (!this.scheme.init) {
      return;
    }
    this.#out.import('./entries/init.entry', 'UploadProgram');
    this.#out.import('./entries/init.entry', 'CreateProgram');
    this.#templates.add('init');
    this.#templates.add('base');
    this.#out.line();

    for (const func of this.scheme.init) {
      const typeName = this.#getPayloadType(func.input.name);
      const variant = this.#getVariantName(func.input);
      const resultTypeName = this.#getPayloadType(func.output?.name);
      const resultVariant = this.#getVariantName(func.output);
      const genericType = getGeneric(typeName, variant, resultTypeName, resultVariant);
      if (typeName) {
        this.#out.import('./types', variant ? `${typeName}Enum` : typeName);
      }
      if (resultTypeName) {
        this.#out.import('./types', resultVariant ? `${resultTypeName}Enum` : resultTypeName);
      }
      this.#out.line(`${func.name}(code: Buffer): UploadProgram<${genericType}>`);
      this.#out.line();
      this.#out.line(`${func.name}(codeId: Hex): CreateProgram<${genericType}>`);
      this.#out.line();
      this.#out.line(
        `${func.name}(codeOrCodeId: Hex | Buffer): CreateProgram<${genericType}> | UploadProgram<${genericType}>`,
      );
      this.#out.line();
      this.#out.block(
        `${func.name}(codeOrCodeId: Hex | Buffer): CreateProgram<${genericType}> | UploadProgram<${genericType}>`,
        () => {
          this.#out.line(
            "const [code, codeId] = typeof codeOrCodeId === 'string' ? [undefined, codeOrCodeId] : [codeOrCodeId, undefined]",
          );

          this.#out.block('const options = ', () => {
            this.#out.line(`payloadType: ${typeName ? `'${typeName}'` : undefined},`, false);
            this.#out.line(`enumVariant: ${variant ? `'${variant}'` : undefined},`, false);
            this.#out.line(`resultType: ${resultTypeName ? `'${resultTypeName}'` : undefined},`, false);
            this.#out.line(`resultEnumVariant: ${resultVariant ? `'${resultVariant}'` : undefined},`, false);
          });

          this.#out.line(
            'return code ? new UploadProgram(this.registry, this.api, { code, ...options }) : new CreateProgram(this.registry, this.api, { codeId, ...options })',
          );
        },
      );
    }
  }

  #generateReply() {
    if (!this.scheme.reply) {
      return;
    }

    this.#out.import('./entries/reply.entry', 'Reply');
    this.#templates.add('reply');
    this.#templates.add('base');
    this.#out.line();

    for (const func of this.scheme.reply) {
      const typeName = this.#getPayloadType(func.input.name);
      const variant = this.#getVariantName(func.input);
      const resultTypeName = this.#getPayloadType(func.output?.name);
      const resultVariant = this.#getVariantName(func.output);
      const genericType = getGeneric(typeName, variant, resultTypeName, resultVariant);

      if (typeName) {
        this.#out.import('./types', variant ? `${typeName}Enum` : typeName);
      }

      if (resultTypeName) {
        this.#out.import('./types', resultVariant ? `${resultTypeName}Enum` : resultTypeName);
      }

      this.#out.block(`${func.name}(messageId: Hex): Reply<${genericType}>`, () => {
        this.#out.block('const options = ', () => {
          this.#out.line('programId: this.programId,', false);
          this.#out.line(`payloadType: '${typeName}',`, false);
          this.#out.line(`enumVariant: '${variant}',`, false);
          this.#out.line(`resultType: '${resultTypeName}',`, false);
          this.#out.line(`resultEnumVariant: '${resultVariant}',`, false);
        });
        this.#out.line();
        this.#out.line(`const reply: Reply<${genericType}> = new Reply(this.registry, this.api, options)`);
        this.#out.line('reply.messageId(messageId)');
        this.#out.line('return reply');
      });
    }
  }

  #generateHandle() {
    if (!this.scheme.handle) {
      return;
    }
    this.#out.import('./entries/handle.entry', 'Handle');
    this.#templates.add('handle');
    this.#templates.add('base');
    this.#out.line();

    for (const func of this.scheme.handle) {
      const typeName = this.#getPayloadType(func.input.name);
      const variant = this.#getVariantName(func.input);
      const resultTypeName = this.#getPayloadType(func.output?.name);
      const resultVariant = this.#getVariantName(func.output);
      this.#out.line(`${func.name}: Handle<${getGeneric(typeName, variant, resultTypeName, resultVariant)}>`);
      this.#out.import('./types', variant ? `${typeName}Enum` : typeName);
      if (resultTypeName) {
        this.#out.import('./types', resultVariant ? `${resultTypeName}Enum` : resultTypeName);
      }
    }
  }

  #generateConstructor() {
    this.#out.line();
    if (!this.scheme.handle) {
      this.#out.block('constructor(public api: GearApi, public programId?: Hex)');
      return;
    }
    this.#out.block('constructor(public api: GearApi, public programId?: Hex)', () => {
      for (const func of this.scheme.handle) {
        this.#out.line(
          `this.${
            func.name
          } = new Handle(this.registry, this.api, { programId: this.programId, payloadType: '${this.#getPayloadType(
            func.input.name,
          )}', enumVariant: '${this.#getVariantName(func.input)}', resultType: '${this.#getPayloadType(
            func.output.name,
          )}', resultEnumVariant: '${this.#getVariantName(func.output)}' })`,
        );
      }
    });
  }

  #generateSetProgramId() {
    if (!this.scheme.handle) {
      return;
    }

    this.#out.block('setProgramId(id: Hex)', () => {
      this.#out.line('this.programId = id');
      for (const { name } of this.scheme.handle) {
        this.#out.line(`this.${name}.setProgramId(id)`);
      }
    });
  }

  generate() {
    this.#out.import('@gear-js/api', 'GearApi');
    this.#out.import('@gear-js/api', 'Hex');
    this.#out.import('@gear-js/api', 'TypeInfoRegistry');

    this.#out.block(`export class ${className(this.scheme.name)}`, () => {
      this.#out.line(`registry = new TypeInfoRegistry('${this.scheme.registry}')`);

      this.#generateHandle();

      this.#generateConstructor();

      this.#generateSetProgramId();

      this.#generateInit();

      this.#generateReply();
    });

    return this.#templates;
  }

  save() {
    this.#out.save();
  }

  #getPayloadType(typeName: string) {
    if (!typeName) {
      return null;
    }
    const type = joinTypePath(typeName.split('::'));
    return this.registryTypes.getShortName(type);
  }

  #getVariantName(input?: { name?: string; variantName?: string; variantExample?: string }) {
    if (!input || !input.name) {
      return null;
    }
    if (input.variantName) {
      return input.variantName;
    }
    if (input.variantExample) {
      return this.#getVariantFromExample(this.#getPayloadType(input.name), input.variantExample);
    }
  }

  #getVariantFromExample(name: string, example: string) {
    const decoded = this.registryTypes.registry.createType(name, example) as Codec;
    return Object.keys(decoded.toHuman())[0];
  }
}
