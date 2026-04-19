// Verifica suporte
if ('NDEFReader' in window) {
  console.log("Web NFC suportado!");
} else {
  alert("Seu dispositivo não suporta NFC via navegador.");
}

// GRAVAR
async function gravarNFC() {
  try {
    const codigo = document.getElementById("codigo").value;

    if (!codigo) {
      alert("Digite um código!");
      return;
    }

    const ndef = new NDEFReader();
    await ndef.write(codigo);

    alert("Código gravado com sucesso!");
  } catch (error) {
    console.error(error);
    alert("Erro ao gravar NFC");
  }
}

// LER
async function lerNFC() {
  try {
    const ndef = new NDEFReader();

    await ndef.scan();

    ndef.onreading = event => {
      const decoder = new TextDecoder();

      for (const record of event.message.records) {
        const texto = decoder.decode(record.data);
        document.getElementById("resultado").innerText = texto;
      }
    };

  } catch (error) {
    console.error(error);
    alert("Erro ao ler NFC");
  }
}