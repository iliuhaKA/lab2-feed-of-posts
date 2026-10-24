import { DetailedPostCard } from "@/components/DetailedPostCard";
import { usePost } from "@/hooks/usePost";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function DetailedPostScreen() {

    const { id } = useLocalSearchParams<{id: string}>();

    const { post, loading, error } = usePost(id);


    return (
        <SafeAreaView style={styles.screen}>
            {loading && (
                <View style={styles.loading}>
                    <ActivityIndicator size='large' color='#557A55' />
                    <Text style={styles.loadingText}>Собираем свежие публикации</Text>
                </View>
            )}
        
            {!loading && error && (
                <View style={styles.errorState}>
                    <Text style={styles.errorEyebrow}>ЧТО-ТО ПОШЛО НЕ ТАК</Text>
                    <Text style={styles.error}>{error}</Text>
                </View>
            )}

            {!loading && !error && !post && (
                <View style={styles.errorState}>
                    <Text style={styles.errorEyebrow}>ПОСТ НЕ НАЙДЕН</Text>
                    <Text style={styles.error}>Не удалось найти эту публикацию</Text>
                </View>
            )}
        
            {!loading && !error && post && (
                <ScrollView
                    style={styles.postScroll}
                    contentContainerStyle={styles.postContent}
                >
                    <DetailedPostCard post={post}/>
                </ScrollView>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F6F1',
  },
  postContent: {
    flexGrow: 1,
  },
  postScroll: {
    flex: 1,
  },
    loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  loadingText: {
    color: '#738078',
    fontSize: 14,
    fontWeight: '600',
  },
    errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  errorEyebrow: {
    marginBottom: 10,
    color: '#D66B51',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  error: {
    color: '#29382F',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 26,
  },
});