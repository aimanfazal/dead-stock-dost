# Dead Stock Dost

> **A tiny local-first AI tool that helps small garment shops find stock that's getting stuck.**

**Dead Stock Dost** is one of the five projects built for the **Hacktoberfest Weekend Challenge: Build for a Friend (DEV Challenges)**.

It is designed for a small neighborhood garment shop that already has a simple inventory or sales CSV, but needs a faster way to answer:

- **Which products haven't sold?**
- **Which ones need attention?**
- **What could I try with them?**

Dead Stock Dost keeps the answer simple:

**CSV → Identify Dead Stock → Explain → Suggest an Action**

The **code calculates the facts. The AI explains the facts. The shopkeeper decides.**

---

## ✨ What It Does

Upload your shop's inventory CSV and Dead Stock Dost will:

1. Parse and validate the inventory.
2. Calculate how long each in-stock product has been unsold.
3. Identify **Dead Stock** and **At Risk** products.
4. Show the products that need attention, with the oldest first.
5. Let you select a product and ask a local AI:
   - **"Why is this stuck?"**
   - **"What can I try?"**
6. Return short, practical suggestions based only on the available inventory data.

The core inventory analysis works **without AI**. If Ollama isn't running, you can still upload the CSV and see your dead stock.

---

## 🎯 Built for a Real Friend

This project is intentionally small.

The target user is a neighborhood garment shop with:

- One owner and a few staff
- Shirts, jeans, kurtas, jackets, and similar products
- A simple inventory or sales CSV
- No need for complicated inventory software

The goal isn't to build another enterprise dashboard. It's to build **one useful little tool that solves one real problem**.

The design is intentionally practical and shopkeeper-friendly: **which products need attention, why they're flagged, and what could be tried next.**

---

## 🧠 How Dead Stock Is Determined

Dead-stock classification is completely deterministic. **AI does not decide whether a product is dead stock.**

| Days since last sale | Status |
|---:|---|
| 90+ days | 🔴 **DEAD STOCK** |
| 45–89 days | 🟡 **AT RISK** |
| Less than 45 days | 🟢 **NORMAL** |
| Stock ≤ 0 | Ignored |

Products with stock greater than zero are considered, and older unsold products are shown first.

For example:

```text
NEEDS ATTENTION

🔴 Wedding Kurta
   Kurta · 120 days · 5 units

🔴 Denim Jacket
   Jacket · 96 days · 8 units

🟡 Printed Shirt
   Shirt · 81 days · 4 units
```

---

## 🤖 Local AI, Not Cloud AI

When you select a product, Dead Stock Dost can send its calculated facts and your question to a **local open-weight model running through Ollama**.

For example:

```text
Product: Wedding Kurta
Category: Kurta
Price: ₹1,499
Stock: 5
Days since last sale: 120
Status: DEAD

Question: What can I try?
```

The AI can explain the situation and suggest two or three possible actions.

It should say:

> "Possible reasons..."

or

> "You could try..."

rather than pretending to know something that isn't present in the data.

For example:

```text
This kurta has not had a recorded sale for 120 days
and 5 units remain in stock.

You could try:
• Move it to a more visible display.
• Show it to customers looking for wedding wear.
• Test a limited promotion.
```

The AI **does not** change inventory, prices, create discounts, or make decisions for the shopkeeper.

---

## 🛠️ Tech Stack

- **Next.js**
- **React**
- **TypeScript**
- **Local CSV**
- **Ollama**
- **Open-weight local AI model**

There is **no database, authentication system, cloud backend, or hosted AI API** in the MVP.

The CSV remains the source of truth.

---

## 📄 CSV Format

Dead Stock Dost expects these columns:

```text
name
category
price
stock
last_sale_date
```

Example:

```csv
name,category,price,stock,last_sale_date
Wedding Kurta,Kurta,1499,5,2026-04-02
Blue Shirt,Shirt,899,8,2026-06-10
Denim Jacket,Jacket,1999,8,2026-03-28
```

Dates should use:

```text
YYYY-MM-DD
```

Invalid rows are reported clearly rather than silently discarded or guessed.

---

## 🚀 Run Locally

### Requirements

- **Node.js 20.9+**
- **Ollama** for local AI suggestions

### Install

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

You can use **Try demo data** or upload your own CSV.

---

## 🦙 Set Up Ollama

Install Ollama and make sure it is running locally.

Pull an open-weight model, for example:

```bash
ollama pull llama3.2
```

Then start Ollama:

```bash
ollama serve
```

Dead Stock Dost communicates with Ollama locally. Inventory data is not sent to a cloud AI provider.

If Ollama isn't available, the inventory analysis still works — only the AI suggestions become unavailable.

---

## 🧪 Try the Demo

The project includes demo inventory containing normal, at-risk, and dead-stock products.

The intended demo takes **less than two minutes**:

```text
Open the app
    ↓
Try demo data / Upload CSV
    ↓
See products needing attention
    ↓
Select a product
    ↓
"Why is this stuck?"
    ↓
"What can I try?"
    ↓
Get a local AI response
```

This is the complete MVP experience.

---

## 🖥️ The UI

Dead Stock Dost is intentionally a **single-page application**.

The main screen focuses on:

```text
Dead Stock Dost
Your shop's second pair of eyes

[ Upload CSV ]

INVENTORY
42 products · 8 Dead · 12 At Risk

NEEDS ATTENTION

Wedding Kurta       120 days · 5 units
Denim Jacket         96 days · 8 units
Printed Shirt        81 days · 4 units

SELECTED PRODUCT

Wedding Kurta
₹1,499 · 5 units
120 days since last sale

[ Why is this stuck? ]
[ What can I try? ]

AI RESPONSE
```

The interface is deliberately simple, readable, and practical rather than looking like enterprise inventory software.

---

## 🏗️ Architecture

The architecture is intentionally boring:

```text
┌──────────────────────┐
│       Browser        │
│                      │
│ Upload CSV           │
│ View Dead Stock      │
│ Select Product       │
│ Ask AI               │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      Next.js         │
│                      │
│ CSV Parser           │
│ Dead Stock Calculator│
│ UI                   │
│ AI Request Handler   │
└──────────┬───────────┘
           │
           │ AI request only
           ▼
┌──────────────────────┐
│       Ollama         │
│   Local Open Model   │
└──────────────────────┘
```

The data flow is:

```text
CSV
 ↓
Parse
 ↓
Validate
 ↓
Calculate
 ↓
Display
 ↓
Select Product
 ↓
Ask Local AI
 ↓
Get Explanation / Suggestions
```

The deterministic inventory logic stays in application code. The AI only explains and suggests.

---

## 📁 Project Structure

The intended structure is small:

```text
dead-stock-dost/
├── app/
│   ├── api/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── inventory.ts
├── public/
│   └── demo.csv
├── .env.local.example
├── .gitignore
├── next-env.d.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

---

## 🧪 Testing

The most important business logic is the dead-stock calculation.

At minimum:

```text
120 days → DEAD
90 days  → DEAD
89 days  → AT_RISK
45 days  → AT_RISK
44 days  → NORMAL
0 stock  → ignored
```

CSV validation should also cover:

- Valid CSV
- Missing columns
- Invalid price
- Invalid stock
- Invalid date

The project intentionally avoids building a large test suite for the MVP.

---

## 🚫 What This Project Is Not

Dead Stock Dost is **not** intended to become a complete business management platform.

The MVP does not include:

- POS or billing
- Customer management
- Authentication
- User accounts
- Database
- Cloud AI
- WhatsApp
- Voice input
- Mobile app
- Image recognition
- Supplier management
- Forecasting
- Complex analytics
- Vector databases
- Multi-agent systems
- Automatic discounts or pricing
- Autonomous actions

If a feature doesn't directly improve:

**CSV → dead stock → AI suggestion**

it stays outside the MVP.

---

## 🤝 Built for Hacktoberfest

Dead Stock Dost was built as part of the **Hacktoberfest Weekend Challenge: Build for a Friend (DEV Challenges)**.

The challenge behind the project is simple: build something useful for a real person, not something overloaded with features just because the technology makes them possible.

For this project, that person is a small garment-shop owner who needs a quick way to notice inventory that's been sitting around for too long.

The project follows a deliberately small Hacktoberfest scope: **choose the simplest implementation that works, avoid over-engineering, and stop when the MVP is complete.**

---

## 💡 The Principle

> **The code calculates.**  
> **The AI explains.**  
> **The shopkeeper decides.**

That's Dead Stock Dost.

A smart little tool sitting beside the shopkeeper — **not a giant inventory platform.**