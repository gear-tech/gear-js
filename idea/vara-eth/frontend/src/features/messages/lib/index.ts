import {
  useGetMessageRequestByIdQuery,
  useGetMessageSentByIdQuery,
  useGetReplyRequestByIdQuery,
  useGetReplySentByIdQuery,
  useGetAllMessageRequestsQuery,
  useGetAllMessageSentsQuery,
  useGetAllReplyRequestsQuery,
  useGetAllReplySentsQuery,
} from './queries';
import { MessageRequest, MessageSent, ReplyRequest, ReplySent } from './requests';

export {
  useGetMessageRequestByIdQuery,
  useGetMessageSentByIdQuery,
  useGetReplyRequestByIdQuery,
  useGetReplySentByIdQuery,
  useGetAllMessageRequestsQuery,
  useGetAllMessageSentsQuery,
  useGetAllReplyRequestsQuery,
  useGetAllReplySentsQuery,
};
export type { MessageRequest, MessageSent, ReplyRequest, ReplySent };
