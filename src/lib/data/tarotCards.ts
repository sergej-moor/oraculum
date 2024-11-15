export interface TarotCard {
  id: number;
  name: string;
  image: string;
}

export const tarotCards: TarotCard[] = [
  {
    id: 0,
    name: "The Fool",
    image: "/cards/fool.jpg",
  },
  {
    id: 1,
    name: "The Magician",
    image: "/cards/magician.jpg",
  },
  {
    id: 2,
    name: "The High Priestess",
    image: "/cards/priestess.jpg",
  },
  {
    id: 3,
    name: "The Empress",
    image: "/cards/empress.jpg",
  },
  {
    id: 4,
    name: "The Emperor",
    image: "/cards/emperor.jpg",
  },
];
