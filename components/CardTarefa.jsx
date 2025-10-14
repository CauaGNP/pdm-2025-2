import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Switch, Text } from 'react-native-paper';

export function CardTarefa({ tarefa, onToggle, onPress }) {
  const [disabled, setDisabled] = useState(false);
  const handlePress = () => {
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 5000);
    onPress(tarefa);
  };
  return (
    <View style={styles.card}>
      <View style={styles.descricaoContainer}>
        <Text variant="titleMedium">{tarefa.description}</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={tarefa.finish ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          value={tarefa.finish}
          onValueChange={() => onToggle(tarefa)}
        />
      </View>
      <View style={styles.descricaoContainer}>
        <View style={{ flex: 1 }} />
        <IconButton icon="delete" buttonColor="indianred" onPress={handlePress} disabled={disabled} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 100,
    padding: 5,
    margin: 5,
  },
  descricaoContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
