// Seed data for Blunder Staff Recipe Manual
// Each ingredient amount is stored as the "Medium" base value.
// Small = 0.66x, Medium = 1x, Large = 1.5x (default scaling)
// These can be overridden per-item in the future.

export const SIZE_RATIOS = {
  Small: 0.66,
  Medium: 1,
  Large: 1.5,
};

export const CATEGORIES = ["Smoothies", "Salads", "Bowls", "Coffee"];

export const seedItems = [
  {
    id: "itm-1",
    name: "Choco Banana Peanut Bark",
    category: "Smoothies",
    description: "Rich, creamy and protein-packed. Top with cocoa nibs.",
    ingredients: [
      { id: "i-1-1", name: "Banana (frozen)", amount: 150, unit: "g", costPerUnit: 0.003 },
      { id: "i-1-2", name: "Peanut butter", amount: 30, unit: "g", costPerUnit: 0.012 },
      { id: "i-1-3", name: "Cocoa powder", amount: 8, unit: "g", costPerUnit: 0.025 },
      { id: "i-1-4", name: "Oat milk", amount: 220, unit: "ml", costPerUnit: 0.004 },
      { id: "i-1-5", name: "Honey", amount: 12, unit: "ml", costPerUnit: 0.015 },
      { id: "i-1-6", name: "Ice cubes", amount: 4, unit: "pcs", costPerUnit: 0 },
    ],
    steps: [
      "Add oat milk to the blender jug first.",
      "Drop in frozen banana, peanut butter, cocoa and honey.",
      "Add ice cubes last.",
      "Blend on high for 35 seconds until silky.",
      "Pour into a chilled glass, sprinkle cocoa nibs on top.",
    ],
    packaging: [
      { id: "p-1-1", name: "16oz cup + lid", cost: 0.35 },
      { id: "p-1-2", name: "Paper straw", cost: 0.05 },
    ],
  },
  {
    id: "itm-2",
    name: "Dragon Fruit Iron Smoothie",
    category: "Smoothies",
    description: "Vibrant pink, energising. Best served immediately.",
    ingredients: [
      { id: "i-2-1", name: "Dragon fruit puree", amount: 120, unit: "g" },
      { id: "i-2-2", name: "Frozen strawberries", amount: 80, unit: "g" },
      { id: "i-2-3", name: "Spinach", amount: 25, unit: "g" },
      { id: "i-2-4", name: "Coconut water", amount: 200, unit: "ml" },
      { id: "i-2-5", name: "Lime juice", amount: 10, unit: "ml" },
      { id: "i-2-6", name: "Agave syrup", amount: 10, unit: "ml" },
    ],
    steps: [
      "Pour coconut water into blender.",
      "Add dragon fruit, strawberries and spinach.",
      "Squeeze in lime juice and agave.",
      "Blend on high for 40 seconds.",
      "Serve in a tall glass with a wide straw.",
    ],
  },
  {
    id: "itm-3",
    name: "Matcha Mint Glow",
    category: "Smoothies",
    description: "Earthy matcha with fresh mint — clean finish.",
    ingredients: [
      { id: "i-3-1", name: "Matcha powder", amount: 4, unit: "g" },
      { id: "i-3-2", name: "Banana (frozen)", amount: 100, unit: "g" },
      { id: "i-3-3", name: "Fresh mint leaves", amount: 6, unit: "pcs" },
      { id: "i-3-4", name: "Almond milk", amount: 230, unit: "ml" },
      { id: "i-3-5", name: "Vanilla syrup", amount: 8, unit: "ml" },
    ],
    steps: [
      "Whisk matcha with 20ml warm water until smooth.",
      "Add matcha paste and remaining ingredients to blender.",
      "Blend 30 seconds on medium.",
      "Garnish with a mint sprig.",
    ],
  },
  {
    id: "itm-4",
    name: "Citrus Kale Crunch Salad",
    category: "Salads",
    description: "Bright, zesty, with toasted seeds for crunch.",
    ingredients: [
      { id: "i-4-1", name: "Curly kale (chopped)", amount: 90, unit: "g" },
      { id: "i-4-2", name: "Orange segments", amount: 70, unit: "g" },
      { id: "i-4-3", name: "Red onion (sliced)", amount: 20, unit: "g" },
      { id: "i-4-4", name: "Toasted pumpkin seeds", amount: 15, unit: "g" },
      { id: "i-4-5", name: "Feta crumble", amount: 30, unit: "g" },
      { id: "i-4-6", name: "Citrus vinaigrette", amount: 25, unit: "ml" },
    ],
    steps: [
      "Massage kale with a pinch of salt for 30 seconds.",
      "Toss kale with orange segments and red onion.",
      "Drizzle citrus vinaigrette evenly.",
      "Top with pumpkin seeds and feta crumble.",
      "Serve cold within 2 minutes of plating.",
    ],
  },
  {
    id: "itm-5",
    name: "Mediterranean Chickpea Salad",
    category: "Salads",
    description: "Hearty, herby, holds up well for takeaway.",
    ingredients: [
      { id: "i-5-1", name: "Chickpeas (cooked)", amount: 120, unit: "g" },
      { id: "i-5-2", name: "Cherry tomatoes", amount: 80, unit: "g" },
      { id: "i-5-3", name: "Cucumber (diced)", amount: 70, unit: "g" },
      { id: "i-5-4", name: "Kalamata olives", amount: 25, unit: "g" },
      { id: "i-5-5", name: "Parsley (chopped)", amount: 8, unit: "g" },
      { id: "i-5-6", name: "Lemon-olive dressing", amount: 30, unit: "ml" },
    ],
    steps: [
      "Combine chickpeas, tomatoes and cucumber in mixing bowl.",
      "Add olives and parsley.",
      "Pour dressing and toss gently 5 times.",
      "Plate in shallow bowl, finish with cracked pepper.",
    ],
  },
  {
    id: "itm-6",
    name: "Sunrise Acai Bowl",
    category: "Bowls",
    description: "Thick acai base, layered with seasonal toppings.",
    ingredients: [
      { id: "i-6-1", name: "Acai puree (frozen)", amount: 140, unit: "g" },
      { id: "i-6-2", name: "Banana", amount: 60, unit: "g" },
      { id: "i-6-3", name: "Granola", amount: 30, unit: "g" },
      { id: "i-6-4", name: "Mixed berries", amount: 40, unit: "g" },
      { id: "i-6-5", name: "Coconut flakes", amount: 6, unit: "g" },
      { id: "i-6-6", name: "Honey drizzle", amount: 10, unit: "ml" },
    ],
    steps: [
      "Blend acai with banana until thick & spoonable.",
      "Pour into chilled bowl.",
      "Top with granola in one neat row.",
      "Arrange berries and coconut flakes.",
      "Finish with honey drizzle in a zigzag.",
    ],
  },
  {
    id: "itm-7",
    name: "Vanilla Oat Cold Brew",
    category: "Coffee",
    description: "Smooth cold brew with vanilla & creamy oat foam.",
    ingredients: [
      { id: "i-7-1", name: "Cold brew concentrate", amount: 120, unit: "ml" },
      { id: "i-7-2", name: "Oat milk", amount: 90, unit: "ml" },
      { id: "i-7-3", name: "Vanilla syrup", amount: 15, unit: "ml" },
      { id: "i-7-4", name: "Ice cubes", amount: 5, unit: "pcs" },
    ],
    steps: [
      "Add ice cubes to serving glass.",
      "Pour cold brew over ice.",
      "Stir in vanilla syrup gently.",
      "Top with cold-foamed oat milk in a slow stream.",
    ],
  },
];
