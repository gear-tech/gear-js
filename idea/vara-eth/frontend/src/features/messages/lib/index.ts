import { getDecodedPayload, getMessageName, getMessageRoute } from './decode';
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
import type { SailsMessageRoute } from './decode';
import type { MessageRequest, MessageSent, ReplyRequest, ReplySent } from './requests';

export type { MessageRequest, MessageSent, ReplyRequest, ReplySent, SailsMessageRoute };
export {
  getDecodedPayload,
  getMessageName,
  getMessageRoute,
  useGetAllMessageRequestsQuery,
  useGetAllMessageSentsQuery,
  useGetAllReplyRequestsQuery,
  useGetAllReplySentsQuery,
  useGetMessageRequestByIdQuery,
  useGetMessageSentByIdQuery,
  useGetReplyRequestByIdQuery,
  useGetReplySentByIdQuery,
};
