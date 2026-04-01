import {
  useGetAllMessageRequestsQuery,
  useGetAllMessageSentsQuery,
  useGetAllReplyRequestsQuery,
  useGetAllReplySentsQuery,
  useGetMessageRequestByIdQuery,
  useGetMessageSentByIdQuery,
  useGetReplyRequestByIdQuery,
  useGetReplySentByIdQuery,
} from './queries';
import type { MessageRequest, MessageSent, ReplyRequest, ReplySent } from './requests';

export type { MessageRequest, MessageSent, ReplyRequest, ReplySent };
export {
  useGetAllMessageRequestsQuery,
  useGetAllMessageSentsQuery,
  useGetAllReplyRequestsQuery,
  useGetAllReplySentsQuery,
  useGetMessageRequestByIdQuery,
  useGetMessageSentByIdQuery,
  useGetReplyRequestByIdQuery,
  useGetReplySentByIdQuery,
};
