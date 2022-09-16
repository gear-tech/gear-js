import { writeFileSync } from 'fs';

export class Output {
  #rows: string[] = [];
  #firstRows: string[] = [];
  #indent = '';
  #imports: Map<string, Set<string>>;

  constructor(private path: string) {
    this.#rows = [];
    this.#firstRows = [];
    this.#imports = new Map();
  }

  import(module_: string, import_: string) {
    if (this.#imports.has(module_)) {
      this.#imports.get(module_).add(import_);
    } else {
      this.#imports.set(module_, new Set([import_]));
    }
  }

  firstLine(data: string | string[]) {
    if (Array.isArray(data)) {
      data = data.map((line) => {
        if (!line.endsWith(';')) return line + ';';
        return line;
      });
      this.#firstRows.push(...data);
      return;
    }
    if (!data.endsWith(';')) data += ';';
    this.#firstRows.push(data);
  }

  line(data?: string, semicolon = true) {
    if (data && semicolon && !data.endsWith(';')) data += ';';
    data = data ? `${this.#indent}${data}` : '';
    this.#rows.push(data);
  }

  block(beginning: string, content?: () => void) {
    this.#rows.push(`${this.#indent}${beginning} {${!content ? ' }' : ''}`);
    if (content) {
      this.increaseIndent();
      content();
      this.reduceIndent();
      this.#rows.push(`${this.#indent}}`);
    }
  }

  increaseIndent() {
    this.#indent += '  ';
  }

  reduceIndent() {
    this.#indent = this.#indent.substring(2);
  }

  save() {
    const result = [];
    const imports = Array.from(this.#imports).map(
      ([module_, imports_]) => `import { ${Array.from(imports_).join(', ')} } from '${module_}';`,
    );
    if (imports.length > 0) result.push(imports.join('\n'));

    if (this.#firstRows.length > 0) result.push(this.#firstRows.join('\n'));

    if (this.#rows.length > 0) result.push(this.#rows.join('\n'));

    writeFileSync(this.path, result.join('\n\n'));
  }
}
