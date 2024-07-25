/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { EventReturn, FunctionName, ServiceName, Event, EventCallbackArgs } from './types';

type UseProgramEventParameters<TProgram, TServiceName, TFunctionName, TCallbackArgs extends any[]> = {
  program: TProgram | undefined;
  serviceName: TServiceName;
  functionName: TFunctionName;
  onData: (...args: TCallbackArgs) => void;
};

function useProgramEvent<
  TProgram,
  TServiceName extends ServiceName<TProgram>,
  TFunctionName extends FunctionName<TProgram[TServiceName], EventReturn>,
  TEvent extends Event<TProgram[TServiceName][TFunctionName]>,
  TCallbackArgs extends EventCallbackArgs<TEvent>,
>({
  program,
  serviceName,
  functionName,
  onData,
}: UseProgramEventParameters<TProgram, TServiceName, TFunctionName, TCallbackArgs>) {
  // depends on useProgram/program implementation, programId may not be available
  const programId = program && typeof program === 'object' && 'programId' in program ? program.programId : undefined;

  useEffect(() => {
    if (!program) return;

    const unsub = (program[serviceName][functionName] as TEvent)(onData) as EventReturn;

    return () => {
      unsub.then((unsubCallback) => unsubCallback());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId, serviceName, functionName]);
}

export { useProgramEvent };
export type { UseProgramEventParameters };
