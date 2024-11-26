document.addEventListener('DOMContentLoaded', function() {
    const incrementButtons = document.querySelectorAll('.increment');
    const decrementButtons = document.querySelectorAll('.decrement');

    incrementButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;  
            const currentValue = parseInt(input.value, 10);
            const maxValue = parseInt(input.max, 10);
            if (currentValue < maxValue) {
                input.value = currentValue + 1;
            }
        });
    });

    decrementButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.nextElementSibling; 
            const currentValue = parseInt(input.value, 10);
            
            if (currentValue > 0) {
                input.value = currentValue - 1; 
            }
        });
    });
});
