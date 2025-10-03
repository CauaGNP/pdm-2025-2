import axios from "axios";

const headerJson = {
  "Content-Type": "application/json",
};

const instance = axios.create({
  baseURL: "https://aos-2025-2-plum.vercel.app",
  timeout: 1000
});

export async function getTarefas() {
  const { data } = await instance.get("/task");
  return data?.data;
}

export async function updateTarefa(tarefa) {
  const { data } = await instance.put(
    `/task/${tarefa.id}`,
    { description: tarefa.descricao, finish: tarefa.concluida },
  );
  return data;
}

export async function addTarefa({ descricao }) {
  const { data } = await instance.post(
    `/task`,
    { description : descricao },
  );
  return data;
}

export async function deleteTarefa(tarefa) {
  const { data } = await instance.delete(`/task/${tarefa.id}`);
  return data;
}
