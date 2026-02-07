import React, { useEffect } from 'react'
import { Toaster } from "react-hot-toast";
import { Navigate } from 'react-router-dom';
import AppRoutes from './AppRoutes.jsx';
import { useAuthStore } from '../store/authStore.js';
import {useChannelStore} from "../store/channelStore.js";
import PageLoader from './components/ui/PageLoader.jsx';

const App = () => {
  const authMe = useAuthStore((state) => state.authMe);
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked);
  const getMyChannel = useChannelStore((state) => state.getMyChannel);
  const isChannelChecked = useChannelStore((state) => state.isChannelChecked);
  const isAccountDeleted = useAuthStore((state) => state.isAccountDeleted);

  useEffect(() => {
    const init = async () => {
      await authMe();
      const {isAuthenticated} = useAuthStore.getState();

      if(isAuthenticated){
        await getMyChannel();
      }else {
        useChannelStore.setState({isChannelChecked:true});
      }
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if(isAccountDeleted){
    return <Navigate to="/" replace/>;
  }

  // Prevent hydration flash
  if (!isAuthChecked || !isChannelChecked) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950 text-white">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="relative w-screen min-h-screen text-white  bg-black">
      <div
        className="pointer-events-none absolute inset-0 z-0
        bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:18px_18px]"
      />
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          className: "toast-enter",
          style: {
            padding: "14px 22px",
            fontSize: "1rem",
            borderRadius: "6px",
            background: "rgba(30, 30, 30, 0.9)",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
            minWidth: "260px",
            textAlign: "center",
          },
          success: {
            className: "toast-enter",
            style: {
              background:
                "linear-gradient(to right, rgba(34,197,94,0.95), rgba(22,163,74,0.95))",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#16a34a",
            },
          },
          error: {
            className: "toast-enter",
            style: {
              background:
                "linear-gradient(to right, rgba(239,68,68,0.95), rgba(185,28,28,0.95))",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#dc2626",
            },
          },
        }}
      />

      <div className="relative z-10 w-full h-full">
        <AppRoutes />
      </div>
    </div>
  )
}
export default App;
