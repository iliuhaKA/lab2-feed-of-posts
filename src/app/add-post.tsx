import { NewPostForm } from "@/components/NewPostForm";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function AddPostScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Text style={styles.eyebrow}>ДОБРОЕ МЕСТО</Text>
                    <Text style={styles.title}>Новая публикация</Text>
                    <Text style={styles.subtitle}>
                        Поделитесь с сообществом своей историей, мыслью или находкой.
                    </Text>
                </View>
                <NewPostForm
                    onCancel={() => router.back()}
                    onSubmit={(post) => {
                        router.back();
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F3F6F1',
    },
    content: {
        flexGrow: 1,
        width: '100%',
        maxWidth: 680,
        alignSelf: 'center',
        padding: 18,
    },
    header: {
        paddingTop: 16,
        paddingBottom: 8,
    },
    eyebrow: {
        color: '#6F896A',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.2,
    },
    title: {
        marginTop: 12,
        color: '#1E2E25',
        fontSize: 30,
        lineHeight: 37,
        fontWeight: '900',
    },
    subtitle: {
        marginTop: 7,
        color: '#738078',
        fontSize: 14,
        lineHeight: 21,
    },
});