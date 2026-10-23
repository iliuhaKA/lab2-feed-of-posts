import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen name='index' options={{headerShown: false, title: 'Посты'}}/>
            <Tabs.Screen name='favorites' options={{title: 'Лайкнутые'}}/>
        </Tabs>
    )
}
