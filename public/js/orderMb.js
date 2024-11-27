document.addEventListener('DOMContentLoaded', function () {
    const orderButtonMobile = document.querySelector('.mobile-view .order-button');

    // Kiểm tra nếu có nút "Đặt hàng" trong giao diện mobile
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

                            // Lấy giá trị tiền từ phần tử product-price và loại bỏ phần "Giá:" và "VND"
                            let productPrice = item.querySelector('.product-price').innerText;
                            productPrice = productPrice.replace('Giá: ', '').replace(' VND', '').trim(); // Loại bỏ "Giá:" và "VND"
                            
                            console.log(productPrice)
;                            // Thêm thông tin sản phẩm vào danh sách đơn hàng
                            orderDetails.push({
                                productCode: productCode,
                                productName: productName,
                                quantity: quantity,
                                price: productPrice
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
