# ShowMessage Component

Một component hiển thị thông báo toast tùy chỉnh cho React Native với animation mượt mà và nhiều loại thông báo.

## Tính năng

- ✅ 4 loại thông báo: success, error, warning, info
- ✅ Animation mượt mà với React Native Animated
- ✅ Tự động ẩn sau thời gian tùy chỉnh
- ✅ Có thể nhấn để thực hiện hành động
- ✅ Nút đóng thủ công
- ✅ Hook `useShowMessage` tiện lợi
- ✅ TypeScript support hoàn chỉnh

## Cài đặt

Component đã được tạo sẵn trong dự án tại:

- `components/showMessage/ShowMessage.tsx`
- `hooks/useShowMessage.ts`

## Sử dụng cơ bản

### 1. Import hook và component

```tsx
import React from "react";
import { View } from "react-native";
import ShowMessage from "../components/showMessage/ShowMessage";
import { useShowMessage } from "../hooks/useShowMessage";

export const MyScreen = () => {
  const {
    visible,
    toastData,
    hideMessage,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  } = useShowMessage();

  return (
    <View>
      {/* Nội dung screen của bạn */}

      {/* ShowMessage component */}
      {toastData && (
        <ShowMessage
          visible={visible}
          type={toastData.type}
          title={toastData.title}
          message={toastData.message}
          duration={toastData.duration}
          onHide={hideMessage}
          onPress={toastData.onPress}
        />
      )}
    </View>
  );
};
```

### 2. Sử dụng các hàm shortcut

```tsx
// Thông báo thành công
showSuccess("Đăng nhập thành công!", "Chào mừng");

// Thông báo lỗi
showError("Có lỗi xảy ra!", "Lỗi");

// Thông báo cảnh báo
showWarning("Cảnh báo!", "Chú ý");

// Thông báo thông tin
showInfo("Thông tin mới!", "Thông báo");
```

### 3. Sử dụng với options tùy chỉnh

```tsx
const handleBooking = async () => {
  try {
    await bookAppointmentAPI();
    showMessage({
      type: "success",
      title: "Đặt lịch thành công",
      message: "Bạn đã đặt lịch khám thành công!",
      duration: 5000, // 5 giây
      onPress: () => {
        // Navigate đến chi tiết lịch hẹn
        navigation.navigate("AppointmentDetail");
      },
    });
  } catch (error) {
    showMessage({
      type: "error",
      title: "Đặt lịch thất bại",
      message: "Vui lòng thử lại sau!",
      duration: 0, // Không tự động ẩn
    });
  }
};
```

## API Reference

### ShowMessage Props

| Prop       | Type                                        | Default   | Mô tả                                           |
| ---------- | ------------------------------------------- | --------- | ----------------------------------------------- |
| `visible`  | boolean                                     | required  | Hiển thị/ẩn thông báo                           |
| `type`     | 'success' \| 'error' \| 'warning' \| 'info' | 'info'    | Loại thông báo                                  |
| `title`    | string                                      | undefined | Tiêu đề thông báo                               |
| `message`  | string                                      | required  | Nội dung thông báo                              |
| `duration` | number                                      | 3000      | Thời gian tự động ẩn (ms), 0 = không tự động ẩn |
| `onHide`   | () => void                                  | required  | Callback khi ẩn thông báo                       |
| `onPress`  | () => void                                  | undefined | Callback khi nhấn vào thông báo                 |

### useShowMessage Hook

#### Returns:

```tsx
{
  // State
  visible: boolean;
  toastData: ToastMessage | null;

  // Actions
  showMessage: (data: ToastMessage) => void;
  hideMessage: () => void;

  // Shortcuts
  showSuccess: (message: string, title?: string, options?: Partial<ToastMessage>) => void;
  showError: (message: string, title?: string, options?: Partial<ToastMessage>) => void;
  showWarning: (message: string, title?: string, options?: Partial<ToastMessage>) => void;
  showInfo: (message: string, title?: string, options?: Partial<ToastMessage>) => void;
}
```

#### ToastMessage Interface:

```tsx
interface ToastMessage {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  duration?: number;
  onPress?: () => void;
}
```

## Ví dụ sử dụng trong thực tế

### Đăng nhập

```tsx
const handleLogin = async (email: string, password: string) => {
  try {
    const user = await loginAPI(email, password);
    showSuccess(`Chào mừng ${user.name}!`, "Đăng nhập thành công");
  } catch (error) {
    showError("Email hoặc mật khẩu không đúng!", "Đăng nhập thất bại");
  }
};
```

### Đặt lịch khám

```tsx
const handleBookAppointment = async (doctorId: string, date: string) => {
  try {
    const appointment = await bookAppointmentAPI(doctorId, date);
    showSuccess("Lịch khám đã được đặt thành công!", "Hoàn tất", {
      duration: 5000,
      onPress: () => navigation.navigate("Appointment", { id: appointment.id }),
    });
  } catch (error) {
    showError("Không thể đặt lịch khám. Vui lòng thử lại!", "Lỗi");
  }
};
```

### Cập nhật thông tin

```tsx
const handleUpdateProfile = async (data: ProfileData) => {
  try {
    await updateProfileAPI(data);
    showSuccess("Thông tin đã được cập nhật!", "Thành công");
  } catch (error) {
    showWarning(
      "Một số thông tin chưa được lưu. Vui lòng kiểm tra lại!",
      "Cảnh báo"
    );
  }
};
```

## Customization

Bạn có thể tùy chỉnh màu sắc và style trong file `ShowMessage.tsx`:

```tsx
// Trong hàm getConfig()
case 'success':
  return {
    backgroundColor: '#4CAF50', // Màu xanh lá
    iconName: 'checkmark-circle-outline',
    iconColor: '#fff',
  };
```

## Notes

- Component sử dụng `position: 'absolute'` để hiển thị overlay
- Animation sử dụng `useNativeDriver: true` để performance tốt hơn
- Hook `useShowMessage` quản lý state độc lập cho mỗi component sử dụng
- Thông báo sẽ hiển thị ở top của màn hình với `zIndex: 9999`
