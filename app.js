// =======================
// ELEMENTOS (CORREÇÃO IMPORTANTE)
// =======================
const select = document.getElementById("cartas");
const descricao = document.getElementById("descricao");
const resultado = document.getElementById("resultado");
const inputManual = document.getElementById("codigoManual");

// =======================
// DADOS
// =======================
const CARTAS = {
  // 🟦 PLANEJAMENTO
  PLANEJ01: "Qual é o objetivo deste conteúdo que vou estudar?",
  PLANEJ02: "O que preciso compreender para considerar que aprendi?",
  PLANEJ03: "Como posso verificar se realmente compreendi esse conteúdo?",
  PLANEJ04: "O que eu já sei que pode me ajudar nesse estudo?",
  PLANEJ05: "Este conteúdo está claro para mim ou ainda está confuso?",
  PLANEJ06: "Esse conteúdo exige mais memorização ou compreensão?",
  PLANEJ07: "Qual parte desse conteúdo parece mais difícil?",
  PLANEJ08: "Em qual aspecto preciso prestar mais atenção?",
  PLANEJ09: "Estou focado em compreender ou apenas em concluir a tarefa?",
  PLANEJ10: "O que pode dificultar minha aprendizagem neste conteúdo?",
  PLANEJ11: "Qual parte devo compreender primeiro?",
  PLANEJ12: "Tenho clareza do que significa 'entender' esse conteúdo?",
  PLANEJ13: "Que estratégia de estudo vou utilizar (resumo, prática, explicação)?",
  PLANEJ14: "Quanto tempo preciso dedicar para atingir esse objetivo?",
  PLANEJ15: "Como saberei que atingi o objetivo de aprendizagem?",

  // 🟨 MONITORAMENTO
  MONITO01: "Estou avançando na compreensão deste conteúdo?",
  MONITO02: "O que já consegui compreender até agora?",
  MONITO03: "O que ainda não está claro para mim?",
  MONITO04: "Estou realmente entendendo ou apenas lendo?",
  MONITO05: "Consigo explicar o que acabei de estudar?",
  MONITO06: "Em qual parte estou com mais dificuldade?",
  MONITO07: "Estou percebendo quando não entendo?",
  MONITO08: "Minha compreensão está melhorando ao longo do estudo?",
  MONITO09: "Estou acompanhando meu próprio raciocínio?",
  MONITO10: "Estou focado nas partes mais importantes do conteúdo?",
  MONITO11: "O que estou fazendo agora está me ajudando a aprender?",
  MONITO12: "Estou confuso em algum ponto essencial?",
  MONITO13: "Consigo identificar onde estou errando?",
  MONITO14: "Estou ignorando alguma dificuldade?",
  MONITO15: "O que ainda falta para eu compreender melhor esse conteúdo?",

  // 🟩 AVALIAÇÃO
  AVALIA01: "Alcancei o objetivo deste estudo?",
  AVALIA02: "O que eu realmente compreendi?",
  AVALIA03: "O que ainda não compreendi adequadamente?",
  AVALIA04: "Consigo explicar esse conteúdo com clareza?",
  AVALIA05: "Minha compreensão é suficiente ou ainda é parcial?",
  AVALIA06: "Minha percepção de aprendizagem foi correta?",
  AVALIA07: "Achei que sabia algo que, na verdade, não sabia?",
  AVALIA08: "Onde estão minhas principais dificuldades?",
  AVALIA09: "Meu entendimento está organizado ou fragmentado?",
  AVALIA10: "Consigo aplicar esse conteúdo em outra situação?",
  AVALIA11: "O objetivo foi atingido totalmente ou parcialmente?",
  AVALIA12: "O que faltou para compreender completamente?",
  AVALIA13: "Se eu tivesse que estudar novamente, o que faria diferente?",
  AVALIA14: "Qual estratégia funcionou melhor para minha aprendizagem?",
  AVALIA15: "O que preciso fazer para melhorar na próxima vez?"
};

// =======================
// POPULAR SELECT (CORREÇÃO PRINCIPAL)
// =======================
function carregarSelect() {
  select.innerHTML = '<option value="">-- Selecione --</option>';

  Object.entries(CARTAS).forEach(([codigo, texto]) => {
    const opt = document.createElement("option");
    opt.value = codigo;
    opt.textContent = `${codigo} - ${texto}`;
    select.appendChild(opt);
  });
}

// Atualizar descrição
select.addEventListener("change", () => {
  const codigo = select.value;
  descricao.innerText = CARTAS[codigo] || "";
});

// GARANTE EXECUÇÃO NO MOBILE
window.addEventListener("DOMContentLoaded", carregarSelect);

// =======================
// OBTER CÓDIGO (PRIORIDADE CORRETA)
// =======================
function obterCodigo() {
  if (inputManual.value.trim()) return inputManual.value.trim();
  if (select.value) return select.value;
  return null;
}

// =======================
// GRAVAR NFC
// =======================
async function gravarNFC() {
  const codigo = obterCodigo();

  if (!codigo) {
    resultado.innerText = "⚠️ Informe um código";
    return;
  }

  try {
    const ndef = new NDEFReader();
    await ndef.write(codigo);

    resultado.innerText = "✅ Gravado: " + codigo;

  } catch (e) {
    console.error(e);
    resultado.innerText = "❌ Erro ao gravar NFC";
  }
}

// =======================
// LER NFC
// =======================
async function lerNFC() {
  resultado.innerText = "📡 Aproxime a tag...";

  try {
    const ndef = new NDEFReader();
    await ndef.scan();

    ndef.onreading = event => {
      const records = event.message.records;

      if (!records || records.length === 0) {
        resultado.innerText = "⚠️ Tag vazia";
        return;
      }

      const decoder = new TextDecoder();
      const codigo = decoder.decode(records[0].data);

      mostrarResultado(codigo);
    };

  } catch (e) {
    console.error(e);
    resultado.innerText = "❌ Erro ao ler NFC";
  }
}

// =======================
// MOSTRAR RESULTADO
// =======================
function mostrarResultado(codigo) {
  if (CARTAS[codigo]) {
    resultado.innerText = `${codigo} - ${CARTAS[codigo]}`;
  } else {
    resultado.innerText = `Código: ${codigo}`;
  }
}

// =======================
// QR CODE (CORRIGIDO)
// =======================
let qr;

function iniciarQR() {
  const readerDiv = document.getElementById("reader");
  readerDiv.innerHTML = ""; // limpa

  qr = new Html5Qrcode("reader");

  qr.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    (decodedText) => {
      qr.stop();
      inputManual.value = decodedText;
      resultado.innerText = "QR lido: " + decodedText;
    },
    (error) => {
      // ignorar erros de leitura contínuos
    }
  ).catch(err => {
    console.error(err);
    resultado.innerText = "❌ Não foi possível acessar a câmera";
  });
}
