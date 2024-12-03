<template>
    <div class="ai-nodes">
      <div class="container">
        <div class="nodes-content">
          <div class="nodes-header">
            <ServerIcon class="header-icon" />
            <h1>AI Nodes</h1>
            <p class="description">AI Nodes contribute computing resources to the AI network to earn rewards.</p>
          </div>
  
          <div class="action-section">
            <button class="cyber-button" disabled>
              <CubeTransparentIcon class="btn-icon" />
              Stake
              <div class="button-glitch"></div>
            </button>
            <p class="coming-soon">Staking coming soon</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ServerIcon, CubeTransparentIcon } from '@heroicons/vue/24/outline'
  </script>
  
  <style scoped>
  .ai-nodes {
    padding-top: 80px;
    min-height: 100vh;
    background: var(--bg-dark);
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .nodes-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 200px);
    text-align: center;
  }
  
  .nodes-header {
    margin-bottom: 3rem;
  }
  
  .header-icon {
    width: 48px;
    height: 48px;
    color: var(--primary);
    margin-bottom: 1.5rem;
  }
  
  h1 {
    color: white;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .description {
    color: var(--text);
    font-size: 1.2rem;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .action-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .cyber-button {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--primary);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }
  
  .cyber-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.1);
  }
  
  .btn-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .coming-soon {
    color: var(--text);
    font-size: 0.9rem;
    opacity: 0.8;
  }
  
  .button-glitch {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transform: rotate(45deg);
    animation: glitch-animation 3s infinite;
  }
  
  @keyframes glitch-animation {
    0% {
      transform: translateX(-100%) rotate(45deg);
    }
    100% {
      transform: translateX(100%) rotate(45deg);
    }
  }
  
  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }
  
    h1 {
      font-size: 2rem;
    }
  
    .description {
      font-size: 1rem;
    }
  
    .cyber-button {
      width: 100%;
      justify-content: center;
    }
  }
  </style>