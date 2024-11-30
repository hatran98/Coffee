document.addEventListener('DOMContentLoaded', function () {
    const incrementButtons = document.querySelectorAll('.increment');
    const decrementButtons = document.querySelectorAll('.decrement');
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
    function showModal() {
        // Kiểm tra nếu modal đã tồn tại, không tạo thêm
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
        content.innerText = modalMessage || 'Đây là nội dung modal'; // Thay modalMessage bằng thông điệp
    
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
                showModal(); // Gọi modal khi vượt giới hạn
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
