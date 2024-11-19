<script lang="ts">
  import { readingStore } from '$lib/stores/readingStore';
  import { tarotCards, type TarotCard } from '../data/tarotCards';
  import Card from './Card.svelte';
  import Modal from './Modal.svelte';
  import gsap from 'gsap';

  let cardContainers: (HTMLElement | null)[] = [];
  let cards = $state<TarotCard[]>([]);
  let isAnimating = $state(false);
  let hasDrawn = $state(false);

  function bindContainer(node: HTMLElement, index: number) {
    cardContainers[index] = node;
    if (cardContainers.filter(c => c !== null).length === cards.length && !hasDrawn) {
      requestAnimationFrame(() => animateCards());
    }
    return {
      destroy() {
        cardContainers[index] = null;
      }
    };
  }

  function animateCards() {
    if (isAnimating || hasDrawn) return;
    
    const validContainers = cardContainers.filter((container): container is HTMLElement => container !== null);
    if (validContainers.length !== cards.length) return;
    
    isAnimating = true;
    validContainers.forEach(container => {
      container.style.opacity = '0';
      container.style.transform = 'translateY(-100px) scale(0.3)';
    });

    gsap.to(validContainers, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      stagger: 0.15,
      ease: "back.out(1.7)",
      onComplete: () => {
        isAnimating = false;
        hasDrawn = true;
        readingStore.drawCards(cards);
      }
    });
  }

  $effect(() => {
    if ($readingStore.state === 'drawing' && !isAnimating && !hasDrawn) {
      cardContainers = [];
      cards = [...tarotCards]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    }
  });

  function handleCardClick(index: number) {
    if ($readingStore.isFlipping) return;
    
    if (!$readingStore.flippedCards[index] && 
        !isAnimating && 
        !$readingStore.isReading && 
        index === $readingStore.currentCardIndex) {
      readingStore.flipCard(index);
      setTimeout(() => {
        readingStore.showModal(index);
      }, 700);
    } else if ($readingStore.flippedCards[index]) {
      readingStore.showModal(index);
    }
  }

  $effect(() => {
    if ($readingStore.state === 'intro') {
      hasDrawn = false;
      cards = [];
      cardContainers = [];
    }
  });
</script>

<div class="flex flex-col h-full w-full p-1 md:p-2">
  {#if cards.length > 0}
    <div class="grid  grid-cols-3 gap-0.5 xs:gap-1 md:gap-2 lg:gap-3 h-[calc(100%-100px)]">
      {#each cards as card, i}
        <div 
          class="flex items-start justify-center w-full "
          use:bindContainer={i}
        >
          <Card 
            cardData={card}
            isFlipped={$readingStore.flippedCards[i]}
            onFlip={() => handleCardClick(i)}
            position={i}
            cardNumber={i + 1}
          />
        </div>
      {/each}
    </div>
  {/if}
</div>

{#if $readingStore.selectedCard}
  <Modal 
    card={$readingStore.selectedCard} 
    onClose={() => readingStore.closeModal()} 
  />
{/if}