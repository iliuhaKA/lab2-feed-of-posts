import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={{headerShown: false}}/>
      <Stack.Screen name='posts/[id]' options={{title: 'Подробности поста'}}/>
      <Stack.Screen name='add-post' options={{title: 'Добавление публикации'}}/>
    </Stack>
  )
}
