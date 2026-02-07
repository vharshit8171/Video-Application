import { useAuthStore } from '../store/authStore.js';
import { useChannelStore } from '../store/channelStore.js';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ChannelOwnerRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const channel = useChannelStore((state) => state.channel);
  //User must be logged in - already checked by protected route
  //User must own a channel
  //Channel in store must exist
  //Both channel IDs must match

  if (!channel) {
    toast.error("You don't have a channel yet");
    return <Navigate to="/upload/create" />;
  }
  if (user.channel._id !== channel._id) {
    toast.error("You are not authorized to access this page");
    return <Navigate to="/home" replace />;
  }
  return children;
}

export default ChannelOwnerRoute