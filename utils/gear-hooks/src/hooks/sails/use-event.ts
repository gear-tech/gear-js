/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';

type NonServiceKeys = 'api' | 'registry' | 'programId' | 'newCtorFromCode' | 'newCtorFromCodeId';

type FunctionName<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => Promise<() => void> ? K : never;
}[keyof T];

type Event<T> = T extends (...args: infer P) => Promise<() => void> ? (...args: P) => Promise<() => void> : never;

type CallbackArgs<T> = T extends (...args: infer P) => void | Promise<void> ? P : never;

type UseEventParameters<TProgram, TServiceName, TFunctionName, TCallbackArgs extends any[]> = {
  program: TProgram | undefined;
  serviceName: TServiceName;
  functionName: TFunctionName;
  onData: (...args: TCallbackArgs) => void;
};

function useEvent<
  TProgram,
  TServiceName extends Exclude<keyof TProgram, NonServiceKeys>,
  TFunctionName extends FunctionName<TProgram[TServiceName]>,
  TEvent extends Event<TProgram[TServiceName][TFunctionName]>,
  TCallbackArgs extends CallbackArgs<Parameters<TEvent>[0]>,
>({
  program,
  serviceName,
  functionName,
  onData,
}: UseEventParameters<TProgram, TServiceName, TFunctionName, TCallbackArgs>) {
  // depends on useProgram/program implementation, programId may not be available
  const programId = program && typeof program === 'object' && 'programId' in program ? program.programId : undefined;

  useEffect(() => {
    if (!program) return;

    const unsub = (program[serviceName][functionName] as TEvent)(onData) as Promise<() => void>;

    return () => {
      unsub.then((unsubCallback) => unsubCallback());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId, serviceName, functionName]);
}

export { useEvent };
export type { UseEventParameters };
