window.onload = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "auto"; // Let browser auto-detect the spoken language

  const micButton = document.getElementById("micButton");
  const textBox = document.getElementById("text");
  const downloadBtn = document.getElementById("downloadBtn");

  const subscriptionKey = "CAceaMOXm2nArPdv9KJRpvB5C11pDWSihvsL2btkgyJmCLugiymPJQQJ99BFACGhslBXJ3w3AAAbACOGOpnc";
  const region = "centralindia";
  const endpoint = "https://api.cognitive.microsofttranslator.com"; 

  let isRecording = false;

  micButton.onclick = () => {
    if (!isRecording) {
      recognition.start();
      micButton.src = "photos/stopp.png";
      isRecording = true;
    } else {
      recognition.stop();
      micButton.src = "photos/mic.png";
      isRecording = false;
    }
  };

  recognition.onresult = async (event) => {
    const speechText = event.results[0][0].transcript;
    textBox.value = "Translating...";

    try {
      const response = await fetch(`${endpoint}/translate?api-version=3.0&to=en`, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": subscriptionKey,
          "Ocp-Apim-Subscription-Region": region,
          "Content-Type": "application/json"
        },
        body: JSON.stringify([{ Text: speechText }])
      });

      const data = await response.json();
      const translatedText = data[0].translations[0].text;
      textBox.value = translatedText;

    } catch (err) {
      textBox.value = "Translation failed: " + err.message;
    }

    micButton.src = "photos/mic.png";
    isRecording = false;
  };

  recognition.onerror = (event) => {
    textBox.value = "Error: " + event.error;
    micButton.src = "photos/mic.png";
    isRecording = false;
  };

  downloadBtn.onclick = () => {
    const text = textBox.value;
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transcript.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  };
};
