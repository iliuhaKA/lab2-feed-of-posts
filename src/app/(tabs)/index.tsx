import { PostCard } from "@/components/PostCard";
import { Post, PostsResponse } from "@/types/posts";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PAGE_SIZE = 10;

export default function PostsScreen(){

  const [posts, setPosts] = useState<Post[]>([]);
  const [localPosts, setLocalPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState(0);

  const [visibilPosts, setVisibilPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const router = useRouter();

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
  
  
  useEffect(() => {
    setVisibilPosts([
      ...localPosts,
      ...posts
      ]);
  }, [posts, localPosts]);

  useEffect(() => {
    const q = searchQuery.trim().toLocaleLowerCase();

    const source = [...localPosts, ...posts];

    if(!q) {
      setVisibilPosts(source);
      return;
    };

    const filteredPosts = source.filter((post) => {
      return post.title.toLocaleLowerCase().includes(q) ||
        post.body.toLocaleLowerCase().includes(q)       ||
        post.tags.some((tag) => tag.toLocaleLowerCase().includes(q));
    });

    setVisibilPosts(filteredPosts);

  }, [searchQuery]);


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

      {!loading && !error && (
      <FlatList<Post>
      data={visibilPosts}
      renderItem={({item}) => <PostCard post={item}/>}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.brandMark}><View style={styles.brandMarkInner} /></View>
            <Text style={styles.brand}>ДОБРОЕ МЕСТО</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>ОНЛАЙН</Text>
            </View>
            <Pressable
              style={styles.addButton}
              onPress={() => router.navigate('/add-post')}
              accessibilityRole="button"
              accessibilityLabel="Добавить пост"
            >
              <Text style={styles.addButtonText}>＋</Text>
            </Pressable>
          </View>
          <Text style={styles.title}>Лента<Text style={styles.titleAccent}> идей.</Text></Text>
          <Text style={styles.subtitle}>Истории, мысли и находки сообщества</Text>
          <View style={styles.feedMeta}>
            <Text style={styles.feedMetaLabel}>СЕГОДНЯ В ЛЕНТЕ</Text>
            <View style={styles.totalBadge}>
              <Text style={styles.totalText}>{(total + localPosts.length).toLocaleString()} публикаций</Text>
            </View>
          </View>
          <View>
            <TextInput
              placeholder="Поиск по ленте..."
              style={styles.searchInput}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      } 
      ListEmptyComponent={
        !loading && !error ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Пока тихо</Text>
            <Text style={styles.emptyText}>Новые публикации появятся здесь.</Text>
          </View>
        ): null
      }
      ListFooterComponent={
        totalPages > 0 ? (
          <View style={styles.pagination}>
            <Pressable
            style={[styles.pageButton, page <= 1 && styles.pageButtonDisabled]}
            disabled={page <= 1 || loading}
            onPress={() => {setPage(p => Math.max(1, p - 1))}}
            accessibilityRole="button"
            accessibilityLabel="Предыдущая страница"
            >
              <Text style={[styles.pageButtonText, page <= 1 && styles.pageButtonTextDisabled]}>← Назад</Text>
            </Pressable>
            <View style={styles.pageIndicator}>
              <Text style={styles.pageNumber}>{String(page).padStart(2, '0')}</Text>
              <Text style={styles.pageDivider}>/</Text>
              <Text style={styles.pageCount}>{String(totalPages || 1).padStart(2, '0')}</Text>
            </View>
            <Pressable
            style={[styles.pageButton, styles.nextButton, page >= totalPages && styles.pageButtonDisabled]}
            disabled={page >= totalPages || loading}
            onPress={() => {setPage(p => p + 1)}}
            accessibilityRole="button"
            accessibilityLabel="Следующая страница"
            >
              <Text style={[styles.pageButtonText, styles.nextButtonText, page >= totalPages && styles.pageButtonTextDisabled]}>Далее →</Text>
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
    backgroundColor: '#F3F6F1',
  },
  list: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingBottom: 28,
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
  header: {
    paddingTop: 17,
    paddingBottom: 22,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 27,
  },
  brandMark: {
    width: 27,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: '#DDF078',
  },
  brandMarkInner: {
    width: 9,
    height: 9,
    borderRadius: 3,
    backgroundColor: '#26362D',
    transform: [{ rotate: '45deg' }],
  },
  brand: {
    flex: 1,
    marginLeft: 9,
    color: '#5D6B61',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#E7EFE3',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6F9A69',
  },
  liveText: {
    color: '#587452',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    color: '#1E2E25',
    fontSize: 35,
    lineHeight: 41,
    fontWeight: '900',
  },
  titleAccent: {
    color: '#D66F53',
  },
  subtitle: {
    marginTop: 5,
    color: '#738078',
    fontSize: 14,
    lineHeight: 20,
  },
  feedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E2E8E0',
  },
  feedMetaLabel: {
    color: '#758178',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  totalBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#E6ECD8',
  },
  totalText: {
    color: '#536A45',
    fontSize: 10,
    fontWeight: '700',
  },
  searchInput: {
    marginTop: 20,
    paddingHorizontal: 14,
    height: 42,
    borderWidth: 1,
    borderColor: '#DCE4D9',
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 42,
  },
  emptyTitle: {
    color: '#29382F',
    fontSize: 18,
    fontWeight: '800',
  },
  emptyText: {
    marginTop: 6,
    color: '#7C887F',
    fontSize: 13,
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
  pageButton: {
    minHeight: 42,
    justifyContent: 'center',
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: '#DCE4D9',
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
  },
  nextButton: {
    borderColor: '#26382D',
    backgroundColor: '#26382D',
  },
  pageButtonDisabled: {
    borderColor: '#E7EBE5',
    backgroundColor: '#F0F3EE',
  },
  pageButtonText: {
    color: '#405247',
    fontSize: 12,
    fontWeight: '700',
  },
  nextButtonText: {
    color: '#F7F9F5',
  },
  pageButtonTextDisabled: {
    color: '#AAB2AA',
  },
  pageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  pageNumber: {
    color: '#29382F',
    fontSize: 15,
    fontWeight: '800',
  },
  pageDivider: {
    color: '#A1AAA2',
    fontSize: 13,
  },
  pageCount: {
    color: '#879188',
    fontSize: 13,
    fontWeight: '600',
  },
  addButton: {
    marginLeft: 10,
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#26382D',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 22,
    fontWeight: '700',
  },
});