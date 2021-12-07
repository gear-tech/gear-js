import { PaginationModel } from 'types/common';
import { NotificationPaginationModel } from 'types/notification';
import ServerRPCRequestService from './ServerRPCRequestService';

export default class NotificationsRequestService {
  apiRequest = new ServerRPCRequestService();

  protected readonly API_NOTIFIACTIONS_ALL = 'event.all';

  protected readonly API_MARK_AS_READ = 'event.read';

  protected readonly API_COUNT_UNREAD = 'event.countUnread';

  public fetchAllNotifications(params: PaginationModel) {
    return this.apiRequest.callRPC<NotificationPaginationModel>(this.API_NOTIFIACTIONS_ALL, { ...params });
  }

  public fetchUnreadNotificationsCount() {
    return this.apiRequest.callRPC<number>(this.API_COUNT_UNREAD, undefined, {});
  }

  public markAsReadNotifications(notificationIds: number[]): Promise<any> {
    return this.apiRequest.getResource(this.API_MARK_AS_READ, {
      ids: notificationIds,
    });
  }
}
