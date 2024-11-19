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
  const introMessages = [
    getReadingIntroduction(),
    getReadingExplanation(),
    getCardRevealPhrase("past"),
  ];

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
  function getCardRevealPhrase(
    position: "past" | "present" | "future"
  ): string {
    const phrases: { [key: string]: string[] } = {
      past: [
        "The first card will show you your past.",
        "Let us uncover what the past holds.",
        "This card reveals the echoes of your past.",
        "What secrets does your past whisper? Let’s see.",
        "The first card speaks of your past experiences.",
        "Let us glance back into your past.",
        "This card uncovers the story of your past.",
        "Let the first card show us where you have been.",
        "The first card reflects the path you’ve already walked.",
        "This is the card of your past, revealing what has been.",
      ],
      present: [
        "The next card will reveal your present.",
        "Let us see what the present moment holds for you.",
        "This card speaks of your current situation.",
        "What does the present say? Let’s find out.",
        "The second card shows where you are now.",
        "Let’s uncover the truth of the present with this card.",
        "The present reveals itself through this card.",
        "Let the next card shine a light on your current path.",
        "This is the card of the present, showing your here and now.",
        "This card reflects the energy surrounding you today.",
      ],
      future: [
        "The last card will glimpse into your future.",
        "Let us see what destiny holds in the days ahead.",
        "This card reveals the possibilities of your future.",
        "What lies ahead? This card will tell us.",
        "The third card unveils the road that lies before you.",
        "Let us look forward to the future through this card.",
        "This is the card of your future, showing what may come.",
        "Let this card guide you toward what lies ahead.",
        "The final card hints at the direction of your journey.",
        "This card reveals the potential of your future path.",
      ],
    };

    const positionPhrases = phrases[position];
    const randomIndex = Math.floor(Math.random() * positionPhrases.length);
    return positionPhrases[randomIndex];
  }
  function getReadingIntroduction(): string {
    const introductions = [
      "Let us draw the cards that reveal your path.",
      "Prepare yourself as we uncover the journey ahead.",
      "Let the cards speak and illuminate your story.",
      "We begin a journey through the cards to uncover your past, present, and future.",
      "Let us open the doorway to insight and understanding through the cards.",
      "The cards hold the answers—let us reveal them together.",
      "Prepare to uncover the wisdom of the cards and what they have to tell you.",
      "Let us draw the cards and explore the map of your destiny.",
      "Together, we will unveil the cards that guide your path forward.",
      "Let the cards unfold the mysteries of your past, present, and future.",
      "Prepare to see what the cards reveal about the journey of your life.",
      "Let us draw the cards that shed light on your unique story.",
      "Together, we’ll discover the truths hidden in the cards.",
      "Let the reading begin and the cards illuminate your path.",
    ];

    const randomIndex = Math.floor(Math.random() * introductions.length);
    return introductions[randomIndex];
  }
  function getReadingExplanation(): string {
    const explanations = [
      "This reading will reveal your journey: the first card shows the past, the second card represents the present, and the third card offers a glimpse into the future.",
      "We’ll uncover your story in three parts: past, present, and future, with each card representing a piece of the puzzle.",
      "The first card reflects your past, the second speaks to the present, and the third reveals what lies ahead in the future.",
      "This reading will guide you through time: the first card unveils the past, the second highlights the present, and the third points to the future.",
      "Let’s explore your timeline: the first card delves into your past, the second reveals your present, and the third illuminates your future.",
      "Your reading unfolds in three acts: the past, represented by the first card; the present, shown by the second; and the future, revealed by the third.",
      "The story of your life emerges in three parts: the past through the first card, the present through the second, and the future through the third.",
      "We’ll journey through time with this reading: past, present, and future, each represented by a card in that order.",
      "This spread provides insight across time: the first card explores the past, the second focuses on the present, and the third offers a view of the future.",
      "Let’s read the flow of time: the first card looks back at your past, the second reveals the present moment, and the third offers a vision of your future.",
    ];

    const randomIndex = Math.floor(Math.random() * explanations.length);
    return explanations[randomIndex];
  }
  function getReadingClosing(): string {
    const closings = [
      "May the insights from the cards guide you on your journey ahead.",
      "Take these revelations with you, and let them illuminate your path.",
      "The cards have spoken—now the rest lies in your hands.",
      "Let these insights empower you as you move forward on your journey.",
      "The reading is complete; may clarity and wisdom accompany you.",
      "Carry these messages with you and trust in the path that unfolds.",
      "The cards have shown their wisdom—walk forward with confidence and purpose.",
      "With the cards' guidance, may you find the strength to navigate your journey.",
      "The reading ends here, but the journey continues—step forward with courage.",
      "Let these reflections inspire you as you embrace what lies ahead.",
      "The cards have revealed their truths; now it is time to act on them.",
      "The wisdom of the cards is now yours—go forth with intention and clarity.",
      "May these insights bring you peace and direction on your path.",
      "With the cards' revelations, trust in your ability to face the future.",
    ];

    const randomIndex = Math.floor(Math.random() * closings.length);
    return closings[randomIndex];
  }

  function getCardReadingMessages(
    card: TarotCard,
    cardNumber: number
  ): string[] {
    let array: string[] = [];
    let time: "past" | "present" | "future" = "present";
    switch (cardNumber) {
      case 0:
        array = card.interpretation.past;
        time = "present";
        break;
      case 1:
        array = card.interpretation.present;
        time = "future";
        break;
      case 2:
        array = card.interpretation.future;

        break;
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    return [
      getCardIntroduction(card.name),
      array[randomIndex],
      getCardRevealPhrase(time),
    ];
  }

  const finalMessages = [
    getReadingClosing(),
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
      update((store) => {
        if (!store.flippedCards[index]) return store;

        return {
          ...store,
          selectedCard: store.drawnCards[index],
          isFlipping: false,
        };
      });
    },
    closeModal: () => {
      update((store) => {
        const isCurrentCard =
          store.selectedCard === store.drawnCards[store.currentCardIndex];
        const needsInitialDialogue = isCurrentCard && !store.isReading;

        if (needsInitialDialogue) {
          return {
            ...store,
            selectedCard: null,
            isReading: true,
            currentMessages: getCardReadingMessages(
              store.drawnCards[store.currentCardIndex],
              store.currentCardIndex
            ),
          };
        }

        return {
          ...store,
          selectedCard: null,
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
