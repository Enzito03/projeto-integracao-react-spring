import { useEffect, useState, useCallback } from "react";
import "./App.css";

const BASE_URL = "http://localhost:8080";

const initialForm = {
  cep: "",
  rua: "",
  bairro: "",
  cidade: "",
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [enderecos, setEnderecos] = useState([]);
  const [cidadeBusca, setCidadeBusca] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  // ─── Funções auxiliares ───────────────────────────────────────────────────

  const contarEnderecos = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/address/count`);
      if (!response.ok) throw new Error("Erro ao contar endereços.");
      const data = await response.json();
      setTotal(data.total);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const listarEnderecos = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/address`);
      if (!response.ok) throw new Error("Erro ao listar endereços.");
      const data = await response.json();
      setEnderecos(data);
      await contarEnderecos();
    } catch (e) {
      setErro("Não foi possível carregar os endereços.");
      console.error(e);
    }
  }, [contarEnderecos]);

  useEffect(() => {
    listarEnderecos();
  }, [listarEnderecos]);

  // ─── Handlers ────────────────────────────────────────────────────────────

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function cadastrarEndereco() {
    if (!form.cep || !form.rua || !form.bairro || !form.cidade) {
      setErro("Preencha todos os campos antes de cadastrar.");
      return;
    }

    setErro("");
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/address`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar endereço.");

      await listarEnderecos();
      setForm(initialForm);
    } catch (e) {
      setErro("Erro ao cadastrar endereço. Tente novamente.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function atualizarEndereco() {
    if (!form.cep) {
      setErro("Informe o CEP do endereço que deseja atualizar.");
      return;
    }

    setErro("");
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/address/${form.cep}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Erro ao atualizar endereço.");

      await listarEnderecos();
      setForm(initialForm);
    } catch (e) {
      setErro("Erro ao atualizar endereço. Tente novamente.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function buscarPorCidade() {
    if (!cidadeBusca.trim()) {
      // Se o campo estiver vazio, recarrega todos os endereços
      await listarEnderecos();
      return;
    }

    setErro("");
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/address/cidade/${cidadeBusca.trim()}`
      );

      if (!response.ok) throw new Error("Erro ao buscar por cidade.");

      const data = await response.json();
      setEnderecos(data);
    } catch (e) {
      setErro("Erro ao buscar endereços por cidade.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="container">
      <h1>Cadastro de Endereços</h1>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      <input
        name="cep"
        placeholder="CEP"
        value={form.cep}
        onChange={handleChange}
      />

      <input
        name="rua"
        placeholder="Rua"
        value={form.rua}
        onChange={handleChange}
      />

      <input
        name="bairro"
        placeholder="Bairro"
        value={form.bairro}
        onChange={handleChange}
      />

      <input
        name="cidade"
        placeholder="Cidade"
        value={form.cidade}
        onChange={handleChange}
      />

      <button onClick={cadastrarEndereco} disabled={loading}>
        {loading ? "Aguarde..." : "Cadastrar"}
      </button>

      <button onClick={atualizarEndereco} disabled={loading}>
        {loading ? "Aguarde..." : "Atualizar endereço"}
      </button>

      <hr />

      <h2>Buscar por cidade</h2>

      <input
        placeholder="Digite a cidade"
        value={cidadeBusca}
        onChange={(e) => setCidadeBusca(e.target.value)}
      />

      <button onClick={buscarPorCidade} disabled={loading}>
        Buscar
      </button>

      <h2>Total de endereços: {total}</h2>

      <table>
        <thead>
          <tr>
            <th>CEP</th>
            <th>Rua</th>
            <th>Bairro</th>
            <th>Cidade</th>
          </tr>
        </thead>
        <tbody>
          {enderecos.map((endereco) => (
            <tr key={endereco.cep}>
              <td>{endereco.cep}</td>
              <td>{endereco.rua}</td>
              <td>{endereco.bairro}</td>
              <td>{endereco.cidade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;