document.addEventListener('DOMContentLoaded', function () {
    const orderButton = document.querySelector('.order-button');

    orderButton.addEventListener('click', function () {
        const orderDetails = [];

        const productRows = document.   querySelectorAll('.coffee-table tr');
        productRows.forEach(row => {
            const quantityInput = row.querySelector('.number-input');
            
            if (quantityInput) {
                const quantity = parseInt(quantityInput.value, 10);
                
                if (quantity > 0) {
                    const productCode = quantityInput.getAttribute('data-product-code');
                    const productName = row.querySelector('td:nth-child(2) p').innerText;
                    const productPrice = row.querySelector('td:nth-child(7)').innerText

                    orderDetails.push({
                        productCode: productCode,
                        productName: productName,
                        quantity: quantity,
                        price: productPrice
                    });
                }
            }
        });

        if (orderDetails.length > 0) {
            localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
            
            window.location.href = '/orders';
        } else {
            alert('Vui lòng chọn sản phẩm để đặt hàng!');
        }
    });
});


