<script lang="ts">
  import cardBack from '../../assets/placeholder_back-min.jpg';
  import type { TarotCard } from '../data/tarotCards';
  
  export let cardData: TarotCard | undefined = undefined;
  export let isFlipped: boolean = false;
  export let onFlip: () => void;
  export let position: number;
  export let cardNumber: number;
</script>

<button
  class="w-16 h-32 xs:w-24 xs:h-32 sm:w-40 sm:h-56 md:w-48 md:h-64 lg:w-56 lg:h-80 
         cursor-pointer preserve-3d transition-transform duration-700"
  style="transform-origin: center; transform: rotateY({isFlipped ? '180deg' : '0deg'});"
  on:click={onFlip}
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
    class="absolute w-full h-full backface-hidden bg-white rounded-lg shadow-lg p-2 sm:p-4 
           flex flex-col justify-center items-center"
    style="transform: rotateY(180deg);"
  >
    <div class="text-base sm:text-lg md:text-xl lg:text-2xl text-center font-serif text-gray-800">
      {cardData?.name ?? `Card ${cardNumber}`}
    </div>
  </div>
</button>

<style>
  .preserve-3d {
    transform-style: preserve-3d;
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
</style> 