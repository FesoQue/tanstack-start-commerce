export const LOOKS = [
  // Men's
  {
    id: 1,
    category: "men's clothing",
    title: "Everyday Essentials",
    description:
      "Clean silhouettes and neutral tones for effortless daily wear.",
    tag: "Daily",
    productIds: [2, 4, 1],
    materials: ["Cotton", "3 pieces"],
  },
  {
    id: 2,
    category: "men's clothing",
    title: "Layered Outdoor",
    description:
      "Rugged yet refined — built for the commute and the trail alike.",
    tag: "Outdoor",
    productIds: [3, 2, 1],
    materials: ["Cotton / Polyester", "3 pieces"],
  },
  {
    id: 3,
    category: "men's clothing",
    title: "Office Light",
    description:
      "Tailored pieces with a softer edge for a calm, focused work uniform.",
    tag: "Work",
    productIds: [4, 2, 3],
    materials: ["Slim Fit / Cotton", "3 pieces"],
  },

  // Women's
  {
    id: 4,
    category: "women's clothing",
    title: "Weekend Minimal",
    description: "Relaxed fits and soft textures for slow, unhurried days.",
    tag: "Weekend",
    productIds: [18, 19, 20],
    materials: ["Rayon / Spandex", "3 pieces"],
  },
  {
    id: 5,
    category: "women's clothing",
    title: "Street Layer",
    description: "Bold outerwear over simple basics — effortless contrast.",
    tag: "Street",
    productIds: [16, 18, 20],
    materials: ["Faux Leather / Cotton", "3 pieces"],
  },
  {
    id: 6,
    category: "women's clothing",
    title: "Cold Weather Edit",
    description:
      "Functional layers designed for warmth without sacrificing form.",
    tag: "Winter",
    productIds: [15, 17, 19],
    materials: ["Polyester / Fleece", "3 pieces"],
  },
  {
    id: 7,
    category: "women's clothing",
    title: "Studio Casual",
    description: "Breathable, lightweight pieces that move with you all day.",
    tag: "Casual",
    productIds: [19, 20, 18],
    materials: ["Cotton / Polyester", "3 pieces"],
  },

  // Jewellery
  {
    id: 8,
    category: "jewelery",
    title: "Fine & Minimal",
    description: "Delicate pieces that add quiet elegance to any look.",
    tag: "Minimal",
    productIds: [6, 7, 8],
    materials: ["Gold / Silver", "3 pieces"],
  },
  {
    id: 9,
    category: "jewelery",
    title: "Statement Gold",
    description: "Bold, crafted pieces for evenings that deserve more.",
    tag: "Statement",
    productIds: [5, 6, 7],
    materials: ["18K Gold", "3 pieces"],
  },

  // Electronics
  {
    id: 10,
    category: "electronics",
    title: "The Mobile Setup",
    description: "Everything you need to stay fast and portable on the go.",
    tag: "Mobile",
    productIds: [9, 10, 11],
    materials: ["USB 3.0 / SATA", "3 pieces"],
  },
  {
    id: 11,
    category: "electronics",
    title: "Gaming Station",
    description:
      "High-performance peripherals for an immersive gaming experience.",
    tag: "Gaming",
    productIds: [12, 13, 14],
    materials: ["QLED / USB 3.0", "3 pieces"],
  },
  {
    id: 12,
    category: "electronics",
    title: "Creator Desk",
    description:
      "Reliable storage and display for the modern creative workflow.",
    tag: "Creative",
    productIds: [10, 11, 13],
    materials: ["SSD / IPS", "3 pieces"],
  },
];

export const CATEGORIES = [
  {
    key: "men's clothing",
    label: "Men's",
    description: "Understated pieces for the modern man.",
  },
  {
    key: "women's clothing",
    label: "Women's",
    description: "Versatile silhouettes from casual to sharp.",
  },
  {
    key: "jewelery",
    label: "Jewellery",
    description: "Refined accents that complete every outfit.",
  },
  {
    key: "electronics",
    label: "Electronics",
    description: "Curated tech for work, play, and creation.",
  },
];
