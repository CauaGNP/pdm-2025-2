import { addTarefa, deleteTarefa, getTarefas, updateTarefa } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ActivityIndicator, Button, MD2Colors, TextInput, List  } from "react-native-paper";
import { CardTarefa } from "../components/CardTarefa";

export default function TelaTarefas() {
  const [descricao, setDescricao] = useState("");
  const queryClient = useQueryClient();
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["tarefas"],
    queryFn: getTarefas,
  });

  const updateMutation = useMutation({
    mutationFn: updateTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
    },
  });

  const addMutation = useMutation({
    mutationFn: addTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
      setDescricao("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
    },
  });

  const handleAdd = () => {
    if (!descricao.trim()) {
      Alert.alert("Atenção", "A descrição não pode estar vazia");
      return;
    }
    addMutation.mutate({ descricao });
  };

  function handleToggle(tarefa) {
    console.log("toggle executado", tarefa);
    updateMutation.mutate({
      ...tarefa,
      concluida: !tarefa.finish,
    });
  }

  function handleDelete(tarefa) {
    deleteMutation.mutate(tarefa);
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputView}>
        <TextInput
          mode="outlined"
          outlineStyle={{borderWidth : 0.5}}
          style={styles.input}
          label="Descrição"
          value={descricao}
          onChangeText={setDescricao}
        />
        <Button onPress={handleAdd} style={styles.button}>Add</Button>
      </View>
      <FlatList
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={styles.list}
        data={data}
        keyExtractor={(item) => item.objectId}
        renderItem={({ item }) => (
          <CardTarefa
            tarefa={item}
            onToggle={handleToggle}
            onPress={handleDelete}
          />
        )}
      />
      {(isPending || error || isFetching) && (
        <View style={styles.statusbar}>
          {isPending || isFetching && <ActivityIndicator animating={true} color={MD2Colors.purple400} size="large"/>}
          {error && <Text>Erro: {error.message}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 30,
  },
  statusbar: {
    position : "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  list: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "80%",
    padding: 5,
  },
  button: {
    width: 50,  
    height: 50, 
    justifyContent: "center", 
    alignItems: "center",
  },
  inputView: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
  },
});
