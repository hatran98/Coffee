document.addEventListener('DOMContentLoaded', function () {
    const orderButton = document.querySelector('.order-button');

    orderButton.addEventListener('click', function () {
        const orderDetails = [];

        const productRows = document.querySelectorAll('.coffee-table tr');
        productRows.forEach(row => {
            const quantityInput = row.querySelector('.number-input');
            if (quantityInput) {
                const quantity = parseInt(quantityInput.value, 10);

                if (quantity > 0) {
                    const productCode = quantityInput.getAttribute('data-product-code');
                    const productName = row.querySelector('td:nth-child(2) h4.product-name').innerText;
                    const productDescription = row.querySelector('td:nth-child(2) p.product-description')?.innerText || '';
                    const productType = row.querySelector('td:nth-child(3)').innerText;
                    const brewType = row.querySelector('td:nth-child(4)').innerText;
                    const weight = row.querySelector('td:nth-child(5)').innerText;
                    const roastLevel = row.querySelector('td:nth-child(6)').innerText;
                    const price = row.querySelector('td:nth-child(7)').innerText;
                    const limit = row.querySelector('td:nth-child(8)').innerText;

                    orderDetails.push({
                        productCode: productCode,
                        productName: productName,
                        productDescription: productDescription,
                        productType: productType,
                        brewType: brewType,
                        weight: weight,
                        roastLevel: roastLevel,
                        price: price,
                        limit: limit,
                        quantity: quantity
                    });
                }
            }
        });

        if (orderDetails.length > 0) {
            localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
            window.location.href = '/orders'; // Nếu muốn chuyển hướng
        } else {
            alert('Vui lòng chọn sản phẩm để đặt hàng!');
        }
    });
});
