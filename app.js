// Verifica suporte
if (!('NDEFReader' in window)) {
  alert("NFC não suportado neste dispositivo.");
}

// GRAVAR NFC
async function gravarNFC() {
  const codigo = document.getElementById("codigo").value;

  if (!codigo) {
    alert("Digite um código!");
    return;
  }

  try {
    const ndef = new NDEFReader();

    await ndef.write({
      records: [{
        recordType: "text",
        data: codigo
      }]
    });

    document.getElementById("resultado").innerText =
      "✅ Código gravado! Aproxime outra tag se quiser.";
  } catch (error) {
    console.error(error);
    document.getElementById("resultado").innerText =
      "❌ Erro ao gravar NFC.";
  }
}

// LER NFC
async function lerNFC() {
  const resultado = document.getElementById("resultado");
  resultado.innerText = "📡 Aproxime a tag NFC...";

  try {
    const ndef = new NDEFReader();
    await ndef.scan();

    ndef.onreading = event => {
      const records = event.message.records;

      // TAG VAZIA
      if (!records || records.length === 0) {
        resultado.innerText = "⚠️ Tag NFC vazia (sem dados)";
        return;
      }

      const decoder = new TextDecoder();
      let textoFinal = "";

      for (const record of records) {
        if (record.recordType === "text") {
          textoFinal += decoder.decode(record.data) + " ";
        }
      }

      if (textoFinal.trim() === "") {
        resultado.innerText = "⚠️ Tag contém dados não legíveis";
      } else {
        resultado.innerText = "📄 Conteúdo: " + textoFinal;
      }
    };

    ndef.onerror = () => {
      resultado.innerText = "❌ Erro ao ler NFC.";
    };

  } catch (error) {
    console.error(error);
    resultado.innerText = "❌ Falha ao iniciar leitura NFC.";
  }
}
