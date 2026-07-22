<div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
  <!-- Base gradient (mais próximo da referência: rosa/pêssego luminoso) -->
  <div class="absolute inset-0 bg-gradient-to-br from-[#fffaf7] via-[#fff0f5] to-[#f8f4ff]"></div>
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(255,0,105,0.14),transparent_42%)]"></div>
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,rgba(255,122,0,0.14),transparent_40%)]"></div>
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_90%,rgba(118,56,250,0.10),transparent_45%)]"></div>

  <!-- Orbs grandes e luminosos -->
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>
  <div class="orb orb-3"></div>
  <div class="orb orb-4"></div>

  <!-- Bolhas flutuantes (como na referência) -->
  <div class="bubble b1"></div>
  <div class="bubble b2"></div>
  <div class="bubble b3"></div>
  <div class="bubble b4"></div>
  <div class="bubble b5"></div>

  <!-- Grade sutil no topo -->
  <div class="grid-fade"></div>

  <!-- Noise -->
  <div class="noise"></div>
</div>

<style>
  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(72px);
    opacity: 0.55;
    animation: float 18s ease-in-out infinite;
    will-change: transform;
  }

  .orb-1 {
    width: 30rem;
    height: 30rem;
    top: -10rem;
    left: -12rem;
    background: radial-gradient(circle, rgba(255, 0, 105, 0.55), transparent 70%);
  }

  .orb-2 {
    width: 34rem;
    height: 34rem;
    top: 15%;
    right: -14rem;
    background: radial-gradient(circle, rgba(255, 122, 0, 0.48), transparent 70%);
    animation-delay: -6s;
  }

  .orb-3 {
    width: 26rem;
    height: 26rem;
    bottom: -8rem;
    left: 25%;
    background: radial-gradient(circle, rgba(118, 56, 250, 0.42), transparent 70%);
    animation-delay: -12s;
  }

  .orb-4 {
    width: 18rem;
    height: 18rem;
    top: 45%;
    left: -4rem;
    background: radial-gradient(circle, rgba(255, 214, 0, 0.28), transparent 70%);
    animation-delay: -9s;
  }

  .bubble {
    position: absolute;
    border-radius: 999px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.55), rgba(255, 0, 105, 0.12));
    border: 1px solid rgba(255, 255, 255, 0.45);
    box-shadow: 0 8px 24px rgba(225, 48, 108, 0.08);
    backdrop-filter: blur(6px);
    animation: bubbleFloat 14s ease-in-out infinite;
  }

  .b1 { width: 5.5rem; height: 5.5rem; top: 12%; left: 6%; animation-delay: 0s; opacity: 0.7; }
  .b2 { width: 3.5rem; height: 3.5rem; top: 28%; right: 10%; animation-delay: -3s; opacity: 0.55; }
  .b3 { width: 7rem; height: 7rem; bottom: 18%; right: 8%; animation-delay: -7s; opacity: 0.45; }
  .b4 { width: 2.75rem; height: 2.75rem; top: 55%; left: 12%; animation-delay: -5s; opacity: 0.5; }
  .b5 { width: 4.5rem; height: 4.5rem; bottom: 12%; left: 35%; animation-delay: -10s; opacity: 0.4; }

  .grid-fade {
    position: absolute;
    inset: 0;
    opacity: 0.35;
    background-image:
      linear-gradient(rgba(225, 48, 108, 0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(225, 48, 108, 0.045) 1px, transparent 1px);
    background-size: 42px 42px;
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.45), transparent 70%);
  }

  .noise {
    position: absolute;
    inset: 0;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(2.5rem, 3rem) scale(1.06); }
    50% { transform: translate(-2rem, 4.5rem) scale(0.94); }
    75% { transform: translate(3rem, -1.5rem) scale(1.03); }
  }

  @keyframes bubbleFloat {
    0%, 100% { transform: translateY(0) translateX(0); }
    50% { transform: translateY(-18px) translateX(8px); }
  }
</style>
