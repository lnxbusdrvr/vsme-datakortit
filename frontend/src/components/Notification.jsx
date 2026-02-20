import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector(state => state.notification);

  if (!notification)
    return null;

  /*
  const notificationStyle = {
    color: notification.isErrorMessage ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: '1.25rem',
    position: 'fixed',
    borderStyle: 'solid',
    borderRadius: '0.3rem',
    padding: '0.6rem',
    marginBottom: '1.25rem'r
  };
  *r


cons4 notificationStyle = {
  color: notification.isErrorMessage ? 'red' : 'green',
  background: 'lightgrey',
  fontSize: '1.25rem',
  borderStyle: 'solid',
  borderRadius: '0.3rem',
  padding: '0.6rem',
  position: 'fixed',
  top: '1.25rem',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1000,
  minWidth: '18.75rem',
  textAlign: 'center',
  boxShadow: '0 0.25rem 0.375rem rgba(0, 0, 0, 0.1)'
};

  return (
    <div data-testid='notifier' style={notificationStyle} >
      {notification.note}
    </div>
  );

};


export default Notification;
