import React from 'react';

import { PAGE_TYPES } from 'consts';
import { NotificationModel } from 'types/notification';

import { PageHeader } from 'components/blocks/PageHeader';

import './NotificationInfo.scss';

type Props = {
    notification: NotificationModel;
    handleNotificationInfo: (notification: NotificationModel | null) => void;
}

const NotificationInfo = ({ notification, handleNotificationInfo }: Props) => {
    console.log(notification)
    const handleClose = () => {
        handleNotificationInfo(null);
    }

    const transformPayload = (payload: any) => {
        const result = [];
        for (const key of Object.keys(payload)) {
            result.push({
                [key]: payload[key]
            })
        }
        return result;
    }

    const transformedPayload = notification.payload ? transformPayload(JSON.parse(notification.payload)) : [];
    

    
    return (
        <div className="notification-info">
            <PageHeader programName={notification.type} handleClose={handleClose} pageType={PAGE_TYPES.NOTIFICATION_INFO}/>
            <div className="notification-info--content">
                {
                    transformedPayload && transformedPayload.length && transformedPayload.map((item: any) => (
                        <div className="notification-info--wrapper">
                            <div className="notification-info--content__key">{ Object.keys(item)[0] }</div>
                            <div className="notification-info--content__value">{ item[Object.keys(item)[0]] }</div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export { NotificationInfo };