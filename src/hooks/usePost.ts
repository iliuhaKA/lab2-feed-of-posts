import { getPost } from "@/api/postsApi";
import { Post } from "@/types/posts";
import { useEffect, useState } from "react";


export function usePost(id: string) {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        
        async function load(){
            setLoading(true);
            setError(null);

            try {
                const data = await getPost(id, controller.signal);
                if(data)
                    setPost(data);
            }
            catch(e) {
                if(e instanceof Error && e.name === 'AbortError') return;
                if(controller.signal.aborted) return;
                
                setError('Не удалось загрузить пост');
            }
            finally {
                if(!controller.signal.aborted){
                setLoading(false);
                }
            }
        }

        load();

        return () => controller.abort();
    }, [id]);

    return {post, loading, error};
}