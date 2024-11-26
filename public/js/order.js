document.addEventListener('DOMContentLoaded', function () {
    const orderButton = document.querySelector('.order-button');

    // Xử lý sự kiện khi người dùng click nút "Đặt hàng"
    orderButton.addEventListener('click', function () {
        const orderDetails = [];

        // Lấy tất cả các dòng sản phẩm trong bảng
        const productRows = document.querySelectorAll('.coffee-table tr');

        productRows.forEach(row => {
            const quantityInput = row.querySelector('.number-input');
            
            if (quantityInput) {
                const quantity = parseInt(quantityInput.value, 10);
                
                // Kiểm tra nếu số lượng sản phẩm lớn hơn 0
                if (quantity > 0) {
                    // Lấy thông tin sản phẩm
                    const productCode = quantityInput.getAttribute('data-product-code');
                    const productName = row.querySelector('td:nth-child(2) p').innerText;
                    const productPrice = row.querySelector('td:nth-child(7)').innerText;

                    // Thêm thông tin sản phẩm vào danh sách đơn hàng
                    orderDetails.push({
                        productCode: productCode,
                        productName: productName,
                        quantity: quantity,
                        price: productPrice
                    });
                }
            }
        });

        // Kiểm tra nếu có sản phẩm đã được chọn
        if (orderDetails.length > 0) {
            // Lưu trữ dữ liệu đơn hàng vào localStorage hoặc gửi qua query string
            localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
            
            // Chuyển hướng đến trang orders
            window.location.href = '/orders';
        } else {
            alert('Vui lòng chọn sản phẩm để đặt hàng!');
        }
    });
});
