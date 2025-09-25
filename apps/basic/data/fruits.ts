import * as v from "valibot";

export const items = [
	{ id: "apple", name: "Apple" },
	{ id: "banana", name: "Banana" },
	{ id: "cherry", name: "Cherry" },
	{ id: "date", name: "Date" },
	{ id: "elderberry", name: "Elderberry" },
	{ id: "fig", name: "Fig" },
	{ id: "grape", name: "Grape" },
	{ id: "honeydew", name: "Honeydew" },
	{ id: "kiwi", name: "Kiwi" },
	{ id: "lemon", name: "Lemon" },
];

export const itemSchema = v.object({
	id: v.pipe(v.string(), v.nonEmpty()),
	name: v.pipe(v.string(), v.nonEmpty()),
});
