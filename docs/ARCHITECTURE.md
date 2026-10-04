# Architecture

Dead Stock Dost is intentionally built around one simple flow:

**CSV → Parse → Validate → Calculate → Display → Ask Local AI**

The architecture keeps inventory analysis deterministic and keeps AI limited to explanations and suggestions.

## 🧩 System Overview

```text
┌──────────────────────────┐
│         Browser          │
│                          │
│  Upload CSV              │
│  View Inventory          │
│  View Dead Stock         │
│  Select Product          │
│  Ask AI                  │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│         Next.js          │
│                          │
│  CSV Parsing             │
│  Validation              │
│  Dead Stock Calculation  │
│  UI                      │
│  AI Request Handler      │
└────────────┬─────────────┘
             │
             │ AI request only
             ▼
┌──────────────────────────┐
│          Ollama          │
│                          │
│    Local Open Model      │
└──────────────────────────┘
```

There is no database or cloud AI service in the MVP.

The CSV remains the **source of truth**.

## 🔄 Data Flow

### 1. Upload

The user uploads an inventory CSV containing:

- `name`
- `category`
- `price`
- `stock`
- `last_sale_date`

### 2. Parse and Validate

The application parses the CSV and validates the required fields.

Invalid data should produce a clear validation error rather than being silently guessed or discarded.

### 3. Calculate

Dead-stock status is calculated by application code.

```text
Stock ≤ 0       → Ignored
90+ days        → DEAD STOCK
45–89 days      → AT RISK
< 45 days       → NORMAL
```

The AI is **not involved in this calculation**.

### 4. Display

The application displays the inventory and highlights products that need attention.

Older unsold products are shown first so the shopkeeper can focus on the most urgent items.

### 5. Ask Local AI

After selecting a product, the user can ask questions such as:

```text
Why is this stuck?
What can I try?
```

The application sends the calculated product facts and the user's question to the local Ollama service.

Ollama returns an explanation or a small number of possible actions.

## 🤖 AI Boundary

The AI has a deliberately limited role.

### Application code decides

- Whether a product is considered dead stock
- Whether it is at risk
- How many days it has been unsold
- How much stock remains
- What information is available

### AI explains

- Possible reasons a product may be stuck
- Practical actions the shopkeeper could try

The AI must not:

- Classify products as dead stock
- Change inventory data
- Change prices
- Create discounts
- Invent facts
- Make decisions for the shopkeeper
- Perform autonomous actions

This keeps the system predictable while still making the AI useful.

## 🦙 Ollama

Ollama provides the local AI runtime.

The intended flow is:

```text
Selected Product
      ↓
Calculated Facts
      ↓
User Question
      ↓
Next.js AI Request
      ↓
Ollama
      ↓
Local Open Model
      ↓
Explanation / Suggestions
```

Inventory analysis does not depend on Ollama. If Ollama is unavailable, the user can still upload a CSV and view the calculated inventory status.

## 🧱 Application Structure

The MVP keeps the implementation small.

```text
dead-stock-dost/
├── app/
│   ├── api/
│   │   └── ask/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── docs/
│   └── ARCHITECTURE.md
├── lib/
│   └── inventory.ts
├── public/
│   └── demo.csv
├── screenshots/
│   ├── homepage.png
│   └── stock-report.png
├── .env.local.example
├── .gitignore
├── next-env.d.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

### `app/page.tsx`

Contains the main application flow and user interface.

### `app/api/ask/route.ts`

Handles requests for local AI explanations and suggestions.

### `lib/inventory.ts`

Contains the inventory-related logic, including parsing, validation, and dead-stock calculations.

### `data/demo.csv`

Provides sample inventory data for the demo.

## 🔐 Data Flow and Privacy

The MVP is local-first.

Inventory data is not sent to a cloud AI provider.

The AI request is made to the locally running Ollama service, while the inventory itself remains represented by the uploaded CSV in the application flow.

There is no database storing inventory data.

## 🎯 Design Principle

The architecture follows one simple rule:

> **The code calculates the facts.  
> The AI explains the facts.  
> The shopkeeper makes the decision.**

This separation keeps the core business logic deterministic while giving the shopkeeper a useful natural-language interface for understanding and acting on dead stock.