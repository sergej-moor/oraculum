<script lang="ts">
  import { tarotCards, type TarotCard } from '../data/tarotCards';
  import Card from './Card.svelte';
  import Modal from './Modal.svelte';
  import gsap from 'gsap';

  let drawnCards = $state<TarotCard[]>([]);
  let isDrawing = $state(false);
  let flippedStates = $state<boolean[]>([]);
  let selectedCard = $state<TarotCard | null>(null);
  let isFlipping = $state(false);
  let cardContainers: HTMLElement[] = [];

  function bindContainer(node: HTMLElement, index: number) {
    cardContainers[index] = node;
    return {
      destroy() {
        cardContainers[index] = null;
      }
    };
  }

  function drawCards() {
    if (isDrawing || drawnCards.length > 0) return;
    isDrawing = true;
    
    // First set the cards data
    drawnCards = [...tarotCards]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    flippedStates = new Array(drawnCards.length).fill(false);

    // After the DOM updates, animate the cards
    setTimeout(() => {
      gsap.fromTo(cardContainers, 
        {
          opacity: 0,
          scale: 0.3,
          y: -100,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.15,
          ease: "back.out(1.7)",
          onComplete: () => {
            isDrawing = false;
          }
        }
      );
    }, 0);
  }

  function handleCardClick(index: number) {
    if (isFlipping) return;
    
    if (!flippedStates[index]) {
      isFlipping = true;
      flippedStates[index] = true;
      setTimeout(() => {
        selectedCard = drawnCards[index];
        isFlipping = false;
      }, 700);
    } else {
      selectedCard = drawnCards[index];
    }
  }

  function closeModal() {
    selectedCard = null;
  }
</script>

<div class="flex flex-col h-full w-full p-1 md:p-2">
  <!-- Deck and button -->
  <div class="flex flex-col items-center gap-1 mb-2">
    <button 
      on:click={drawCards}
      disabled={isDrawing || drawnCards.length > 0}
      class="px-2 py-1 md:px-3 md:py-1.5 bg-purple-700 text-white rounded-lg hover:bg-purple-600 
             disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors
             text-xs md:text-sm"
    >
      Draw Cards
    </button>
  </div>

  <!-- Drawn cards display -->
  {#if drawnCards.length > 0}
    <div class="grid grid-rows-2 grid-cols-3 gap-0.5 xs:gap-1 md:gap-2 lg:gap-3 h-[calc(100%-100px)]" >
      {#each drawnCards as card, i}
        <div 
          class="flex items-center justify-center w-full h-full"
          use:bindContainer={i}
        >
          <Card 
            cardData={card}
            isFlipped={flippedStates[i]}
            onFlip={() => handleCardClick(i)}
            position={i}
            cardNumber={i + 1}
          />
        </div>
      {/each}
    </div>
  {/if}
</div>

{#if selectedCard}
  <Modal card={selectedCard} onClose={closeModal} />
{/if}