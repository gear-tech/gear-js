import React from "react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "store/reducers";
import { markRecentNotificationsAsReadAction } from "store/actions/actions";
import { SocketService } from "services/SocketService";
import { formatDate } from 'helpers';

import { CloseIcon } from "Icons";

import './RecentNotifications.scss';

type Props = {
    socketService: SocketService
}

const RecentNotifications = ({ socketService }: Props) => {

    const dispatch = useDispatch();
    const { recent } = useSelector((state: RootState) => state.notifications);

    const handleNotificationClose = (id: string) => {
        socketService.readNotifications(id);
        dispatch(markRecentNotificationsAsReadAction(id));
    }

    return (
        <div className="notifications-recent">
            <div className="notifications-recent--list">
                {
                    recent && recent.length && recent.map((item, index) => (
                        <div className="notification-recent" style={{zIndex: (200 - index)}}>
                            <button className="notification-recent__close" type="button" onClick={() => handleNotificationClose(item.id)}>
                                <CloseIcon color="#858585"/>
                            </button>
                            <span className="notification-recent__type"><div className={clsx("dot", item.type === "InitFailure" && "warning")}/>{item.type}</span>
                            <span className="notification-recent__program">{item.program}</span>
                            <span className="notification-recent__date">{ formatDate(item.date) }</span>
                        </div>
                    )) || null
                }
            </div>
        </div>
)}

export { RecentNotifications };