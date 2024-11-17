<script lang="ts">
  import { onDestroy } from "svelte";

  const { messages = [], onComplete } = $props<{
    messages: string[];
    onComplete: () => void;
  }>();

  let currentMessage = $state('');
  let messageIndex = $state(0);
  let isTyping = $state(false);
  let typingSpeed = 5;
  let timeoutId: number;

  async function typeMessage(message: string) {
    isTyping = true;
    currentMessage = '';

    for (let i = 0; i <= message.length; i++) {
      currentMessage = message.slice(0, i);
      await new Promise(resolve => {
        timeoutId = setTimeout(resolve, typingSpeed) as unknown as number;
      });
    }

    isTyping = false;
  }

  function nextMessage() {
    if (isTyping) return;

    if (messageIndex < messages.length - 1) {
      messageIndex++;
      typeMessage(messages[messageIndex]);
    } else {
      onComplete();
    }
  }

  // Reset and start typing when messages change
  $effect(() => {
    if (messages.length > 0) {
      messageIndex = 0;
      typeMessage(messages[0]);
    }
  });

  onDestroy(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });
</script>

<div 
  class="text-white border-white border-2 rounded-xl text-center
         max-w-2xl mx-auto p-4 h-full cursor-pointer w-full"
  on:click={nextMessage}
  on:keydown={e => e.key === ' ' || e.key === 'Enter' ? nextMessage() : null}
  role="button"
  tabindex="0"
>
  <p class="text-sm leading-relaxed">
    {currentMessage}
    {#if isTyping}
      <span class="animate-pulse">|</span>
    {/if}
  </p>
  {#if !isTyping && messageIndex < messages.length - 1}
    <div class="text-sm text-slate-400 mt-2 animate-bounce">
      Click to continue...
    </div>
  {/if}
</div>

