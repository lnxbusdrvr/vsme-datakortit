import { useSelector } from 'react-redux;'

const Notification = () => {
  const notifications = useSelector(state => state.notification);

  if (!notification)
    return null;

  // TODO:
  // move to styles-file
  const notificationStyle = {
    color: notification.isErrorMessage ? 'red' : 'green',
    background: lightgrey,
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return (
    <div data-testid='notifier' style={notificationStyle} >
      {notification.note}
    </div>
  );

};
