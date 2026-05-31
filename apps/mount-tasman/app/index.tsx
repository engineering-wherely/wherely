import { Alert, StyleSheet, View } from "react-native";
import MapArtisan from "./MapArtisan";

export default function Index() {
  const mapPressHandler = (coordinates: [number, number]) => {
    Alert.alert(
      "Map press",
      `You pressed at position ${coordinates[0]}/${coordinates[1]}`
    );
  };

  return (
    <View style={styles.container}>
      <MapArtisan onMapPress={mapPressHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
