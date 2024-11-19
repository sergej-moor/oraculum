<script lang="ts">
  import { onDestroy } from "svelte";
  import { fade } from 'svelte/transition';
  import type { ReadingState } from '$lib/stores/readingStore';

  const { messages = [], gameState, onComplete, currentCardIndex = 0 } = $props<{
    messages: string[];
    gameState: ReadingState;
    onComplete: () => void;
    currentCardIndex: number;
  }>();

  let currentMessage = $state('');
  let messageIndex = $state(0);
  let isTyping = $state(false);
  let isShowingPrompt = $state(false);
  let typingSpeed = 10;
  let timeoutId: number;
  let previousMessages = $state<string[]>([]);

  async function typeMessage(message: string) {
    isTyping = true;
    isShowingPrompt = false;
    currentMessage = '';

    for (let i = 0; i <= message.length; i++) {
      currentMessage = message.slice(0, i);
      await new Promise(resolve => {
        timeoutId = setTimeout(resolve, typingSpeed) as unknown as number;
      });
    }

    isTyping = false;
    
    setTimeout(() => {
      isShowingPrompt = true;
    }, 500);

    if (messageIndex === messages.length - 1) {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  }

  function nextMessage() {
    if (isTyping) return;

    if (messageIndex < messages.length - 1) {
      messageIndex++;
      typeMessage(messages[messageIndex]);
    }
  }

  // Only reset and start typing when we get a new set of messages
  $effect(() => {
    if (messages.length > 0 && 
        (previousMessages.length === 0 || 
         JSON.stringify(messages) !== JSON.stringify(previousMessages))) {
      messageIndex = 0;
      previousMessages = messages;
      typeMessage(messages[0]);
    }
  });

  function getRevealMessage(index: number): string {
    switch (index) {
      case 0:
        return 'Reveal your past...';
      case 1:
        return 'Reveal your present...';
      case 2:
        return 'Reveal your future...';
      default:
        return 'Reveal your next card...';
    }
  }

  onDestroy(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });
</script>

<div 
  class="text-white font-merriweather rounded-xl text-center
         max-w-2xl mx-auto p-4 h-2/5 cursor-pointer w-full  "
  on:click={nextMessage}
  on:keydown={e => e.key === ' ' || e.key === 'Enter' ? nextMessage() : null}
  role="button"
  tabindex="0"
>
  <p class="text-sm leading-relaxed mb-6 ">
    {currentMessage}
    {#if isTyping}
      <span class="animate-pulse">|</span>
    {/if}
  </p>
  {#if !isTyping && isShowingPrompt}
    {#if messageIndex < messages.length - 1}
      <div 
        class="text-xs text-slate-400  animate-bounce "
        transition:fade={{ duration: 500 }}
      >
        Click to continue...
      </div>
    {:else if gameState !== 'complete'}
      <div 
        class="text-xs text-slate-400  animate-bounce"
        transition:fade={{ duration: 500 }}
      >
        {getRevealMessage(currentCardIndex)}
      </div>
    {/if}
  {/if}
</div>

