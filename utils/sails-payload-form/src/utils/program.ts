import type { Sails, SailsProgram } from 'sails-js';

type ParsedProgram = Sails | SailsProgram;

const isIdlV2Program = (program: ParsedProgram): program is SailsProgram => 'resolveInService' in program;

export type { ParsedProgram };
export { isIdlV2Program };
