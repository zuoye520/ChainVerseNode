<template>
  <section class="features-section">
    <div class="container">
      <div class="feature-item" v-for="(feature, index) in features" :key="index">
        <div class="ai-circle">
          <div class="circle-effects">
            <div class="rotating-border"></div>
            <div class="glowing-orb"></div>
            <div class="particles">
              <div v-for="n in 8" :key="n" class="particle"></div>
            </div>
          </div>
          <component :is="feature.icon" class="icon" />
        </div>
        <div class="feature-content">
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { 
  UserCircleIcon,
  CurrencyDollarIcon,
  UsersIcon
} from '@heroicons/vue/24/outline'

const features = [
  {
    icon: UserCircleIcon,
    title: 'AI Digital Identity',
    description: 'Use your NULS AI identity as your digital presence in the NULS ecosystem and AI system'
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Valuable ID',
    description: 'Locked liquidity will continue to receive NULS POS rewards. Train identity AI to improve its knowledge and sell it to those in need'
  },
  {
    icon: UsersIcon,
    title: 'Connect & Collaborate',
    description: 'Easily connect and collaborate through AI digital identity'
  }
]
</script>

<style scoped>
.features-section {
  padding: 6rem 2rem;
  position: relative;
  overflow: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  position: relative;
  z-index: 2;
}

.feature-item {
  display: flex;
  gap: 1.5rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.feature-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--x, 50%) var(--y, 50%),
    rgba(0, 228, 134, 0.1) 0%,
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.3s;
}

.feature-item:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: var(--primary);
  box-shadow: 
    0 10px 20px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(0, 228, 134, 0.2),
    inset 0 0 20px rgba(0, 228, 134, 0.1);
}

.feature-item:hover::before {
  opacity: 1;
}

.ai-circle {
  width: 64px;
  height: 64px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-effects {
  position: absolute;
  inset: -8px;
  pointer-events: none;
}

.rotating-border {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  padding: 2px;
  background: conic-gradient(
    from 0deg,
    transparent,
    var(--primary),
    transparent 60%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: rotate 4s linear infinite;
}

.glowing-orb {
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(0, 228, 134, 0.2) 0%,
    transparent 70%
  );
  animation: pulse 2s ease-in-out infinite;
}

.particles {
  position: absolute;
  inset: -20px;
  animation: rotate 10s linear infinite;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--primary);
  opacity: 0;
  animation: particle-fade 3s ease-in-out infinite;
}

.particle:nth-child(1) { top: 0; left: 50%; animation-delay: 0s; }
.particle:nth-child(2) { top: 25%; right: 0; animation-delay: 0.4s; }
.particle:nth-child(3) { bottom: 0; left: 50%; animation-delay: 0.8s; }
.particle:nth-child(4) { top: 25%; left: 0; animation-delay: 1.2s; }
.particle:nth-child(5) { top: 15%; left: 15%; animation-delay: 1.6s; }
.particle:nth-child(6) { bottom: 15%; right: 15%; animation-delay: 2s; }
.particle:nth-child(7) { bottom: 15%; left: 15%; animation-delay: 2.4s; }
.particle:nth-child(8) { top: 15%; right: 15%; animation-delay: 2.8s; }

.icon {
  width: 32px;
  height: 32px;
  color: var(--primary);
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 0 8px rgba(0, 228, 134, 0.3));
  transition: transform 0.3s;
}

.feature-item:hover .icon {
  transform: scale(1.1);
  filter: drop-shadow(0 0 12px rgba(0, 228, 134, 0.5));
}

.feature-content {
  position: relative;
  z-index: 1;
}

.feature-content h3 {
  color: white;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  position: relative;
  display: inline-block;
}

.feature-content h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 0;
  height: 2px;
  background: var(--primary);
  transition: width 0.3s ease;
}

.feature-item:hover .feature-content h3::after {
  width: 100%;
}

.feature-content p {
  color: var(--text);
  line-height: 1.6;
  transition: color 0.3s;
}

.feature-item:hover .feature-content p {
  color: rgba(255, 255, 255, 0.8);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@keyframes particle-fade {
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 0.8;
    transform: scale(1);
  }
}

@media (max-width: 1024px) {
  .container {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .features-section {
    padding: 4rem 1rem;
  }

  .feature-item {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .feature-item {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }

  .feature-content h3::after {
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>