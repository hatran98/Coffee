document.addEventListener('DOMContentLoaded', function() {
    const incrementButtons = document.querySelectorAll('.increment');
    const decrementButtons = document.querySelectorAll('.decrement');

    function updateTotalPrice() {
        let total = 0;

        document.querySelectorAll('.cart-item').forEach(item => {
            const quantityInput = item.querySelector('.number-input');
            const price = parseFloat(item.querySelector('.product-price').innerText.replace('Giá: ', '').replace(' VND', '').replace(',', ''));
            const quantity = parseInt(quantityInput.value, 10);
            
            if (quantity && price) {
                total += price * quantity;
            }
        });

        const totalPriceElement = document.querySelector('.total-price');
        if (totalPriceElement) {
            totalPriceElement.textContent = 'Tổng tiền: ' + total.toLocaleString() + ' VND';
        }
    }

    incrementButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;  
            const currentValue = parseInt(input.value, 10);
            const maxValue = parseInt(input.max, 10);
            if (currentValue < maxValue) {
                input.value = currentValue + 1;
                updateTotalPrice();
            }
        });
    });

    decrementButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.nextElementSibling; 
            const currentValue = parseInt(input.value, 10);
            
            if (currentValue > 0) {
                input.value = currentValue - 1; 
                updateTotalPrice();  
            }
        });
    });

    updateTotalPrice();
});
