import { StyleSheet, Text, View } from "react-native";

export default function FavoritesScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Favorites</Text>
      <Text>Здесь позже появятся избранные товары.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F6F1',
  },
  title: {
    color: '#1E2E25',
    fontSize: 35,
    lineHeight: 41,
    fontWeight: '900',
  },
});