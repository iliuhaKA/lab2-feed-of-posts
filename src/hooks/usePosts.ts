import { getPosts } from "@/api/postsApi";
import { Post } from "@/types/posts";
import { useEffect, useState } from "react";


export function usePosts(page: number, pageSize: number) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        
        async function load(){
            setLoading(true);
            setError(null);

            try {
                const data = await getPosts(page, pageSize, controller.signal);
                if(data){
                    setPosts(data.posts);
                    setTotal(data.total);
                }
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

        load();

        return () => controller.abort();
    }, [page]);

    return {posts, total, error, loading};
}