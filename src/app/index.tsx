import { PostCard } from "@/components/PostCard";
import { Post, PostsResponse } from "@/types/posts";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PAGE_SIZE = 10;

export default function PostsScreen(){

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPosts() {
      setLoading(true);
      setError(null);

      const skip = (page - 1) * PAGE_SIZE;

      try {
        const response = await fetch(
          `https://dummyjson.com/posts?limit=${PAGE_SIZE}&skip=${skip}`,
          { signal: controller.signal},
        );

        if(!response.ok){
          throw new Error(`HTTP error: ${response.status}`);
        };

        const data: PostsResponse = await response.json();

        if(controller.signal.aborted) return;

        setPosts(data.posts);
        setTotal(data.total);
      }
      catch(e) {
        if(e instanceof Error && e.name === 'AbortError') return;
        if(controller.signal.aborted) return;
        
        setError('Не удалось загрузить ленту постов');
      }
      finally {
        if(!controller.signal.aborted){
          setLoading(false);
        }
      }
    }

    loadPosts();

    return () => controller.abort();
  }, [page]);


  return (
    <SafeAreaView style={styles.screen}>
      {loading && <ActivityIndicator size='large'/>}

      {!loading && error && (
        <Text style={styles.error}>Ошибка: {error}</Text>
      )}

      {!loading && !error && (
      <FlatList<Post>
      data={posts}
      renderItem={({item}) => <PostCard post={item}/>}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>Лента идей</Text>
          <Text>Всего постов на сервере: {total}</Text>
        </View>
      } 
      ListEmptyComponent={
        !loading && !error ? (
          <View>
            <Text>Список постов пуст!</Text>
          </View>
        ): null
      }
      ListFooterComponent={
        totalPages > 0 ? (
          <View style={styles.pagination}>
            <Pressable
            disabled={page <= 1 || loading}
            onPress={() => {setPage(p => Math.max(1, p - 1))}}
            style={styles.button}
            >
              <Text>← Назад</Text>
            </Pressable>
            <Text>{page} / {totalPages || 1}</Text>
            <Pressable
            disabled={page >= totalPages || loading}
            onPress={() => {setPage(p => p + 1)}}
            style={styles.button}
            >
              <Text>Далее →</Text>
            </Pressable>
          </View>
        ): null
      }
      />
      )}
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F6F1'
  },
  error: {
    color: 'red',
    fontSize: 24
  },
  title: {
    color: '#1E2E25',
    fontSize: 35,
    lineHeight: 41,
    fontWeight: '900',
    alignSelf: 'center'
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8E0',
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  
});