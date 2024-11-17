import { writable } from "svelte/store";
import type { TarotCard } from "$lib/data/tarotCards";

type ReadingState = "intro" | "drawing" | "reading" | "complete";

interface ReadingStore {
  state: ReadingState;
  currentCardIndex: number;
  drawnCards: TarotCard[];
  flippedCards: boolean[];
  selectedCard: TarotCard | null;
  isFlipping: boolean;
  isReading: boolean;
  currentMessages: string[];
}

function createReadingStore() {
  const introMessages = ["Let me draw the cards that will reveal your path..."];

  function getCardReadingMessages(card: TarotCard): string[] {
    return [
      `Ah, the ${card.name}...`,
      card.interpretation.present[0],
      "Let us see what the next card reveals...",
    ];
  }

  const finalMessages = [
    "And thus concludes your reading...",
    "Would you like to seek more guidance?",
  ];

  const { subscribe, set, update } = writable<ReadingStore>({
    state: "intro",
    currentCardIndex: 0,
    drawnCards: [],
    flippedCards: [],
    selectedCard: null,
    isFlipping: false,
    isReading: false,
    currentMessages: introMessages,
  });

  return {
    subscribe,
    startDrawing: () => {
      update((store) => ({
        ...store,
        state: "drawing",
        currentMessages: [],
      }));
    },
    drawCards: (cards: TarotCard[]) => {
      update((store) => ({
        ...store,
        drawnCards: cards,
        flippedCards: new Array(cards.length).fill(false),
        state: "reading",
        isReading: false,
        currentMessages: [],
      }));
    },
    flipCard: (index: number) => {
      update((store) => {
        if (index !== store.currentCardIndex || store.isFlipping) return store;

        const flippedCards = [...store.flippedCards];
        flippedCards[index] = true;

        return {
          ...store,
          flippedCards,
          isFlipping: true,
          isReading: false,
        };
      });
    },
    showModal: (index: number) => {
      update((store) => ({
        ...store,
        selectedCard: store.drawnCards[index],
        isFlipping: false,
      }));
    },
    closeModal: () => {
      update((store) => {
        const card = store.drawnCards[store.currentCardIndex];
        return {
          ...store,
          selectedCard: null,
          isReading: true,
          currentMessages: getCardReadingMessages(card),
        };
      });
    },
    completeReading: () => {
      update((store) => {
        if (!store.isReading) return store;

        const nextIndex = store.currentCardIndex + 1;
        if (nextIndex < store.drawnCards.length) {
          return {
            ...store,
            currentCardIndex: nextIndex,
            isReading: false,
            currentMessages: [],
          };
        } else {
          return {
            ...store,
            state: "complete",
            currentMessages: finalMessages,
          };
        }
      });
    },
    reset: () => {
      set({
        state: "intro",
        currentCardIndex: 0,
        drawnCards: [],
        flippedCards: [],
        selectedCard: null,
        isFlipping: false,
        isReading: false,
        currentMessages: introMessages,
      });
    },
  };
}

export const readingStore = createReadingStore();
