import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable"; 

function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAsk = async () => {
    if (!file || !question) {
      alert("Please upload a document and type your question.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("question", question);

    try {
      const response = await axios.post("http://127.0.0.1:8001/ask", formData);
      setAnswer(response.data.answer);
    } catch (error) {
      console.error("Error:", error);
      setAnswer("❌ Something went wrong while fetching the answer.");
    }
  };

  const downloadPDF = () => {
  const doc = new jsPDF();

 
  const sanitizeText = (text) => {
    return text
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '') 
      .replace(/[^\x00-\x7F]/g, '')           
      .trim();
  };

  const safeQuestion = sanitizeText(question);
  const safeAnswer = sanitizeText(answer);

  doc.setFontSize(16);
  doc.text("QPilot - AI Generated Answer", 10, 20);

  doc.setFontSize(12);
  doc.text(`Question: ${safeQuestion}`, 10, 30);

  const lines = doc.splitTextToSize(`Answer:\n${safeAnswer}`, 180);
  doc.text(lines, 10, 40);

  doc.save("QPilot_AI_Answer.pdf");
};


  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>📄 QPilot Document AI</h1>
        <p style={styles.subtext}>Ask intelligent questions from any uploaded PDF document</p>

        <input type="file" onChange={handleFileChange} style={styles.fileInput} />
        <input
          type="text"
          placeholder="Ask your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleAsk} style={styles.button}>
          🔍 Ask Question
        </button>

        {answer && (
          <>
            <div style={styles.answerBox}>
              <h3 style={{ marginBottom: "10px" }}>🧠 AI Answer:</h3>
              <p style={{ whiteSpace: "pre-wrap" }}>{answer}</p>
            </div>

            <button onClick={downloadPDF} style={styles.downloadBtn}>
              ⬇️ Download Answer as PDF
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "linear-gradient(to right, #1f4037, #99f2c8)",
    minHeight: "100vh",
    padding: "50px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "35px",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)",
    maxWidth: "650px",
    width: "100%",
    textAlign: "center",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  subtext: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "30px",
  },
  fileInput: {
    marginBottom: "20px",
    fontSize: "16px",
    padding: "8px",
    width: "100%",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    width: "100%",
    marginBottom: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  button: {
    padding: "12px 25px",
    backgroundColor: "#1f4037",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s ease",
    marginBottom: "20px",
  },
  answerBox: {
    marginTop: "20px",
    background: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    textAlign: "left",
  },
  downloadBtn: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#4caf50",
    color: "white",
    fontSize: "14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default App;
