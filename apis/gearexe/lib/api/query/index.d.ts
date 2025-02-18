import { Block } from './block';
import { ProgramQueries } from './program';
export declare const query: {
    readonly block: typeof Block;
    readonly program: typeof ProgramQueries;
};
export type Query = {
    block: Block;
    program: ProgramQueries;
};
