import { GEAR_STORAGE_KEY } from 'consts';
import { PaginationModel } from 'types/common';
import { NotificationRPCModel, NotificationUnreadRPCModel } from 'types/notification';
import ServerRPCRequestService from './ServerRPCRequestService';

export default class NotificationsRequestService {
  apiRequest = new ServerRPCRequestService();

  protected readonly API_NOTIFIACTIONS_ALL = 'event.all';

  protected readonly API_MARK_AS_READ = 'event.read';

  protected readonly API_COUNT_UNREAD = 'event.countUnread';
    
  public fetchAllNotifications(params: PaginationModel): Promise<NotificationRPCModel> {
    return this.apiRequest.getResource(this.API_NOTIFIACTIONS_ALL, {...params}, {Authorization: `Bearer ${localStorage.getItem(GEAR_STORAGE_KEY)}`})
  }

  public fetchUnreadNotificationsCount(): Promise<NotificationUnreadRPCModel> {
    return this.apiRequest.getResource(this.API_COUNT_UNREAD, undefined, {Authorization: `Bearer ${localStorage.getItem(GEAR_STORAGE_KEY)}`})
  }

  public markAsReadNotifications(notificationIds: number[]): Promise<any> {
    return this.apiRequest.getResource(this.API_MARK_AS_READ, {
      ids: notificationIds
    }, {Authorization: `Bearer ${localStorage.getItem(GEAR_STORAGE_KEY)}`})
  }
}