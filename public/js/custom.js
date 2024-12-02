document.addEventListener('DOMContentLoaded', function () {
    const incrementButtons = document.querySelectorAll('.increment');
    const decrementButtons = document.querySelectorAll('.decrement');
    const specialIncrementButtons = document.querySelectorAll('.special-increment');
    const specialDecrementButtons = document.querySelectorAll('.special-decrement');
    let modalMessage = ""; // Biến lưu thông điệp từ settings

    // Hàm lấy dữ liệu từ settings qua API
    async function fetchSettings() {
        try {
            const response = await fetch('/settings/fetch-settings'); // Thay '/api/settings' bằng URL thực tế
            const data = await response.json();
            modalMessage = data.modal_text || "Bạn đã đạt giới hạn!"; // Mặc định nếu không có dữ liệu
        } catch (error) {
            console.error("Không thể lấy dữ liệu từ settings:", error);
            modalMessage = "Lỗi khi tải thông báo!"; // Thông báo lỗi fallback
        }
    }

    // Hàm hiển thị modal
    function showModal(message) {
        if (document.querySelector('.custom-modal')) return;

        // Tạo overlay
        const overlay = document.createElement('div');
        overlay.classList.add('modal-overlay');
        overlay.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });

        // Tạo modal
        const modal = document.createElement('div');
        modal.classList.add('custom-modal');
        modal.style.position = 'fixed';

        const content = document.createElement('div');
        content.innerText = message || 'Đây là nội dung modal'; // Thay modalMessage bằng thông điệp

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Đóng';
        closeButton.style.marginTop = '10px';
        closeButton.addEventListener('click', () => {
            modal.remove(); // Loại bỏ modal
            overlay.remove(); // Loại bỏ overlay
        });

        modal.appendChild(content);
        modal.appendChild(closeButton);
        document.body.appendChild(overlay); // Thêm overlay trước
        document.body.appendChild(modal); // Thêm modal sau
    }

    // Thêm sự kiện click cho nút increment
    incrementButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = this.previousElementSibling;  
            const currentValue = parseInt(input.value, 10);
            const maxValue = parseInt(input.max, 10);

            if (currentValue < maxValue) {
                input.value = currentValue + 1;
                updateTotalPrice();
            } else {
                showModal(modalMessage); // Gọi modal khi vượt giới hạn với thông điệp từ settings
            }
        });
    });

    decrementButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = this.nextElementSibling;
            const currentValue = parseInt(input.value, 10);

            if (currentValue > 0) {
                input.value = currentValue - 1;
                updateTotalPrice();
            }
        });
    });

    // Xử lý sự kiện tăng số lượng cho sản phẩm đặc biệt
    specialIncrementButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = button.previousElementSibling; // Lấy phần tử input
            let currentValue = parseInt(input.value);
            const max = parseInt(input.max);
            const productId = input.dataset.productId; // Lấy ID sản phẩm đặc biệt
    
            // Lấy số lượng sản phẩm đã chọn từ giỏ
            const selectedProducts = document.querySelectorAll('.number-input');
            const totalProducts = Array.from(selectedProducts).reduce((total, item) => {
                return total + parseInt(item.value, 10);
            }, 0);
    
            // Lấy số lượng sản phẩm yêu cầu (required-product)
            const quantityRequired = parseInt(input.closest('.special-product-item').querySelector('.product-quantity_required').innerText, 10);
    
            // Tính số lượng sản phẩm đặc biệt người dùng có thể mua
            const maxSpecialQuantity = Math.floor(totalProducts / quantityRequired);
    
            // Nếu số lượng sản phẩm bình thường đã đủ điều kiện, mới cho phép tăng số lượng đặc biệt
            if (totalProducts >= quantityRequired) {
                if (currentValue < maxSpecialQuantity) {
                    input.value = currentValue + 1;  // Tăng giá trị
                    console.log('Số lượng sau khi tăng:', input.value);
                } else {
                    console.log('Đã đạt đến giới hạn tối đa');
                    showModal("Đã đạt số lượng tối đa cho sản phẩm đặc biệt!"); // Thông báo riêng cho sản phẩm đặc biệt
                }
            } else {
                showModal('Chưa đủ số lượng sản phẩm thông thường để mua sản phẩm đặc biệt'); // Thông báo khi chưa đủ điều kiện
            }
        });
    });

    // Xử lý sự kiện giảm số lượng cho sản phẩm đặc biệt
    specialDecrementButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = button.nextElementSibling; // Lấy phần tử input
            let currentValue = parseInt(input.value);

            if (currentValue > 0) {
                input.value = currentValue - 1;
                console.log('Số lượng sau khi giảm:', input.value);
            } else {
                console.log('Số lượng không thể nhỏ hơn 0');
            }
        });
    });

    // Hàm tính tổng giá tiền
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

    // Lấy thông báo từ settings khi trang tải xong
    fetchSettings();

    // Cập nhật tổng tiền ngay khi tải trang
    updateTotalPrice();
});
