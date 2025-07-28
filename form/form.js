// Function to handle Enter key presses
function setupEnterKeyListener(nextAction) {
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission behavior

            if (typeof nextAction === 'string') {
                // If nextAction is a string, it's a URL to navigate to
                window.location.href = nextAction;
            } else if (typeof nextAction === 'function') {
                // If nextAction is a function, execute it
                nextAction();
            }
        }
    });
}