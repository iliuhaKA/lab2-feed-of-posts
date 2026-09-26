import { Post } from "@/types/posts";
import { StyleSheet, Text, View } from "react-native";


type PostCardProps = {
    post: Post;
}

export function PostCard({post} : PostCardProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{post.title}</Text>
            <Text>{post.body}</Text>
            <Text>#{post.tags.join(' #')}</Text>
            <View style={styles.metrics}>
                <Text>Лайки: {post.reactions.likes}</Text>
                <Text>Дизлайки: {post.reactions.dislikes}</Text>
                <Text>Просмотры: {post.views}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
    flex: 1,
    gap: 6,
    padding: 12,
    borderWidth: 1,
    borderRadius: 14,
    justifyContent: 'center'
    },

    title: {
        color: '#29382F',
        fontSize: 19,
        fontWeight: '800'
    },
    metrics: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});