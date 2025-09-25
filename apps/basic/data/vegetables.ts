import * as v from "valibot";

export const items = [
	{ id: "carrot", name: "Carrot" },
	{ id: "broccoli", name: "Broccoli" },
	{ id: "spinach", name: "Spinach" },
	{ id: "potato", name: "Potato" },
	{ id: "tomato", name: "Tomato" },
	{ id: "cucumber", name: "Cucumber" },
	{ id: "lettuce", name: "Lettuce" },
	{ id: "onion", name: "Onion" },
	{ id: "pepper", name: "Pepper" },
	{ id: "eggplant", name: "Eggplant" },
];

export const itemSchema = v.object({
	id: v.pipe(v.string(), v.nonEmpty()),
	name: v.pipe(v.string(), v.nonEmpty()),
});
