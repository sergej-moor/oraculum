<script lang="ts">
  import { readingStore } from '$lib/stores/readingStore';
  import Deck from '$lib/components/Deck.svelte';
  import DialogueBox from '$lib/components/DialogueBox.svelte';

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

<div class="overflow-hidden bg-repeat flex flex-col justify-center items-center min-h-screen w-screen" 
     style="background-image: url('/background.png');">
  <div class="overflow-hidden bg-repeat flex flex-col md:flex-row md:justify-center 
              w-full max-w-[95%] md:max-w-screen-md lg:max-w-screen-lg 
              h-[90vh] md:h-[70vh] lg:h-[80vh] 
              items-center gap-4">
    <div class="xs:max-w-sm w-full md:w-2/5 h-1/2 md:h-full flex flex-col gap-2 md:gap-4">
      <img 
        src="/fortune-teller.webp" 
        class="border-white border-2 rounded-xl object-cover h-3/5" 
        alt="Fortune teller"
      >
      <DialogueBox 
        messages={$readingStore.currentMessages}
        
        onComplete={handleDialogueComplete}
      />
    </div>

    <div class="border-white border-2 rounded-xl w-full md:w-3/5 h-1/2 md:h-full xs:max-w-sm md:max-w-full">
      <Deck />
    </div>
  </div>
</div> 