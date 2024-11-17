<script lang="ts">
  import { tarotCards, type TarotCard } from '../data/tarotCards';
  import Card from './Card.svelte';

  let drawnCards = $state<TarotCard[]>([]);
  let isDrawing = $state(false);
  let flippedStates = $state<boolean[]>([]);

  function drawCards() {
    if (isDrawing || drawnCards.length > 0) return;
    isDrawing = true;
    
    drawnCards = [...tarotCards]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    isDrawing = false;
  }

  function handleFlip(index: number) {
    if (!flippedStates[index]) {
      flippedStates[index] = true;
    }
  }
</script>

<div class="flex flex-col h-full w-full p-1 md:p-2">
  <!-- Deck and button -->
  <div class="flex flex-col items-center gap-1 mb-2">
    <button 
      onclick={drawCards}
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
    <div class="grid grid-rows-2 grid-cols-3 gap-0.5 xs:gap-1 md:gap-2 lg:gap-3 h-[calc(100%-100px)]">
      {#each drawnCards as card, i}
        <div class="flex items-center justify-center w-full h-full">
          <Card 
            cardData={card}
            isFlipped={flippedStates[i]}
            onFlip={() => handleFlip(i)}
            position={i}
            cardNumber={i + 1}
          />
        </div>
      {/each}
    </div>
  {/if}
</div> 