// Wait until the entire page content is loaded before running the script
document.addEventListener('DOMContentLoaded', function () {
  
  // Find our input field
  const inputElement = document.getElementById('target-input');

  // If there's no input field on this page, do nothing.
  if (!inputElement) {
    return;
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
        
        // Use multiple replacement patterns to handle different syntax highlighting scenarios
        let updatedHTML = originalHTML;
        
        // Pattern 1: Handle the most common case where {TARGET} is split across spans
        updatedHTML = updatedHTML.replace(
          /<span[^>]*class="o"[^>]*>\{<\/span>TARGET<span[^>]*class="o"[^>]*>\}<\/span>/g,
          safeText
        );
        
        // Pattern 2: Handle simple {TARGET} without spans
        updatedHTML = updatedHTML.replace(/\{TARGET\}/g, safeText);
        
        // Pattern 3: Handle variations where there might be whitespace or other spans
        updatedHTML = updatedHTML.replace(
          /<span[^>]*>\{<\/span>\s*TARGET\s*<span[^>]*>\}<\/span>/g,
          safeText
        );
        
        container.innerHTML = updatedHTML;
      } else {
        container.innerHTML = originalHTML;
      }
    });
  }

  // Listen for input events (real-time updates)
  inputElement.addEventListener('input', updateTargetPlaceholders);
  
  // Listen for Enter key press in the input field
  inputElement.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      updateTargetPlaceholders();
    }
  });
});