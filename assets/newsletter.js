/**
 * Jedaiflow Newsletter Form Handler
 * Sends subscriber data to Google Sheets + sends confirmation email
 */

const GOOGLE_SCRIPT_URL = '{{GOOGLE_SCRIPT_URL}}';

class NewsletterHandler {
  constructor() {
    this.form = document.querySelector('.signup-form');
    this.emailInput = document.getElementById('email');
    this.submitBtn = document.getElementById('submit-btn');
    this.statusMsg = document.getElementById('form-status');
    
    this.init();
  }
  
  init() {
    if (!this.form) return;
    
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Validate email in real-time
    this.emailInput?.addEventListener('input', () => this.validateEmail());
  }
  
  validateEmail() {
    const email = this.emailInput.value;
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    this.emailInput.classList.toggle('invalid', email && !isValid);
    this.submitBtn.disabled = !isValid;
    
    return isValid;
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateEmail()) {
      this.showStatus('Please enter a valid email address.', 'error');
      return;
    }
    
    const email = this.emailInput.value;
    const guide = this.form.dataset.guide || 'newsletter';
    
    // Show loading
    this.submitBtn.disabled = true;
    this.submitBtn.textContent = 'Subscribing...';
    
    try {
      // Send to Google Sheets
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          guide: guide,
          source: window.location.href,
          timestamp: new Date().toISOString()
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (result.success) {
        this.showStatus(
          '✅ Subscribed! Check your email for confirmation.',
          'success'
        );
        
        // Clear form
        this.emailInput.value = '';
        
        // Redirect to thank you page if guide download
        if (guide !== 'newsletter') {
          setTimeout(() => {
            window.location.href = `/guides/thank-you.html?guide=${guide}&email=${encodeURIComponent(email)}`;
          }, 1500);
        }
      } else {
        throw new Error(result.message || 'Subscription failed');
      }
      
    } catch (error) {
      console.error('Subscription error:', error);
      this.showStatus(
        '⚠️ Something went wrong. Please try again or email hello@jedaiflow.com',
        'error'
      );
    } finally {
      this.submitBtn.disabled = false;
      this.submitBtn.textContent = 'Subscribe →';
    }
  }
  
  showStatus(message, type) {
    if (!this.statusMsg) {
      // Create status element if it doesn't exist
      const statusDiv = document.createElement('div');
      statusDiv.id = 'form-status';
      this.form.appendChild(statusDiv);
      this.statusMsg = statusDiv;
    }
    
    this.statusMsg.textContent = message;
    this.statusMsg.className = `form-status ${type}`;
    this.statusMsg.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.statusMsg.style.display = 'none';
    }, 5000);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new NewsletterHandler());
} else {
  new NewsletterHandler();
}
