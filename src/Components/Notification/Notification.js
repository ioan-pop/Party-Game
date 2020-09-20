import React, { useState, useEffect } from 'react';
import styles from './Notification.module.css';

function Notification(props) {
    const [notification, setNotification] = useState({text: '', show: false});

    useEffect(() => {
        if(props.text) {
            setNotification({text: props.text, show: true});
        }
    }, [props]);

    useEffect(() => {
        if(notification.show) {
            setTimeout(() => {
                setNotification({text: notification.text, show: false});
            }, 2000);
        }
    }, [notification]);

    return (
        <div className={styles.notification + (notification.show ? ' ' + styles.activeNotification : '')}>
            {notification.text}
        </div>
    );
}

export default Notification;