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

  function getCardIntroduction(cardName: string): string {
    const phrases = [
      `Behold, ${cardName}!`,
      `Ah yes, ${cardName}.`,
      `Ah, the ${cardName} reveals itself.`,
      `Here we have ${cardName}.`,
      `Oh, it’s ${cardName}!`,
      `The ${cardName} has come forth.`,
      `Ah, look, ${cardName}!`,
      `Ah, the wisdom of ${cardName} graces us.`,
      `Ah, what a draw: ${cardName}!`,
      `Hmmm... the ${cardName} makes an appearance.`,
      `Oh, how intriguing, ${cardName}.`,
      `Ah, ${cardName}—a sign from beyond.`,
      `And here it is: ${cardName}.`,
      `Ah, the ever-revealing ${cardName}.`,
      `Ah, destiny speaks through ${cardName}.`,
      `Ah, what clarity ${cardName} brings.`,
      `Hmm, ${cardName}—how fascinating.`,
      `Oh, ${cardName}—it holds much to consider.`,
      `The ${cardName}—what a powerful message.`,
      `Ah, ${cardName}, the story unfolds.`,
    ];

    const randomIndex = Math.floor(Math.random() * phrases.length);
    return phrases[randomIndex];
  }

  // Example usage:
  console.log(getCardIntroduction("The Fool"));

  function getCardReadingMessages(
    card: TarotCard,
    cardNumber: number
  ): string[] {
    let array: string[] = [];
    switch (cardNumber) {
      case 0:
        array = card.interpretation.past;
        break;
      case 1:
        array = card.interpretation.present;
        break;
      case 2:
        array = card.interpretation.future;
        break;
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    return [getCardIntroduction(card.name), array[randomIndex]];
  }

  const finalMessages = [
    /* "And thus concludes your reading...", */
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
          currentMessages: getCardReadingMessages(card, store.currentCardIndex),
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
