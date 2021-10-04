export interface NotificationModel {
  id: string;
  type: string;
  date: string;
  isRead: boolean;
  payload?: string;
  destinationId: number;
  programHash: number;
}

export interface RecentNotificationModel {
  id: string;
  date: string;
  dest: string;
  program: string;
  type: string;
}

export interface NotificationPaginationModel {
  count: number;
  events: NotificationModel[];
}

export interface NotificationState {
  notifications: NotificationModel[] | null;
  recent: RecentNotificationModel[];
  countUnread: number | null;
  count: number | null;
  loading: boolean;
  error: null | string;
}

export interface NotificationUnreadRPCModel {
  jsonrpc: string;
  id: string;
  result: number;
}

export enum NotificationActionTypes {
  FETCH_NOTIFICATIONS = 'FETCH_NOTIFICATIONS',
  FETCH_NOTIFICATIONS_SUCCESS = 'FETCH_NOTIFICATIONS_SUCCESS',
  FETCH_NOTIFICATIONS_ERROR = 'FETCH_NOTIFICATIONS_ERROR',
  FETCH_RECENT_NOTIFICATION = 'FETCH_RECENT_NOTIFICATION',
  FETCH_NOTIFICATIONS_COUNT = 'FETCH_NOTIFICATIONS_COUNT',
  FETCH_NOTIFICATIONS_COUNT_SUCCESS = 'FETCH_NOTIFICATIONS_COUNT_SUCCESS',
  FETCH_NOTIFICATIONS_COUNT_ERROR = 'FETCH_NOTIFICATIONS_COUNT_ERROR',
  MARK_AS_READ_RECENT = 'MARK_AS_READ_RECENT',
  MARK_AS_READ_ALL_RECENT = 'MARK_AS_READ_ALL_RECENT',
  MARK_AS_READ_CERTAIN_RECENT = 'MARK_AS_READ_CERTAIN_RECENT',
  RESET_NOTIFICATIONS = 'RESET_NOTIFICATIONS',
}

interface FetchNotificationsAction {
  type: NotificationActionTypes.FETCH_NOTIFICATIONS;
}

interface FetchNotificationsSuccessAction {
  type: NotificationActionTypes.FETCH_NOTIFICATIONS_SUCCESS;
  payload: NotificationPaginationModel;
}

interface FetchNotificationsErrorAction {
  type: NotificationActionTypes.FETCH_NOTIFICATIONS_ERROR;
  payload: string;
}

interface FetchUnreadNotificationsCountAction {
  type: NotificationActionTypes.FETCH_NOTIFICATIONS_COUNT;
}

interface FetchUnreadNotificationsCountSuccessAction {
  type: NotificationActionTypes.FETCH_NOTIFICATIONS_COUNT_SUCCESS;
  payload: number;
}

interface FetchUnreadNotificationsCountErrorAction {
  type: NotificationActionTypes.FETCH_NOTIFICATIONS_COUNT_ERROR;
  payload: string;
}

interface MarkAsReadRecentAction {
  type: NotificationActionTypes.MARK_AS_READ_RECENT;
  payload: string;
}

interface MarkAsReadAllRecentAction {
  type: NotificationActionTypes.MARK_AS_READ_ALL_RECENT;
}

interface MarkAsReadCertainRecentAction {
  type: NotificationActionTypes.MARK_AS_READ_CERTAIN_RECENT;
  payload: string[];
}

interface FetchRecentNotificationAction {
  type: NotificationActionTypes.FETCH_RECENT_NOTIFICATION;
  payload: RecentNotificationModel;
}

interface ResetNotificationsAction {
  type: NotificationActionTypes.RESET_NOTIFICATIONS;
}

export type NotificationAction =
  | FetchNotificationsAction
  | FetchNotificationsSuccessAction
  | FetchNotificationsErrorAction
  | FetchUnreadNotificationsCountAction
  | FetchUnreadNotificationsCountSuccessAction
  | FetchUnreadNotificationsCountErrorAction
  | MarkAsReadRecentAction
  | MarkAsReadAllRecentAction
  | MarkAsReadCertainRecentAction
  | FetchRecentNotificationAction
  | ResetNotificationsAction;
