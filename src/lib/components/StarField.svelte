<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';

  let layer1: HTMLDivElement;
  let layer2: HTMLDivElement;
  let layer3: HTMLDivElement;
  let twinkleStars: HTMLDivElement;

  onMount(() => {
    // Diagonal scrolling animations for layers
    gsap.to(layer1, {
      backgroundPosition: '100px 1000px',
      duration: 100,
      repeat: -1,
      ease: 'none'
    });

    gsap.to(layer2, {
      backgroundPosition: '200px 1000px',
      duration: 150,
      repeat: -1,
      ease: 'none'
    });

    gsap.to(layer3, {
      backgroundPosition: '300px 1000px',
      duration: 200,
      repeat: -1,
      ease: 'none'
    });

    // Create twinkling stars
    const stars = Array.from({ length: 15 }).map(() => {
      const star = document.createElement('div');
      star.className = 'absolute w-0.5 h-0.5 bg-white rounded-full';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      twinkleStars.appendChild(star);
      
      // Random animation for each star
      gsap.to(star, {
        opacity: 0.2,
        duration: 0.5 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: Math.random() * 2
      });

      // Smaller scale pulsing
      gsap.to(star, {
        scale: 0.3 + Math.random() * 0.3,
        duration: 1 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: Math.random() * 2
      });

      return star;
    });
  });
</script>

<div class="absolute inset-0 overflow-hidden">
  <!-- Background star layers -->
  <div
    bind:this={layer1}
    class="absolute inset-0 bg-repeat"
    style="background-image: radial-gradient(1px 1px at 20px 30px, #eee, rgba(0,0,0,0)),
           radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)),
           radial-gradient(1px 1px at 90px 40px, #ddd, rgba(0,0,0,0));
           background-size: 100px 100px;"
  ></div>
  
  <div
    bind:this={layer2}
    class="absolute inset-0 bg-repeat opacity-50"
    style="background-image: radial-gradient(1.5px 1.5px at 50px 60px, #eee, rgba(0,0,0,0)),
           radial-gradient(1px 1px at 15px 40px, #fff, rgba(0,0,0,0)),
           radial-gradient(1px 1px at 80px 120px, #ddd, rgba(0,0,0,0));
           background-size: 120px 120px;"
  ></div>
  
  <div
    bind:this={layer3}
    class="absolute inset-0 bg-repeat opacity-30"
    style="background-image: radial-gradient(2px 2px at 100px 100px, #fff, rgba(0,0,0,0)),
           radial-gradient(1.5px 1.5px at 50px 160px, #ddd, rgba(0,0,0,0)),
           radial-gradient(1px 1px at 180px 80px, #eee, rgba(0,0,0,0));
           background-size: 200px 200px;"
  ></div>

  <!-- Twinkling stars container -->
  <div bind:this={twinkleStars} class="absolute inset-0">
    <!-- Stars will be dynamically added here -->
  </div>

  <!-- Smaller glowing stars -->
  <div class="absolute inset-0">
    {#each Array(3) as _, i}
      <div 
        class="absolute w-1 h-1 bg-white rounded-full animate-glow"
        style="left: {Math.random() * 100}%; top: {Math.random() * 100}%; 
               animation-delay: {Math.random() * 3}s;"
      ></div>
    {/each}
  </div>
</div>

<style>
  @keyframes glow {
    0%, 100% {
      transform: scale(1);
      opacity: 0.8;
      filter: blur(0px);
    }
    50% {
      transform: scale(1.2);
      opacity: 0.5;
      filter: blur(1px);
    }
  }

  .animate-glow {
    animation: glow 4s ease-in-out infinite;
  }
</style> 