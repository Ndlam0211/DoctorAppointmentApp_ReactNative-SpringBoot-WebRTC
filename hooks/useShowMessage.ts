import { useCallback, useState } from "react";

export interface ToastMessage {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  duration?: number;
  onPress?: () => void;
}

export const useShowMessage = () => {
  const [toastData, setToastData] = useState<ToastMessage | null>(null);
  const [visible, setVisible] = useState(false);

  const showMessage = useCallback((data: ToastMessage) => {
    setToastData(data);
    setVisible(true);
  }, []);

  const hideMessage = useCallback(() => {
    setVisible(false);
    // Delay để hoàn thành animation trước khi clear data
    setTimeout(() => {
      setToastData(null);
    }, 300);
  }, []);

  // Shortcuts cho các loại message thông dụng
  const showSuccess = useCallback(
    (message: string, title?: string, options?: Partial<ToastMessage>) => {
      showMessage({
        type: "success",
        title,
        message,
        duration: 3000,
        ...options,
      });
    },
    [showMessage]
  );

  const showError = useCallback(
    (message: string, title?: string, options?: Partial<ToastMessage>) => {
      showMessage({
        type: "error",
        title,
        message,
        duration: 4000,
        ...options,
      });
    },
    [showMessage]
  );

  const showWarning = useCallback(
    (message: string, title?: string, options?: Partial<ToastMessage>) => {
      showMessage({
        type: "warning",
        title,
        message,
        duration: 3500,
        ...options,
      });
    },
    [showMessage]
  );

  const showInfo = useCallback(
    (message: string, title?: string, options?: Partial<ToastMessage>) => {
      showMessage({
        type: "info",
        title,
        message,
        duration: 3000,
        ...options,
      });
    },
    [showMessage]
  );

  return {
    // State
    visible,
    toastData,

    // Actions
    showMessage,
    hideMessage,

    // Shortcuts
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
