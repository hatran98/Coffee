// JavaScript chỉnh sửa để lấy giá trị chỉ từ sản phẩm
document.addEventListener('DOMContentLoaded', function () {
    const orderButtonMobile = document.querySelector('.mobile-view .order-button');

    if (orderButtonMobile) {
        orderButtonMobile.addEventListener('click', function () {
            const orderDetails = [];

            // Lấy tất cả các sản phẩm trong giao diện mobile
            const productGroups = document.querySelectorAll('.mobile-cart-group');

            productGroups.forEach(group => {
                const productItems = group.querySelectorAll('.cart-item');

                productItems.forEach(item => {
                    const quantityInput = item.querySelector('.number-input');
                    
                    if (quantityInput) {
                        const quantity = parseInt(quantityInput.value, 10);

                        // Kiểm tra nếu số lượng sản phẩm lớn hơn 0
                        if (quantity > 0) {
                            // Lấy thông tin sản phẩm
                            const productCode = quantityInput.getAttribute('data-product-code');
                            const productName = item.querySelector('.product-name').innerText;
                            const productDescription = item.querySelector('.product-description')?.innerText || '';
                            const productType = item.querySelector('.product-type')?.innerText.replace("Loại sản phẩm: ", '').trim() || ''; // Chỉnh sửa tại đây
                            const brewType = item.querySelector('.product-brew-type')?.innerText || '';
                            const weight = item.querySelector('.product-weight')?.innerText || '';
                            const roastLevel = item.querySelector('.product-roast-level')?.innerText || '';
                            const priceElement = item.querySelector('.product-price');
                            let productPrice = priceElement ? priceElement.innerText.replace('Giá: ', '').replace(' VND', '').trim() : '';
                            productPrice = productPrice.replace(/,/g, ''); // Loại bỏ dấu phẩy nếu có

                            // Thêm thông tin sản phẩm vào danh sách đơn hàng
                            orderDetails.push({
                                productCode: productCode,
                                productName: productName,
                                productDescription: productDescription,
                                productType: productType, // Giá trị productType đã được điều chỉnh
                                brewType: brewType,
                                weight: weight,
                                roastLevel: roastLevel,
                                price: productPrice,
                                quantity: quantity
                            });
                        }
                    }
                });
            });

            // Kiểm tra nếu có sản phẩm đã được chọn
            if (orderDetails.length > 0) {
                // Lưu trữ dữ liệu đơn hàng vào localStorage
                localStorage.setItem('orderDetails', JSON.stringify(orderDetails));

                // Chuyển hướng đến trang orders
                window.location.href = '/orders';
            } else {
                alert('Vui lòng chọn sản phẩm để đặt hàng!');
            }
        });
    }
});
