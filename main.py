from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader
from groq import Groq


client = Groq(api_key="MY GROK API KEY")

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/ask")
async def ask_question(file: UploadFile = File(...), question: str = Form(...)):
    try:
       
        pdf_reader = PdfReader(file.file)
        full_text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text() or ""
            if len(full_text) + len(page_text) > 12000:  
                break
            full_text += page_text

        
        prompt = f"""
You are a helpful AI assistant. The user has uploaded a document and asked a question.

Read the document content and answer the user's question clearly, based on the text.

If the document doesn’t contain a clear answer, say so politely and suggest what the user should do.

---

📄 Document Content:
{full_text}

❓User Question:
{question}

🎯 Your Answer:
"""

       
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
        )

        answer = response.choices[0].message.content.strip()
        return {"answer": answer}

    except Exception as e:
        return {"answer": f"❌ Error: {str(e)}"}
