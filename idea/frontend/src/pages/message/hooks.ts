import { MESSAGE_TYPE, Message } from '@/features/message';
import { useProgram } from '@/features/program';
import { useSails } from '@/features/sails';

function useMessageSails(message: Message | undefined) {
  const getProgramId = () => {
    if (!message) return;

    const { type, source, destination } = message;
    return type === MESSAGE_TYPE.USER_MESSAGE_SENT ? source : destination;
  };

  const { data: program } = useProgram(getProgramId());

  return useSails(program?.codeId);
}

export { useMessageSails };
