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
<div class="overflow-hidden bg-repeat flex flex-col justify-center items-center min-h-screen w-screen" style="background-image: url('/background.png');">
  <div class="overflow-hidden bg-repeat flex flex-col md:flex-row  md:justify-center 
              w-full max-w-[95%] md:max-w-screen-md lg:max-w-screen-lg 
              h-[90vh] md:h-[70vh] lg:h-[80vh] 
               items-center gap-4 ">
    <!-- fortune teller -->
    <div class="xs:max-w-sm w-full md:w-2/5 h-1/2 md:h-full flex flex-col gap-2 md:gap-4">
      <img 
        src="/fortune-teller.webp" 
        class="border-white border-2 rounded-xl object-cover h-3/5 " 
        alt="Fortune teller"
      >
      <DialogueBox messages={dialogueMessages} />
    </div>

    <!-- card area -->
    <div class="border-white border-2 rounded-xl w-full md:w-3/5 h-1/2 md:h-full xs:max-w-sm md:max-w-full  ">
    </div>
  </div>
  <nav class="text-xs py-1 w-full text-right max-w-[95%] md:max-w-screen-md lg:max-w-screen-lg xs:max-w-sm   text-gray-400">
    About
  </nav>
</div> 