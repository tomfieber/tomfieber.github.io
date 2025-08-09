// Wait until the entire page content is loaded before running the script
document.addEventListener('DOMContentLoaded', function () {
  
  // Function to initialize the dynamic target functionality
  function initializeDynamicTarget() {
    // Find our input field and container
    const inputElement = document.getElementById('target-input');
    const containerElement = document.getElementById('dynamic-target-container');

    // If there's no input field on this page, do nothing.
    if (!inputElement || !containerElement) {
      return false;
    }

    // Move the input container to appear after the first H1 heading
    const firstH1 = document.querySelector('h1');
    if (firstH1 && containerElement.parentNode !== firstH1.parentNode) {
      // Insert the container after the H1 element
      firstH1.parentNode.insertBefore(containerElement, firstH1.nextSibling);
      
      // Make sure the container is visible
      containerElement.style.display = 'block';
    }

    return true;
  }

  // Function to safely escape HTML to prevent XSS attacks
  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Function to find and replace {TARGET} placeholders in code blocks
  function updateTargetPlaceholders() {
    // Get the current text from the input, trimming any whitespace
    const inputElement = document.getElementById('target-input');
    if (!inputElement) return;
    
    const newText = inputElement.value.trim();
    
    // Find all code blocks (both <code> and <pre><code> structures)
    const codeContainers = document.querySelectorAll('div.highlight pre, code');
    
    codeContainers.forEach(container => {
      // Store original content if not already stored
      if (!container.hasAttribute('data-original-html')) {
        container.setAttribute('data-original-html', container.innerHTML);
      }
      
      // Get the original HTML content
      const originalHTML = container.getAttribute('data-original-html');
      
      // Replace {TARGET} with the new text, or restore original if input is empty
      if (newText) {
        // SECURITY: Escape user input to prevent XSS attacks
        const safeText = escapeHtml(newText);
        
        // Use a regex to replace {TARGET} even when it's split across syntax highlighting spans
        const updatedHTML = originalHTML.replace(
          /<span[^>]*class="o"[^>]*>\{<\/span>TARGET<span[^>]*class="o"[^>]*>\}<\/span>/g,
          safeText
        ).replace(
          /\{TARGET\}/g,
          safeText
        );
        container.innerHTML = updatedHTML;
      } else {
        container.innerHTML = originalHTML;
      }
    });
  }

  // Function to setup event listeners
  function setupEventListeners() {
    const inputElement = document.getElementById('target-input');
    if (!inputElement) return;

    // Listen for input events (real-time updates)
    inputElement.addEventListener('input', updateTargetPlaceholders);
    
    // Listen for Enter key press in the input field
    inputElement.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        updateTargetPlaceholders();
      }
    });
  }

  // Try to initialize immediately
  if (initializeDynamicTarget()) {
    setupEventListeners();
  } else {
    // If initialization failed, try again after a short delay
    setTimeout(function() {
      if (initializeDynamicTarget()) {
        setupEventListeners();
      }
    }, 100);
  }

  // Also try again when the window is fully loaded (backup)
  window.addEventListener('load', function() {
    if (initializeDynamicTarget()) {
      setupEventListeners();
    }
  });
});