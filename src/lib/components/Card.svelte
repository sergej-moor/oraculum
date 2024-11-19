<script lang="ts">
  import cardBack from '$assets/cards/card_back.webp';
  import type { TarotCard } from '$lib/data/tarotCards';
  import gsap from 'gsap';

  const { cardData, isFlipped, onFlip, position, cardNumber, isModal = false } = $props<{
    cardData?: TarotCard;
    isFlipped: boolean;
    onFlip: () => void;
    position: number;
    cardNumber: number;
    isModal?: boolean;
  }>();

  let cardImage = $state<string>('');
  let error = $state<string | null>(null);
  let textElement = $state<HTMLSpanElement | null>(null);
  let imageElement = $state<HTMLImageElement | null>(null);
  let cardFront = $state<HTMLDivElement | null>(null);

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


  $effect(() => {
    if (cardFront && isFlipped) {
      gsap.to(cardFront, {
        '--gradient-position': '-20%',
        duration: 2,
        repeat: -1,
        ease: 'none',
        repeatDelay: 2,
        delay: 2
      });
    }
  });
</script>

<button
  class="w-full aspect-[2/3] relative

         cursor-pointer preserve-3d transition-transform duration-700 m-1"
  style="transform-origin: center; transform: rotateY({isFlipped ? '180deg' : '0deg'});"
  on:click={onFlip}
>
  <!-- Card Back -->
  <div class="absolute inset-0 w-full h-full backface-hidden">
    <img 
      src={cardBack} 
      alt="Card back" 
      class="w-full h-full object-cover rounded-lg shadow-lg"
    />
  </div>

  <!-- Card Front -->
  <div 
    bind:this={cardFront}
    class="absolute inset-0 w-full h-full backface-hidden bg-white rounded-lg overflow-hidden border-white border-2 holo-card
          {isModal ? 'rounded-3xl' : ''}"
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
                 h-1/3 pointer-events-none "
        ></div>
        <div 
          class="absolute bottom-0 left-0 right-0 my-2 sm:my-4
                 text-center"
        >
          <div class="inline-block px-2 sm:px-4 ">
            <span
              bind:this={textElement}
              class="font-merriweather  text-white 
                     text-xs lg:text-base 
                              {isModal ? 'text-[1.2rem] sm:text-3xl lg:text-3xl mb-8' : ''}
                     inline-block smooth-text mix-blend-difference bg-black p-1
                     "
            >
              {cardData?.name }
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
    perspective: 1000px;
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
  .holo-card {
    --gradient-position: 120%;
    position: relative;
  }

  .holo-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      transparent 0%,
      transparent 40%,
      rgba(255, 255, 255, 0.4) 45%,
      rgba(255, 255, 255, 0.7) 50%,
      rgba(255, 255, 255, 0.4) 55%,
      transparent 60%,
      transparent 100%
    );
    background-position-x: var(--gradient-position);
    background-size: 400% 100%;
    mix-blend-mode: overlay;
    pointer-events: none;
    z-index: 2;
  }
</style> 