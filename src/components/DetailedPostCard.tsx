import { Post } from "@/types/posts";
import { StyleSheet, Text, View } from "react-native";

type PostCardProps = {
    post: Post;
}

const avatarColors = ['#DDF078', '#F5A08A', '#A9D5CB', '#F4CF73'];

export function DetailedPostCard({ post }: PostCardProps) {
    const avatarColor = avatarColors[post.userId % avatarColors.length];

    return (
        <View style={styles.card}>
            <View style={styles.authorRow}>
                <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
                    <Text style={styles.avatarText}>{post.userId}</Text>
                </View>
                <View style={styles.authorInfo}>
                    <Text style={styles.authorName}>Автор публикации</Text>
                    <Text style={styles.authorMeta}>Участник сообщества</Text>
                </View>
                <View style={styles.postMark}>
                    <View style={styles.postMarkDot} />
                    <Text style={styles.postMarkText}>ПОСТ</Text>
                </View>
            </View>

            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.body}>{post.body}</Text>

            {post.tags.length > 0 && (
                <View style={styles.tags}>
                    {post.tags.slice(0, 3).map((tag) => (
                        <View key={tag} style={styles.tag}>
                            <Text style={styles.tagText}># {tag}</Text>
                        </View>
                    ))}
                </View>
            )}

            <View style={styles.divider} />
            <View style={styles.metrics}>
                <View style={styles.metric}>
                    <Text style={styles.metricValue}>{post.reactions.likes.toLocaleString()}</Text>
                    <Text style={styles.metricLabel}>НРАВИТСЯ</Text>
                </View>
                <View style={styles.metric}>
                    <Text style={styles.metricValue}>{post.reactions.dislikes.toLocaleString()}</Text>
                    <Text style={styles.metricLabel}>НЕ НРАВИТСЯ</Text>
                </View>
                <View style={[styles.metric, styles.viewsMetric]}>
                    <Text style={styles.metricValue}>{post.views.toLocaleString()}</Text>
                    <Text style={styles.metricLabel}>ПРОСМОТРЫ</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flexGrow: 1,
        padding: 22,
        borderWidth: 0,
        backgroundColor: '#FFFFFF',
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 17,
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#26362D',
        fontSize: 14,
        fontWeight: '800',
    },
    authorInfo: {
        flex: 1,
        marginLeft: 11,
    },
    authorName: {
        color: '#24342B',
        fontSize: 13,
        fontWeight: '700',
    },
    authorMeta: {
        marginTop: 3,
        color: '#8A958D',
        fontSize: 11,
    },
    postMark: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 9,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#F3F6F1',
    },
    postMarkDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#76A47B',
    },
    postMarkText: {
        color: '#5D6E61',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    title: {
        color: '#1D2C24',
        fontSize: 19,
        lineHeight: 25,
        fontWeight: '800',
    },
    body: {
        marginTop: 8,
        color: '#657169',
        fontSize: 14,
        lineHeight: 21,
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 7,
        marginTop: 15,
    },
    tag: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#F0F5E8',
    },
    tagText: {
        color: '#557045',
        fontSize: 11,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        marginTop: 'auto',
        marginBottom: 13,
        backgroundColor: '#EDF0EC',
    },
    metrics: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metric: {
        flex: 1,
        gap: 3,
    },
    viewsMetric: {
        alignItems: 'flex-end',
    },
    metricValue: {
        color: '#2C3B32',
        fontSize: 13,
        fontWeight: '800',
    },
    metricLabel: {
        color: '#98A198',
        fontSize: 8,
        fontWeight: '700',
        letterSpacing: 0.4,
    }
});