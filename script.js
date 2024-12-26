document.addEventListener('DOMContentLoaded', () => {
  // Function to set a cookie
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Convert days to milliseconds
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`; // Cookie accessible across all pages
  }

  // Function to get a cookie value by name
  function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === name) return value;
    }
    return null;
  }

  // Check if the cookie consent has been given
  const consentGiven = getCookie('cookieConsent') === 'accepted';

  // Show cookie consent popup if not already accepted
  if (!consentGiven) {
    const cookiePopup = document.createElement('div');
    cookiePopup.id = 'cookie-popup';
    cookiePopup.innerHTML = `
    <div id="cookie-consent" class="cookie-popup">
      <p>
        We use cookies to enhance your experience. By clicking "Accept", you agree to the use of cookies.
        Read our <a href="privacy-policy.html">Privacy Policy</a>.
      </p>
      <div class="cookie-buttons">
        <button class="button" id="accept-cookies"><strong>Accept</strong></button>
        <button class="button-alt" id="reject-cookies"><strong>Reject</strong></button>
      </div>
    </div>
    `;
    document.body.appendChild(cookiePopup);

    // Accept cookies
    document.getElementById('accept-cookies').addEventListener('click', () => {
      setCookie('cookieConsent', 'accepted', 30); // Save consent state for 30 days
      cookiePopup.remove(); // Remove popup
    });

    // Deny cookies
    document.getElementById('reject-cookies').addEventListener('click', () => {
      cookiePopup.remove(); // Remove popup without saving consent
    });
  }

  // Panic button functionality
  let currentKey = getCookie('keybind') || 'alt'; // Default keybind is Alt
  let panicUrl = getCookie('panicUrl') || 'https://www.google.com'; // Default panic URL

  // Update keybind function and save to cookie
  function updateKeybind(newKey) {
    currentKey = newKey;
    setCookie('keybind', newKey, 999); // Save keybind for 999 days
    alert(`Keybind set to ${newKey.charAt(0).toUpperCase() + newKey.slice(1)}`);
  }

  // Update panic button URL and save to cookie
  function updatePanicUrl() {
    const urlInput = document.getElementById('panic-link')?.value?.trim();
    if (urlInput) {
      panicUrl = urlInput;
      setCookie('panicUrl', panicUrl, 999); // Save URL for 999 days
      alert(`Panic button destination set to: ${panicUrl}`);
    } else {
      alert('Please enter a valid URL.');
    }
  }

  // Event listeners for keybind buttons
  document.getElementById('altKey')?.addEventListener('click', () => updateKeybind('alt'));
  document.getElementById('ctrlKey')?.addEventListener('click', () => updateKeybind('ctrl'));
  document.getElementById('tabKey')?.addEventListener('click', () => updateKeybind('tab'));

  // Event listener for setting the panic URL
  document.getElementById('set-link')?.addEventListener('click', updatePanicUrl);

  // Keydown event listener for the panic button functionality
  document.addEventListener('keydown', function (event) {
    if (
      (currentKey === 'alt' && event.altKey) || // Alt key pressed
      (currentKey === 'ctrl' && event.ctrlKey) || // Ctrl key pressed
      (currentKey === 'tab' && event.key === 'Tab') // Tab key pressed
    ) {
      event.preventDefault(); // Prevent default behavior
      window.location.href = panicUrl; // Redirect to the panic URL
    }
  });
});
