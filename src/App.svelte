<script lang="ts">
  import { readingStore } from '$lib/stores/readingStore';
  import Deck from '$lib/components/Deck.svelte';
  import DialogueBox from '$lib/components/DialogueBox.svelte';
  import StarField from '$lib/components/StarField.svelte';

  function handleDialogueComplete() {
    const store = $readingStore;
    
    if (store.state === 'intro') {
      readingStore.startDrawing();
    } else if (store.state === 'reading' && store.isReading) {
      readingStore.completeReading();
    } else if (store.state === 'complete') {
      readingStore.reset();
    }
  }
</script>

<style>
  .float-container {
    position: relative;
    height: 60%;
    overflow: hidden;
  }

  .float-image {
    animation: floatUpDown 30s ease-in-out infinite;
    position: absolute;
    width: 100%;
    height: 110%; /* Slightly taller to allow movement */
  }

  @keyframes floatUpDown {
    0% { transform: translateY(0); }
    50% { transform: translateY(-5%); }
    100% { transform: translateY(0); }
  }
</style>

<div class="overflow-hidden bg-repeat flex flex-col justify-center items-center min-h-screen w-screen relative" 
     style="background-image: url('/background.png');">
  <StarField />
  <div class="overflow-hidden bg-repeat flex flex-col md:flex-row md:justify-center 
              w-full max-w-[95%] md:max-w-screen-md lg:max-w-screen-lg 
              h-[90vh] md:h-[70vh] lg:h-[80vh] 
              items-center gap-4 relative z-10">
    <div class="xs:max-w-sm w-full md:w-2/5 h-1/2 md:h-full flex flex-col gap-2 md:gap-4 ">
      <div class="float-container border-white border-2 rounded-xl">
        <img 
          src="/fortune-teller.webp" 
          class="float-image object-cover"
          alt="Fortune teller"
        >
      </div>
      <DialogueBox 
        messages={$readingStore.currentMessages}
        gameState={$readingStore.state}
        onComplete={handleDialogueComplete}
        currentCardIndex={$readingStore.currentCardIndex}
      />
    </div>

    <div class=" rounded-xl w-full md:w-3/5 h-1/2 md:h-full xs:max-w-sm md:max-w-full">
      <Deck />
    </div>
  </div>
</div> 