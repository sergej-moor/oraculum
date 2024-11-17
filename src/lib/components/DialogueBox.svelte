<script lang="ts">
    import {onDestroy} from "svelte"
  const { messages = [] } = $props<{
    messages: string[];
  }>();

  let currentMessage = $state('');
  let messageIndex = $state(0);
  let charIndex = $state(0);
  let isTyping = $state(false);
  let typingSpeed = 50; // ms per char
  let timeoutId: number;

  function sleep(ms: number) {
    return new Promise(resolve => {
      timeoutId = setTimeout(resolve, ms) as unknown as number;
    });
  }

  async function typeMessage() {
    if (messageIndex >= messages.length) return;
    
    isTyping = true;
    const targetMessage = messages[messageIndex];
    charIndex = 0;
    currentMessage = '';

    for (let i = 0; i <= targetMessage.length; i++) {
      currentMessage = targetMessage.slice(0, i);
      charIndex = i;
      await sleep(typingSpeed);
    }

    isTyping = false;
  }

  function nextMessage() {
    if (isTyping) {
      // If still typing, complete the current message instantly
      clearTimeout(timeoutId);
      currentMessage = messages[messageIndex];
      charIndex = messages[messageIndex].length;
      isTyping = false;
      return;
    }

    if (messageIndex < messages.length - 1) {
      messageIndex++;
      typeMessage();
    }
  }

  $effect(() => {
    if (messages.length > 0) {
      typeMessage();
    }
  });

  onDestroy(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });
</script>

<div 
  class="bg-slate-800/90 text-white p-4 rounded-lg shadow-lg border border-slate-600
         max-w-2xl mx-auto my-4 min-h-[120px] cursor-pointer"
  onclick={nextMessage}
  onkeydown={e => e.key === ' ' || e.key === 'Enter' ? nextMessage() : null}
  role="button"
  tabindex="0"
>
  <p class="font-pixel text-lg leading-relaxed">
    {currentMessage}
    {#if isTyping}
      <span class="animate-pulse">▊</span>
    {/if}
  </p>
  {#if !isTyping && messageIndex < messages.length - 1}
    <div class="text-sm text-slate-400 mt-2 animate-bounce">
      Click to continue...
    </div>
  {/if}
</div>

<style>
  .font-pixel {
    font-family: 'Press Start 2P', system-ui, sans-serif;
    -webkit-font-smoothing: none;
    font-smooth: never;
  }
</style> 