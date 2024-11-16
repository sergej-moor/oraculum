export interface TarotCard {
  id: number;
  name: string;
  image: string;
}

export const tarotCards: TarotCard[] = [
  {
    id: 0,
    name: "The Fool",
    image: "$assets/cards/major/fool.webp",
  },
  {
    id: 1,
    name: "The Magician",
    image: "$assets/cards/major/the_magician_2024-11-16T00-23-23-311Z.webp",
  },
  {
    id: 2,
    name: "The High Priestess",
    image: "$assets/cards/major/the_high_priestess.webp",
  },
  {
    id: 3,
    name: "The Empress",
    image: "$assets/cards/major/the_empress.webp",
  },
  {
    id: 4,
    name: "The Emperor",
    image: "$assets/cards/major/the_emperor.webp",
  },
];
