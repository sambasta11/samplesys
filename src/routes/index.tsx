import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SampleSys — Simple Inventory System" },
      {
        name: "description",
        content:
          "A simple sample inventory system: add, view and remove items with stock counts.",
      },
      { property: "og:title", content: "SampleSys — Simple Inventory System" },
      {
        property: "og:description",
        content: "A simple sample inventory system: add, view and remove items.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Item = {
  id: number;
  name: string;
  category: string;
  qty: number;
};

const initialItems: Item[] = [
  { id: 1, name: "Bond paper (A4)", category: "Supplies", qty: 12 },
  { id: 2, name: "Whiteboard marker", category: "Supplies", qty: 4 },
  { id: 3, name: "HDMI cable", category: "Equipment", qty: 7 },
  { id: 4, name: "Webcam", category: "Equipment", qty: 2 },
];

function Index() {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Supplies");
  const [qty, setQty] = useState("1");
  const [nextId, setNextId] = useState(5);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedQty = parseInt(qty, 10);
    if (!name.trim() || Number.isNaN(parsedQty)) return;
    setItems([...items, { id: nextId, name: name.trim(), category, qty: parsedQty }]);
    setNextId(nextId + 1);
    setName("");
    setQty("1");
  };

  const removeItem = (id: number) => setItems(items.filter((i) => i.id !== id));

  const totalUnits = items.reduce((sum, i) => sum + i.qty, 0);
  const lowStock = items.filter((i) => i.qty <= 5).length;

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Sample system
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">SampleSys Inventory</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A simple demo — add items below, they stay until you refresh the page.
          </p>
        </header>

        <section className="mb-8 grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Items</p>
            <p className="text-2xl font-bold">{items.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total units</p>
            <p className="text-2xl font-bold">{totalUnits}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Low stock (≤5)</p>
            <p className="text-2xl font-bold">{lowStock}</p>
          </div>
        </section>

        <form
          onSubmit={addItem}
          className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border border-border bg-card p-4"
        >
          <div className="min-w-48 flex-1">
            <label htmlFor="item-name" className="mb-1 block text-sm text-muted-foreground">
              Item name
            </label>
            <input
              id="item-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Extension cord"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            />
          </div>
          <div>
            <label htmlFor="item-category" className="mb-1 block text-sm text-muted-foreground">
              Category
            </label>
            <select
              id="item-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            >
              <option>Supplies</option>
              <option>Equipment</option>
              <option>Furniture</option>
            </select>
          </div>
          <div className="w-20">
            <label htmlFor="item-qty" className="mb-1 block text-sm text-muted-foreground">
              Qty
            </label>
            <input
              id="item-qty"
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Add item
          </button>
        </form>

        <section className="overflow-hidden rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Qty</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                    No items yet — add one above.
                  </td>
                </tr>
              )}
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                  <td className="px-4 py-3">{item.qty}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        item.qty <= 5
                          ? "rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive"
                          : "rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                      }
                    >
                      {item.qty <= 5 ? "Low stock" : "In stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="text-xs text-muted-foreground transition-colors hover:text-destructive"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          SampleSys — a sample system website for demonstration only.
        </p>
      </div>
    </div>
  );
}
