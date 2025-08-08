import { Stack } from "expo-router";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { Provider } from "react-redux";
import store from '@/store/store';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
      <QueryClientProvider client={queryClient} >
        <Provider store={store}> 
          <Stack screenOptions={{ headerShown: false,}}/>
        </Provider>
      </QueryClientProvider>
  )
}
