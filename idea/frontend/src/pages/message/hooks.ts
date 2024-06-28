import { MESSAGE_TYPE, Message } from '@/features/message';
import { useSails } from '@/features/sails';
import { useProgram } from '@/hooks';

function useMessageSails(message: Message | undefined) {
  const getProgramId = () => {
    if (!message) return;

    const { type, source, destination } = message;
    return type === MESSAGE_TYPE.USER_MESSAGE_SENT ? source : destination;
  };

  const { program } = useProgram(getProgramId());

  return useSails(program?.codeId);
}

export { useMessageSails };
