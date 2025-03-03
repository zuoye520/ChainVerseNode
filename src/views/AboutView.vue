<template>
  <div class="about">
    <div class="hero-section">
      <div class="hero-content">
        <div class="ai-circle">
          <ServerIcon class="hero-icon" />
          <div class="circle-effects">
            <div class="rotating-border"></div>
            <div class="glowing-orb"></div>
          </div>
        </div>
        <h1>What is ChainVerse?</h1>
        <p class="hero-text">ChainVerse is a decentralized AI node protocol that not only provides you with a unique AI node identity but also generates passive income through our innovative reward mechanism. The AI nodes can also automatically train and evolve in the future.</p>
      </div>
      <div class="hero-background">
        <div class="circuit-pattern"></div>
        <div class="glow-effect"></div>
      </div>
    </div>

    <div class="container">
      <div class="faq-section">
        <h2>Frequently Asked Questions</h2>
        
        <div class="faq-grid">
          <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
            <div class="faq-icon">
              <component :is="faq.icon" class="icon" />
            </div>
            <div class="faq-content">
              <h3>{{ faq.question }}</h3>
              <p>
                {{ faq.answer }}
                <a 
                  v-if="faq.link" 
                  :href="faq.link" 
                  target="_blank" 
                  class="link"
                >{{ faq.linkText }}</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
import { 
  ServerIcon, 
  CurrencyDollarIcon,
  GiftIcon,
  CubeTransparentIcon,
  ShieldCheckIcon,
  CodeBracketIcon
} from '@heroicons/vue/24/outline'

const faqs = [
  {
    question: "How much does ChainVerse AI Node registration cost?",
    answer: "AI node pricing is based on name length - different lengths have different prices. Once registered, it can be used permanently with no time limit.",
    icon: CurrencyDollarIcon
  },
  {
    question: "Where does ChainVerse's passive income come from?",
    answer: "80% of the ChainVerse AI node registration fee will be pledged to the NULS node and locked permanently.",
    icon: CurrencyDollarIcon
  },
  {
    question: "How can I get free or discounted ChainVerse AI Nodes?",
    answer: "Through airdrops or as NULS ecosystem builders.",
    icon: GiftIcon
  },
  {
    question: "How do I use ChainVerse AI Nodes?",
    answer: "You can use your AI nodes in various applications within the NULS ecosystem.",
    icon: CubeTransparentIcon
  },
  {
    question: "Will my profile information be published on-chain?",
    answer: "ChainVerse AI nodes are completely on-chain, so any information you publish will be recorded on-chain, requires transactions, and can be widely combined with other parts of the ecosystem. Please do not publish any information you don't want on-chain.",
    icon: ShieldCheckIcon
  },
  {
    question: "I'm a developer. How do I integrate ChainVerse AI Nodes into my application?",
    answer: "If you're a developer looking to integrate ChainVerse into your application, the documentation is the easiest way to get started.",
    icon: CodeBracketIcon,
    link: proxy.$config.GITHUB_URL,
    linkText: "View Documentation"
  }
]
</script>

<style scoped>
.about {
  padding-top: 70px;
  background: var(--bg-dark);
  min-height: 100vh;
}

.hero-section {
  position: relative;
  padding: 6rem 2rem;
  text-align: center;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.ai-circle {
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-icon {
  width: 40px;
  height: 40px;
  color: var(--primary);
  position: relative;
  z-index: 2;
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
    rgba(0, 194, 255, 0.2) 0%,
    transparent 70%
  );
  animation: pulse 2s ease-in-out infinite;
}

.hero-background {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.circuit-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(to right, rgba(0, 194, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 194, 255, 0.1) 1px, transparent 1px);
  background-size: 30px 30px;
  transform: perspective(500px) rotateX(60deg);
  animation: circuit 20s linear infinite;
}

.glow-effect {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    rgba(0, 194, 255, 0.1) 0%,
    transparent 70%
  );
  filter: blur(50px);
}

h1 {
  color: white;
  font-size: 3rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-text {
  color: var(--text);
  font-size: 1.2rem;
  line-height: 1.6;
  margin: 0 auto;
  max-width: 700px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.faq-section {
  position: relative;
  z-index: 2;
}

h2 {
  color: white;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.faq-item {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s;
  display: flex;
  gap: 1.5rem;
}

.faq-item:hover {
  transform: translateY(-4px);
  border-color: var(--primary);
  box-shadow: 
    0 10px 20px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(0, 194, 255, 0.2);
}

.faq-icon {
  width: 48px;
  height: 48px;
  background: rgba(0, 194, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon {
  width: 24px;
  height: 24px;
  color: var(--primary);
}

.faq-content h3 {
  color: white;
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.faq-content p {
  color: var(--text);
  line-height: 1.6;
}

.link {
  color: var(--primary);
  text-decoration: none;
  margin-left: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
}

.link:hover {
  color: white;
  text-decoration: underline;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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

@keyframes circuit {
  0% { background-position: 0 0; }
  100% { background-position: 0 100%; }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 4rem 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  .hero-text {
    font-size: 1rem;
  }

  .container {
    padding: 1rem;
  }

  .faq-grid {
    grid-template-columns: 1fr;
  }

  .faq-item {
    padding: 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .faq-icon {
    width: 40px;
    height: 40px;
  }

  .icon {
    width: 20px;
    height: 20px;
  }

  .faq-content h3 {
    font-size: 1.1rem;
  }

  .faq-content p {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 3rem 1rem;
  }

  h1 {
    font-size: 1.75rem;
  }

  .hero-text {
    font-size: 0.95rem;
  }

  .ai-circle {
    width: 60px;
    height: 60px;
  }

  .hero-icon {
    width: 30px;
    height: 30px;
  }
}
</style>