<script lang="ts">
  import cardBack from '$assets/cards/card_back.webp';
  import type { TarotCard } from '$lib/data/tarotCards';
  import gsap from 'gsap';

  const { cardData, isFlipped, onFlip, position, cardNumber } = $props<{
    cardData?: TarotCard;
    isFlipped: boolean;
    onFlip: () => void;
    position: number;
    cardNumber: number;
  }>();

  let cardImage = $state<string>('');
  let error = $state<string | null>(null);
  let textElement = $state<HTMLSpanElement | null>(null);
  let imageElement = $state<HTMLImageElement | null>(null);

  // Import all card images at build time
  const images = import.meta.glob('/src/assets/cards/**/*.webp', {
    eager: true,
    import: 'default'
  });

  $effect(() => {
    if (cardData?.image) {
      const imagePath = cardData.image.replace('$assets', '/src/assets');
      if (imagePath in images) {
        cardImage = images[imagePath] as string;
      } else {
        error = `Image not found: ${imagePath}`;
        console.error('Available images:', Object.keys(images));
        console.error('Attempted path:', imagePath);
      }
    }
  });

  // Create floating animation for text
  $effect(() => {
    if (textElement) {
      gsap.to(textElement, {
        y: -4,
        scale: 1.08,
        duration: 3,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "center center",
        smoothOrigin: true
      });
    }
  });

  // Create subtle pulse animation for the image
  $effect(() => {
    if (imageElement) {
      gsap.to(imageElement, {
        scale: 1.04,
        duration: 6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    }
  });
</script>

<button
  class="w-full aspect-[2/3] 
         max-w-[70px] xs:max-w-[75px] sm:max-w-[80px] md:max-w-[100px] lg:max-w-[120px]
         cursor-pointer preserve-3d transition-transform duration-700"
  style="transform-origin: center; transform: rotateY({isFlipped ? '180deg' : '0deg'});"
  onclick={onFlip}
>
  <!-- Card Back -->
  <div class="absolute w-full h-full backface-hidden">
    <img 
      src={cardBack} 
      alt="Card back" 
      class="w-full h-full object-cover rounded-lg shadow-lg"
    />
  </div>

  <!-- Card Front -->
  <div 
    class="absolute w-full h-full backface-hidden bg-white rounded-lg shadow-lg overflow-hidden"
    style="transform: rotateY(180deg);"
  >
    {#if error}
      <div class="text-red-500 p-4">{error}</div>
    {:else if cardImage}
      <div class="relative w-full h-full">
        <img 
          bind:this={imageElement}
          src={cardImage} 
          alt={cardData?.name} 
          class="w-full h-full object-cover"
        />
        <div 
          class="absolute bottom-0 left-0 right-0
                 bg-gradient-to-t from-black/60 via-black/30 to-transparent
                 h-1/3 pointer-events-none"
        ></div>
        <div 
          class="absolute bottom-0 left-0 right-0 my-2 sm:my-4
                 text-center"
        >
          <div class="inline-block px-2 sm:px-4">
            <span
              bind:this={textElement}
              class="font-chokokutai font-bold text-white
                     text-xs sm:text-base md:text-base lg:text-lg
                     inline-block smooth-text
                     "
            >
              {cardData?.name ?? `Card ${cardNumber}`}
            </span>
          </div>
        </div>
      </div>
    {/if}
  </div>
</button>

<style>
  .preserve-3d {
    transform-style: preserve-3d;
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
  .smooth-text {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
    will-change: transform;

    letter-spacing: 0.5px;
  }
</style> 