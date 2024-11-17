import React, { useState, useEffect } from "react";
import "./styles.css";

export default function App() {
  // Estados
  const [tempoRestante, setTempoRestante] = useState(25 * 60);
  const [tempoLeituraTotal, setTempoLeituraTotal] = useState(0);
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [timer, setTimer] = useState(null);
  const [diario, setDiario] = useState([]);
  const [livroAtual, setLivroAtual] = useState("");

  // Definição do ciclo e suas durações
  const ciclos = [
    "Lendo",
    "Refletir",
    "Lendo",
    "Refletir",
    "Lendo",
    "Refletir",
    "Lendo",
    "Reler",
  ];
  const duracoes = { Lendo: 25 * 60, Refletir: 5 * 60, Reler: 15 * 60 };

  // Limpa o localStorage ao carregar a página
  useEffect(() => {
    localStorage.removeItem("diarioLeitura");
    setDiario([]);
  }, []);

  // Atualiza o timer no display
  const atualizarTimer = () => {
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;
    return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(
      2,
      "0"
    )}`;
  };

  // Registra leitura no diário
  const registrarLeitura = () => {
    if (!livroAtual) return;
    const novaLeitura = {
      livro: livroAtual,
      tempo: tempoLeituraTotal,
      data: new Date().toLocaleString(),
    };
    const novoDiario = [...diario, novaLeitura];
    setDiario(novoDiario);
    localStorage.setItem("diarioLeitura", JSON.stringify(novoDiario));
    setTempoLeituraTotal(0);
    setLivroAtual("");
  };

  // Inicia o timer
  const iniciarTimer = (duracao, etapa) => {
    if (timer) clearInterval(timer);
    setEtapaAtual(etapa); // Atualiza a etapa atual imediatamente
    setTempoRestante(duracao);

    const novoTimer = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(novoTimer);
          pularEtapa();
          return 0;
        }
        setTempoLeituraTotal((total) => total + 1);
        return prev - 1;
      });
    }, 1000);
    setTimer(novoTimer);
  };

  // Avança para a próxima etapa do ciclo
  const pularEtapa = () => {
    clearInterval(timer);
    let proximaEtapa = (etapaAtual + 1) % ciclos.length;

    if (ciclos[etapaAtual] === "Reler") {
      registrarLeitura();
      proximaEtapa = 0; // Reinicia o ciclo após a etapa "Reler"
    }

    setEtapaAtual(proximaEtapa);
    iniciarTimer(duracoes[ciclos[proximaEtapa]], proximaEtapa);
  };

  // Define a classe do container com base na etapa atual
  const getClasseContainer = () => {
    switch (ciclos[etapaAtual]) {
      case "Lendo":
        return "container lendo";
      case "Refletir":
        return "container refletir";
      case "Reler":
        return "container reler";
      default:
        return "container";
    }
  };

  return (
    <div className={getClasseContainer()}>
      <h1>Tantas Leituras</h1>

      {/* Input para registro */}
      <div className="registro">
        <label htmlFor="registro">Livro:</label>
        <input
          type="text"
          id="registro"
          placeholder="Qual livro você está lendo?"
          value={livroAtual}
          onChange={(e) => setLivroAtual(e.target.value)}
        />
      </div>

      {/* Cronômetro */}
      <div className="timer">{atualizarTimer()}</div>

      {/* Controles */}
      <div className="controls">
        <button onClick={() => iniciarTimer(duracoes["Lendo"], 0)}>Ler</button>
        <button onClick={() => iniciarTimer(duracoes["Refletir"], 1)}>
          Refletir
        </button>
        <button onClick={() => iniciarTimer(duracoes["Reler"], 7)}>
          Reler
        </button>
        <button onClick={pularEtapa}>Virar a página</button>
      </div>

      {/* Diário de Leitura */}
      <div className="diario">
        <h2>Diário de Leitura</h2>
        {diario.length > 0 ? (
          <ul>
            {diario.map((item, index) => (
              <li key={index}>
                {item.data} - Livro: {item.livro}, Tempo:{" "}
                {Math.floor(item.tempo / 60)} min
              </li>
            ))}
          </ul>
        ) : (
          <p>Sem registros de leitura ainda.</p>
        )}
      </div>
    </div>
  );
}
