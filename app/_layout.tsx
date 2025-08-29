import FloatingChatBot from "@/components/chatbot/FloatingChatBot";
import AppProvider from "@/context/AppProvider";
import { UserProvider } from "@/context/UserContext";
import store from "@/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useState } from "react";
import { Provider } from "react-redux";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [values, setValues] = useState({isDoctor: false});

  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <AppProvider values={{ values, setValues }}>
              <Stack screenOptions={{ headerShown: false }} />
            </AppProvider>
        </Provider>
      </QueryClientProvider>
    </UserProvider>
  );
}
