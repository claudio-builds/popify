(function() {
  'use strict';

  // Get API key from script tag
  const script = document.currentScript || document.querySelector('script[data-key]');
  const apiKey = script?.getAttribute('data-key');
  
  if (!apiKey) {
    console.warn('Popify: Missing API key');
    return;
  }

  // Configuration
  const config = {
    apiUrl: 'https://popify.vercel.app/api/widget',
    position: 'bottom-left',
    duration: 5000,
    delay: 3000,
    maxNotifications: 5
  };

  // State
  let notifications = [];
  let currentIndex = 0;
  let container = null;
  let isVisible = false;

  // Styles
  const styles = `
    .popify-container {
      position: fixed;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    }
    .popify-container.bottom-left { bottom: 20px; left: 20px; }
    .popify-container.bottom-right { bottom: 20px; right: 20px; }
    .popify-container.top-left { top: 20px; left: 20px; }
    .popify-container.top-right { top: 20px; right: 20px; }
    
    .popify-notification {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      padding: 16px;
      max-width: 340px;
      display: flex;
      align-items: center;
      gap: 12px;
      transform: translateX(-120%);
      opacity: 0;
      transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      cursor: pointer;
      border: 1px solid rgba(0,0,0,0.05);
    }
    .popify-notification.show {
      transform: translateX(0);
      opacity: 1;
    }
    .popify-notification:hover {
      box-shadow: 0 12px 50px rgba(0,0,0,0.2);
    }
    
    .popify-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #9333ea, #ec4899);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 18px;
      flex-shrink: 0;
    }
    
    .popify-content {
      flex: 1;
      min-width: 0;
    }
    
    .popify-text {
      font-size: 14px;
      color: #1f2937;
      margin: 0;
      line-height: 1.4;
    }
    .popify-text strong {
      font-weight: 600;
    }
    .popify-text .highlight {
      color: #9333ea;
      font-weight: 500;
    }
    
    .popify-time {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 4px;
    }
    
    .popify-close {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 20px;
      height: 20px;
      border: none;
      background: #f3f4f6;
      border-radius: 50%;
      cursor: pointer;
      font-size: 12px;
      color: #6b7280;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .popify-notification:hover .popify-close {
      opacity: 1;
    }
    
    .popify-badge {
      position: absolute;
      bottom: -8px;
      right: 12px;
      font-size: 10px;
      color: #9ca3af;
      background: white;
      padding: 2px 6px;
      border-radius: 4px;
      text-decoration: none;
    }
    .popify-badge:hover {
      color: #9333ea;
    }
  `;

  // Create container
  function createContainer() {
    // Add styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // Create container
    container = document.createElement('div');
    container.className = `popify-container ${config.position}`;
    document.body.appendChild(container);
  }

  // Fetch notifications
  async function fetchNotifications() {
    try {
      const response = await fetch(`${config.apiUrl}?key=${apiKey}`);
      const data = await response.json();
      
      if (data.notifications && data.notifications.length > 0) {
        notifications = data.notifications.slice(0, config.maxNotifications);
        if (data.settings) {
          Object.assign(config, data.settings);
          container.className = `popify-container ${config.position}`;
        }
      }
    } catch (error) {
      console.warn('Popify: Failed to fetch notifications');
    }
  }

  // Track impression
  async function trackImpression() {
    try {
      await fetch(`${config.apiUrl}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: apiKey, type: 'impression' })
      });
    } catch (e) {}
  }

  // Track click
  async function trackClick() {
    try {
      await fetch(`${config.apiUrl}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: apiKey, type: 'click' })
      });
    } catch (e) {}
  }

  // Format time ago
  function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'agora';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `há ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours}h`;
    const days = Math.floor(hours / 24);
    return `há ${days}d`;
  }

  // Show notification
  function showNotification() {
    if (notifications.length === 0 || isVisible) return;

    const notification = notifications[currentIndex];
    isVisible = true;

    const el = document.createElement('div');
    el.className = 'popify-notification';
    el.innerHTML = `
      <div class="popify-avatar">${notification.name.charAt(0).toUpperCase()}</div>
      <div class="popify-content">
        <p class="popify-text">
          <strong>${notification.name}</strong>${notification.location ? ` de ${notification.location}` : ''}
          <br>
          ${notification.action} <span class="highlight">${notification.item}</span>
        </p>
        <p class="popify-time">${timeAgo(notification.created_at)}</p>
      </div>
      <button class="popify-close">✕</button>
      <a href="https://popify.vercel.app" target="_blank" class="popify-badge">✨ Popify</a>
    `;

    container.appendChild(el);
    
    // Animate in
    requestAnimationFrame(() => {
      el.classList.add('show');
      trackImpression();
    });

    // Click handlers
    el.addEventListener('click', (e) => {
      if (!e.target.classList.contains('popify-close') && !e.target.classList.contains('popify-badge')) {
        trackClick();
      }
    });

    el.querySelector('.popify-close').addEventListener('click', (e) => {
      e.stopPropagation();
      hideNotification(el);
    });

    // Auto hide
    setTimeout(() => hideNotification(el), config.duration);
  }

  // Hide notification
  function hideNotification(el) {
    if (!el) return;
    el.classList.remove('show');
    setTimeout(() => {
      el.remove();
      isVisible = false;
      currentIndex = (currentIndex + 1) % notifications.length;
      
      // Schedule next notification
      setTimeout(showNotification, config.delay);
    }, 500);
  }

  // Initialize
  async function init() {
    createContainer();
    await fetchNotifications();
    
    if (notifications.length > 0) {
      // Start showing after initial delay
      setTimeout(showNotification, config.delay);
    }
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
