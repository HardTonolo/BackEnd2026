import express from "express";
import cors from "cors";
import usuarioRoutes from "./routes/usuarioRoutes";
import clienteRoutes from "./routes/clienteRoutes";
import veiculoRoutes from "./routes/veiculoRoutes";
import orcamentoRoutes from "./routes/orcamentoRoutes";
import enderecoRoutes from "./routes/enderecoRoutes";
import departamentoRoutes from "./routes/departamentoRoutes";
import authRoutes from "./routes/authRoutes";
import uploadRoutes from './routes/uploadRoutes';
import path from 'path';

const app = express();


app.use(cors());



app.use(express.json());


app.get("/", (req, res) => {
  res.send("API funcionando");
});

// Rotas da API
app.use("/usuarios", usuarioRoutes);
app.use("/clientes", clienteRoutes);
app.use("/veiculos", veiculoRoutes);
app.use("/orcamentos", orcamentoRoutes);
app.use("/enderecos", enderecoRoutes);
app.use("/departamentos", departamentoRoutes);
app.use("/auth", authRoutes);
app.use('/upload', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


export default app;