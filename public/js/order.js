document.addEventListener('DOMContentLoaded', function () {
    const orderButton = document.querySelector('.order-button');

    orderButton.addEventListener('click', function () {
        const specialProductsOrderDetails = []; // Mảng lưu thông tin sản phẩm đặc biệt
        const productsOrderDetails = []; // Mảng lưu thông tin sản phẩm bình thường

        // Xử lý các sản phẩm đặc biệt
        const specialProductRows = document.querySelectorAll('.special-product-item');
        specialProductRows.forEach(row => {
            const quantityInput = row.querySelector('.number-input');
            if (quantityInput) {
                const quantity = parseInt(quantityInput.value, 10);

                if (quantity > 0) {
                    const productName = row.querySelector('.product-name').innerText;
                    const price = row.querySelector('.product-price').innerText.split(' ')[1]; // Lấy giá (VND)
                    const quantityRequired = row.querySelector('.product-quantity_required').innerText;

                    specialProductsOrderDetails.push({
                        productName: productName,
                        quantityRequired: quantityRequired,
                        price: price,
                        quantity: quantity
                    });
                }
            }
        });

        // Xử lý các sản phẩm bình thường (coffee-table)
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

                    productsOrderDetails.push({
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

        // Kiểm tra và lưu trữ riêng biệt
        if (specialProductsOrderDetails.length > 0 || productsOrderDetails.length > 0) {
            if (specialProductsOrderDetails.length > 0) {
                localStorage.setItem('specialProductsOrderdetails', JSON.stringify(specialProductsOrderDetails));
            }
            if (productsOrderDetails.length > 0) {
                localStorage.setItem('productsOrderdetails', JSON.stringify(productsOrderDetails));
            }

            window.location.href = '/orders'; // Nếu muốn chuyển hướng
        } else {
            alert('Vui lòng chọn sản phẩm để đặt hàng!');
        }
    });
});
