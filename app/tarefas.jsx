import { addTarefa, deleteTarefa, getTarefas, updateTarefa } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
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
          style={styles}
          placeholder="Descrição"
          value={descricao}
          onChangeText={setDescricao}
        />
        <Button title="ADD" onPress={handleAdd} />
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
          {isPending && <Text>Carregando...</Text>}
          {error && <Text>Erro: {error.message}</Text>}
          {isFetching && <Text>Atualizando...</Text>}
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
    backgroundColor: "yellow",
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 5,
  },
  inputView: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    borderColor: "black",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
  },
});
