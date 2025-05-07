interface EnumType<T extends object> {
  [K in keyof T]: boolean;
  toString: () => string
};

export class Enum<T extends { [k: string]: number }> extends EnumType<T> {
  constructor(
    private _value: number,
    private _enum: object,
  ) {
    Object.entries(_enum).forEach(([key, value]) => {
      Object.defineProperty(this, `is${key}`, {
        get() {
          return this._value === value;
        },
      });
    });
  }
}

enum Test {
  One,
  Two,
}

new Enum<Test>(0, Test);
