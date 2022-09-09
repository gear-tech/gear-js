import { Hex } from '@gear-js/api';
import { TypeRegistry, PortableRegistry } from '@polkadot/types';
import { hexToU8a, isHex } from '@polkadot/util';

import { REGULAR_EXP, isJSON, toJSON, joinTypePath } from '../utils';

function getName(path: string[], name: string, slice = -1) {
  if (name.endsWith(joinTypePath(path.slice(slice)))) {
    return name.slice(-joinTypePath(path.slice(slice)).length);
  } else {
    for (const i of path.slice(0, slice)) {
      name = name.slice(joinTypePath([i]).length);
    }
    return name;
  }
}

function replaceTypeNames(type: string, replaceMap: Map<string, string>) {
  for (const [oldName, newName] of replaceMap) {
    const regex = new RegExp(`\\b${oldName}\\b`, 'g');
    if (regex.test(type)) {
      type = type.replaceAll(regex, newName);
    }
  }
  return type;
}

type TypeDefinition = { fullName: string; changeName: boolean; type: string; path: string[] };

export class TypeInfoRegistry {
  registryTypes: Uint8Array;
  #finalTypeDefinition: Record<string, string>;
  registry: TypeRegistry;
  #replaceMap: Map<string, string>;
  #typesDefinition: Map<string, TypeDefinition>;
  #portableReg: PortableRegistry;
  #restrictedNames: string[];

  constructor(registryTypes: Hex | Uint8Array) {
    this.registryTypes = isHex(registryTypes) ? hexToU8a(registryTypes) : registryTypes;
    this.registry = new TypeRegistry();
    this.#portableReg = new PortableRegistry(this.registry, this.registryTypes, true);
    this.#replaceMap = new Map();
    this.#typesDefinition = new Map();
    this.#restrictedNames = [];
    this.#finalTypeDefinition = undefined;
    this.#createAndRegisterTypes();
  }

  #prepareTypes() {
    for (const { id, type } of this.#portableReg.types) {
      const path = type.path.toHuman() as string[];
      const typeDef = this.#portableReg.getTypeDef(id);
      const name = this.#portableReg.getName(id);

      if (name) {
        let slicedName = getName(path, name);
        if (this.#typesDefinition.has(slicedName)) {
          this.#restrictedNames.push(slicedName);
          this.#typesDefinition.get(slicedName).changeName = true;
          slicedName = this.#getSlicedName(path, name, slicedName);
        }
        this.#typesDefinition.set(slicedName, { changeName: false, type: typeDef.type, fullName: name, path });
      }
    }

    for (const [key, value] of this.#typesDefinition) {
      if (value.changeName) {
        const slicedName = this.#getSlicedName(value.path, value.fullName);
        this.#typesDefinition.set(slicedName, { ...value, changeName: false });
        this.#typesDefinition.delete(key);
      }
    }
  }

  #getSlicedName(path: string[], fullName: string, name?: string) {
    let slicedName = name ? name : getName(path, fullName);
    let slice = -2;
    while (this.#restrictedNames.includes(slicedName)) {
      slicedName = getName(path, fullName, slice);
      slice--;
    }
    return slicedName;
  }

  #createReplaceMap() {
    this.#typesDefinition.forEach((value, key) => {
      if (value.fullName !== key) {
        this.#replaceMap.set(value.fullName, key);
      }
    });
  }

  #createFinalTypeDefinition() {
    this.#finalTypeDefinition = {};
    this.#typesDefinition.forEach((value, key) => {
      const replacedTypeName = replaceTypeNames(value.type, this.#replaceMap);
      if (key !== replacedTypeName) {
        this.#finalTypeDefinition[key] = isJSON(replacedTypeName) ? toJSON(replacedTypeName) : replacedTypeName;
      }
    });
  }

  #registerTypes() {
    this.registry.setKnownTypes({ types: this.#finalTypeDefinition });
    this.registry.register(this.#finalTypeDefinition);
  }

  #createAndRegisterTypes() {
    this.#prepareTypes();
    this.#createReplaceMap();
    this.#createFinalTypeDefinition();
    this.#registerTypes();
  }

  getShortName(fullName: string): string {
    if (fullName.includes('::')) {
      fullName = joinTypePath(fullName.split('::'));
    }
    if (fullName.includes('_')) {
      fullName = joinTypePath(fullName.split('_'));
    }
    if (!this.#replaceMap.has(fullName)) {
      return fullName;
    }
    return this.#replaceMap.get(fullName);
  }

  getTypes() {
    return this.#finalTypeDefinition;
  }

  createType(typeName: string, data: any) {
    return this.registry.createType(typeName, data);
  }

  getGenericName(type: string) {
    const matches = type.match(REGULAR_EXP.endWord);
    const typeName = this.getShortName(matches[0]);
    for (const match of matches.slice(1)) {
      if (`${typeName}${match}` in this.#finalTypeDefinition) {
        return `${typeName}${match}${type.slice(typeName.length)}`;
      }
    }
    return type;
  }
}
