<template>
    <div class="ai-training">
      <div class="container">
        <div class="coming-soon">
          <div class="coming-soon-content">
            <SparklesIcon class="icon" />
            <h1>Coming Soon</h1>
            <p>We're working on something amazing!</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { SparklesIcon } from '@heroicons/vue/24/outline'
  </script>
  
  <style scoped>
  .ai-training {
    padding-top: 80px;
    min-height: 100vh;
    background: var(--bg-dark);
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .coming-soon {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 200px);
  }
  
  .coming-soon-content {
    text-align: center;
    animation: fadeIn 1s ease-out;
  }
  
  .icon {
    width: 48px;
    height: 48px;
    color: var(--primary);
    margin-bottom: 1.5rem;
    animation: pulse 2s infinite;
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
  
  p {
    color: var(--text);
    font-size: 1.2rem;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.1);
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }
  
    h1 {
      font-size: 2rem;
    }
  
    p {
      font-size: 1rem;
    }
  }
  </style>