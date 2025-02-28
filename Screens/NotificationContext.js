import React, { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Hàm lưu thông báo mới
  const saveNotification = (message) => {
    setNotifications((prev) => [...prev, { id: Date.now(), message }]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, saveNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook để sử dụng thông báo
export const useNotifications = () => useContext(NotificationContext);
