import { Post, PostsResponse } from "@/types/posts";

const BASE_URL = 'https://dummyjson.com/posts';

export async function getPosts(page : number, pageSize: number, signal: AbortSignal) {
  const skip = (page - 1) * pageSize;
  const url = BASE_URL + '?limit=' + pageSize + '&skip=' + skip;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error('HTTP ' + response.status);
  }

  const data : PostsResponse = await response.json();

  if(signal.aborted) return;

  return data;
}

export async function getPost(id: string, signal: AbortSignal) {
  const url = BASE_URL + `/${id}`;
  const response = await fetch(url, {signal});

  if(!response.ok){
    throw new Error('HTTP ' + response.status);
  }

  const data : Post = await response.json();

  if(signal.aborted) return;

  return data;
}
