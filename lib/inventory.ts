import Papa from "papaparse";

export type Product = {
  name: string;
  category: string;
  price: number;
  stock: number;
  lastSaleDate: string;
  daysSinceLastSale: number;
  status: "DEAD" | "AT_RISK" | "NORMAL";
};

const required = ["name", "category", "price", "stock", "last_sale_date"] as const;

export function parseInventory(csv: string, today = new Date()): Product[] {
  const result = Papa.parse<Record<string, string>>(csv, { header: true, skipEmptyLines: "greedy", transformHeader: (h) => h.trim().toLowerCase() });
  if (result.errors.length) throw new Error(`Could not read this CSV: ${result.errors[0].message}`);
  const fields = result.meta.fields ?? [];
  const missing = required.filter((field) => !fields.includes(field));
  if (missing.length) throw new Error(`Missing required column${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}.`);
  if (!result.data.length) throw new Error("No products found in this file.");

  const products = result.data.map((row, index) => {
    const rowNumber = index + 2;
    for (const field of required) if (!String(row[field] ?? "").trim()) throw new Error(`Row ${rowNumber} is missing ${field}.`);
    const price = Number(row.price);
    const stock = Number(row.stock);
    if (!Number.isFinite(price) || price < 0) throw new Error(`Row ${rowNumber} has an invalid price.`);
    if (!Number.isFinite(stock)) throw new Error(`Row ${rowNumber} has an invalid stock quantity.`);
    const date = row.last_sale_date.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00`))) throw new Error(`Row ${rowNumber} has an invalid last_sale_date (use YYYY-MM-DD).`);
    const [year, month, day] = date.split("-").map(Number);
    const parsedDate = new Date(Date.UTC(year, month - 1, day));
    if (parsedDate.getUTCFullYear() !== year || parsedDate.getUTCMonth() !== month - 1 || parsedDate.getUTCDate() !== day) throw new Error(`Row ${rowNumber} has an invalid last_sale_date.`);
    const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const daysSinceLastSale = Math.floor((todayUtc - parsedDate.getTime()) / 86_400_000);
    if (daysSinceLastSale < 0) throw new Error(`Row ${rowNumber} has a last_sale_date in the future.`);
    const status = stock <= 0 ? "NORMAL" : daysSinceLastSale >= 90 ? "DEAD" : daysSinceLastSale >= 45 ? "AT_RISK" : "NORMAL";
    return { name: row.name.trim(), category: row.category.trim(), price, stock, lastSaleDate: date, daysSinceLastSale, status } satisfies Product;
  });
  return products.filter((product) => product.stock > 0).sort((a, b) => b.daysSinceLastSale - a.daysSinceLastSale);
}
