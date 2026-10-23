import { Post } from "@/types/posts";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  onSubmit: (post: Post) => void;
  onCancel: () => void;
};

export function NewPostForm({ onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});

  function handleSubmit() {
    const newErrors: { title?: string; body?: string } = {};
    if (!title.trim()) newErrors.title = 'Заголовок обязателен';
    if (!body.trim()) newErrors.body = 'Текст обязателен';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const newPost: Post = {
      id: 1,
      title: title || "Без названия",
      body: body || "",
      tags: tagsArray,
      reactions: { likes: 0, dislikes: 0 },
      views: 0,
      userId: 1,
    };

    onSubmit(newPost);
    setTitle("");
    setBody("");
    setTags("");
  }

  return (
    <View style={styles.form}>
      <TextInput
        placeholder="Заголовок"
        value={title}
        onChangeText={(t) => { setTitle(t); if (errors.title) setErrors(e => ({ ...e, title: undefined })); }}
        style={[styles.input, errors.title && styles.inputError]}
      />
      {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
      <TextInput
        placeholder="Текст поста"
        value={body}
        onChangeText={(t) => { setBody(t); if (errors.body) setErrors(e => ({ ...e, body: undefined })); }}
        style={[styles.input, styles.textarea, errors.body && styles.inputError]}
        multiline
        numberOfLines={4}
      />
      {errors.body ? <Text style={styles.errorText}>{errors.body}</Text> : null}
      <TextInput
        placeholder="Теги (через запятую)"
        value={tags}
        onChangeText={setTags}
        style={styles.input}
      />

      <View style={styles.actions}>
        <Pressable style={[styles.button, styles.cancel]} onPress={onCancel}>
          <Text style={styles.cancelText}>Отмена</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.submit]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Опубликовать</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7ECE4',
  },
  input: {
    height: 44,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E6EDE2',
    borderRadius: 8,
    backgroundColor: '#FAFBF9',
    marginBottom: 10,
  },
  textarea: {
    paddingTop: 14,
    height: 96,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#D66B51',
  },
  errorText: {
    color: '#D66B51',
    fontSize: 12,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  submit: {
    backgroundColor: '#26382D',
  },
  cancel: {
    backgroundColor: '#F0F3EE',
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cancelText: {
    color: '#55685A',
    fontWeight: '700',
  },
});
