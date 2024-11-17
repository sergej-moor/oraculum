<script lang="ts">
  import type { TarotCard } from '$lib/data/tarotCards';
  import { fade } from 'svelte/transition';
  import Card from './Card.svelte';

  const { card, onClose } = $props<{
    card: TarotCard;
    onClose: () => void;
  }>();

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }
</script>

<div 
  class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 sm:p-8 md:p-12"
  transition:fade={{ duration: 200 }}
  on:click={handleBackdropClick}
  role="dialog"
  aria-modal="true"
>
  <div class="relative w-full max-h-[90vh] aspect-[2/3] max-w-[min(90vh*0.66,90vw)] flex items-center justify-center">
    <div class="absolute inset-0">
      <Card 
        cardData={card}
        isFlipped={true}
        onFlip={() => {}}
        position={0}
        cardNumber={0}
        isModal={true}
      />
    </div>
  </div>
</div> 