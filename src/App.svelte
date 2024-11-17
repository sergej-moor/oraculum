<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import Card from './lib/components/Card.svelte';
  import { tarotCards, type TarotCard } from './lib/data/tarotCards';

  let isDealing = $state(false);
  let isCollecting = $state(false);
  let isDealt = $state(false);
  let showCards = $state(true);
  let cardElements: HTMLElement[] = [];
  let flippedStates = $state([false, false, false]);
  let currentCardData = $state<TarotCard[]>([]);

  // Compute if all cards are flipped
  let allCardsFlipped = $derived(flippedStates.every(state => state === true));

  // Responsive card spread values
  function getSpreadX(i: number) {

    const baseSpread = window.innerWidth < 420 ? 100 :
                      window.innerWidth < 640 ? 150 : 
                      window.innerWidth < 768 ? 200 :
                      window.innerWidth < 1024 ? 300 : 400;
    return (i - 1) * baseSpread;
  }

  function getRandomCards(): TarotCard[] {
    return [...tarotCards]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  }

  onMount(() => {
    gsap.set(cardElements, {
      x: (i) => getSpreadX(i),
      y: -window.innerHeight,
      rotate: 0,
      opacity: 0
    });

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  function handleResize() {
    if (isDealt && !isDealing && !isCollecting) {
      gsap.to(cardElements, {
        x: (i) => getSpreadX(i),
        duration: 0.3
      });
    }
  }

  function dealCards() {
    if (isDealing || isCollecting || isDealt) return;
    isDealing = true;
    flippedStates = [false, false, false];
    currentCardData = getRandomCards();

    gsap.to(cardElements, {
      x: (i) => getSpreadX(i),
      y: 0,
      rotate: (i) => (i - 1) * 5,
      opacity: 1,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out",
      onComplete: () => {
        isDealing = false;
        isDealt = true;
      }
    });
  }

  function collectCards() {
    if (isDealing || isCollecting || !isDealt || !allCardsFlipped) return;
    isCollecting = true;

    flippedStates = [false, false, false];

    // Wait for flip animation to complete before collecting
    setTimeout(() => {
      gsap.to(cardElements, {
        x: 0,
        y: -window.innerHeight,
        rotate: 0,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.in",
        onComplete: () => {
          isCollecting = false;
          isDealt = false;
          currentCardData = [];
        }
      });
    }, 700);
  }

  function handleFlip(index: number) {
    if (!isDealt || isDealing || isCollecting || flippedStates[index]) return;
    flippedStates[index] = true;
  }


  import DialogueBox from '$lib/components/DialogueBox.svelte';
  
  const dialogueMessages = [
    "Welcome to the mystical realm of tarot...",
    "I sense you seek guidance and wisdom...",
    "Let the cards reveal your path...",
  ];
</script>
<DialogueBox messages={dialogueMessages} />
<div class="flex justify-center items-center min-h-screen bg-gray-900 overflow-hidden">
  <div class="relative w-full self-start shadow-table shadow-purple-950 h-48 sm:h-80 md:h-96 lg:h-[32rem] bg-purple-950">
    {#if showCards}
      {#each Array(3) as _, i (i)}
        <div 
          bind:this={cardElements[i]}
          class="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2"
        >
          <Card 
            position={i}
            cardNumber={i + 1}
            cardData={currentCardData[i]}
            isFlipped={flippedStates[i]}
            onFlip={() => handleFlip(i)}
          />
        </div>
      {/each}
    {/if}
  </div>



  <div class="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 flex gap-2 sm:gap-4">
    <button
      class="px-3 py-2 sm:px-4 sm:py-2 md:px-5 md:py-3 lg:px-6 lg:py-3 
             bg-white rounded-lg text-blue-800 text-sm sm:text-base md:text-lg font-bold
             hover:bg-gray-100 transition-colors disabled:opacity-50"
      on:click={dealCards}
      disabled={isDealing || isCollecting || isDealt}
    >
      {isDealing ? 'Dealing...' : 'Deal Cards'}
    </button>

    <button
      class="px-3 py-2 sm:px-4 sm:py-2 md:px-5 md:py-3 lg:px-6 lg:py-3 
             bg-white rounded-lg text-blue-800 text-sm sm:text-base md:text-lg font-bold
             hover:bg-gray-100 transition-colors disabled:opacity-50"
      on:click={collectCards}
      disabled={isDealing || isCollecting || !isDealt || !allCardsFlipped}
    >
      {isCollecting ? 'Collecting...' : 'Collect Cards'}
    </button>
  </div>
</div>
