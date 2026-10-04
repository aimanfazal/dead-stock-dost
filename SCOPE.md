# Project Scope

Dead Stock Dost is intentionally a small MVP built for a real-world problem: helping a small garment shop notice inventory that has been sitting around for too long and decide what to try next.

The goal is not to build a complete inventory or business-management platform.

## 🎯 Target User

The project is designed for a small neighborhood garment shop with:

- One owner and a few staff
- Products such as shirts, jeans, kurtas, jackets, and similar items
- A simple inventory or sales CSV
- No need for complicated inventory software

The tool focuses on three questions:

1. Which products need attention?
2. Why might they be stuck?
3. What could I try?

## ✅ MVP Includes

The MVP includes:

- CSV upload
- CSV parsing and validation
- Deterministic dead-stock classification
- Dead Stock and At Risk identification
- A list of products that need attention
- Product selection
- Local AI explanations through Ollama
- AI suggestions for possible actions
- Demo inventory data
- A simple single-page interface

The core inventory analysis must work without AI.

## 🚫 Out of Scope

The MVP intentionally does not include:

- POS or billing
- Customer management
- Authentication
- User accounts
- Database
- Cloud AI
- WhatsApp integration
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

These features may be useful in a larger product, but they are outside the scope of this project.

## 🤖 AI Boundaries

AI is intentionally limited to explaining calculated facts and suggesting possible actions.

The AI does not:

- Decide whether a product is dead stock
- Modify inventory
- Change prices
- Create discounts
- Invent information
- Make decisions for the shopkeeper
- Perform actions autonomously

The application code calculates the facts. The AI explains those facts.

## 🧠 Deterministic Inventory Logic

Dead-stock classification is handled entirely by application code:

| Condition | Status |
|---|---|
| Stock ≤ 0 | Ignored |
| 90+ days since last sale | DEAD STOCK |
| 45–89 days | AT RISK |
| Less than 45 days | NORMAL |

This keeps the core business logic predictable and testable.

## 🧪 MVP Testing

The most important cases are the classification boundaries:

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

## 🛑 Stop Rule

The project follows a simple rule:

> **When in doubt, choose the simpler implementation.**

Once the core flow works:

```text
CSV → Dead Stock → AI Suggestion
```

additional features should not be added unless they directly improve that experience.

## 💡 Guiding Principle

> **The code calculates.  
> The AI explains.  
> The shopkeeper decides.**

Dead Stock Dost is a small tool for one real problem — not a giant inventory platform.
