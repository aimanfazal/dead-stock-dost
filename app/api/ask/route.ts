import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { product, daysSinceLastSale, status, question } = await request.json();
    if (!product || typeof product.name !== "string" || typeof question !== "string" || !question.trim()) return NextResponse.json({ error: "Choose a product and enter a question." }, { status: 400 });
    const facts = `Product: ${product.name}\nCategory: ${product.category}\nPrice: ₹${product.price}\nStock: ${product.stock}\nLast sale date: ${product.lastSaleDate}\nDays since last sale: ${daysSinceLastSale}\nCalculated status: ${status}`;
    const prompt = `You are a practical assistant for a small garment shop. Answer briefly and use only the inventory facts given below. Do not claim to know why a product did not sell. Separate known facts from possible explanations and suggestions. Never invent inventory facts. Keep suggestions optional.\n\n${facts}\n\nShopkeeper question: ${question.trim()}`;
    const provider = process.env.AI_PROVIDER ?? "ollama";

    if (provider === "lmstudio") {
      const response = await fetch(`${process.env.LM_STUDIO_URL ?? "http://127.0.0.1:1234"}/v1/chat/completions`, {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(90_000),
        body: JSON.stringify({ model: process.env.LM_STUDIO_MODEL ?? "local-model", temperature: 0.3, stream: false, messages: [{ role: "user", content: prompt }] }),
      });
      if (!response.ok) return NextResponse.json({ error: "LM Studio could not answer. Check that its local server is running and a model is loaded." }, { status: 503 });
      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content;
      if (typeof answer !== "string" || !answer.trim()) return NextResponse.json({ error: "LM Studio returned an empty response. Try again." }, { status: 502 });
      return NextResponse.json({ answer: answer.trim() });
    }

    const response = await fetch(`${process.env.OLLAMA_URL ?? "http://127.0.0.1:11434"}/api/generate`, {
      method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(90_000),
      body: JSON.stringify({ model: process.env.OLLAMA_MODEL ?? "llama3.2", stream: false, options: { temperature: 0.3 }, prompt }),
    });
    if (!response.ok) return NextResponse.json({ error: "Ollama could not answer. Check that Ollama is running and the model is available." }, { status: 503 });
    const data = await response.json();
    if (typeof data.response !== "string") return NextResponse.json({ error: "Ollama returned an empty response. Try again." }, { status: 502 });
    return NextResponse.json({ answer: data.response.trim() });
  } catch {
    const provider = process.env.AI_PROVIDER === "lmstudio" ? "LM Studio" : "Ollama";
    return NextResponse.json({ error: `${provider} is not running. Inventory analysis is still available.` }, { status: 503 });
  }
}
