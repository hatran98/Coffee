const User = require('../model/userModel');
const bcrypt = require('bcryptjs');
const Settings = require('../model/settingModel');
const Discount = require('../model/discountModel');
// Cập nhật mật khẩu của user
const changePassword = async (req, res) => {
  const { old_password, new_password } = req.body;
  const userId = req.user.id; // Lấy userId từ req.user, đã có qua cookie

  try {
    // Lấy thông tin user từ database dựa trên userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại!' });
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng!' });
    }

    // Cập nhật mật khẩu mới (không cần phải mã hóa lại)
    user.password = new_password; // Mật khẩu sẽ được mã hóa tự động bởi pre-save hook

    // Lưu mật khẩu mới vào database
    await user.save();

    res.status(200).json({ message: 'Mật khẩu đã được thay đổi thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi hệ thống!' });
  }
};


const updateSettings = async (req, res) => {
  const { bank_name, bank_account_number, modal_text } = req.body;

  try {
    // Lấy thông tin cài đặt từ database
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Cài đặt chưa được thiết lập!' });
    }

    // Cập nhật các thông tin cài đặt
    settings.bank_name = bank_name || settings.bank_name;
    settings.bank_account_number = bank_account_number || settings.bank_account_number;
    settings.modal_text = modal_text || settings.modal_text;

    await settings.save();

    res.status(200).json({ message: 'Cập nhật cài đặt thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi hệ thống!' });
  }
};

const fetchSettings = async (req,res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Cài đặt chưa được thiết lập!' });
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi hệ thống!' });
  }
}
const createDiscount = async (req, res) => {
  try {
    const {discount_code,
      discount_type,
      discount_percentage,
      discount_fixed,
      expiration_date} = req.body
    const code = discount_code;
    const amount = discount_type === 'percentage' ? Number(discount_percentage) : Number(discount_fixed);
    const type = discount_type;
    const expiresAt = expiration_date;
    // Kiểm tra nếu mã giảm giá đã tồn tại
    const existingDiscount = await Discount.findOne({ code });
    if (existingDiscount) {
      return res.status(400).json({ message: 'Discount code already exists' });
    }

    // Tạo mới mã giảm giá
    const discount = new Discount({ code, amount, type, expiresAt });

    // Lưu mã giảm giá vào cơ sở dữ liệu
    await discount.save();

    // Trả về mã giảm giá đã tạo
    res.status(201).json(discount);
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({ message: error.message });
  }
};
const getDiscounts = async (req, res) => {
  try {
    // Lấy tất cả mã giảm giá từ cơ sở dữ liệu
    const discounts = await Discount.find();

    // Nếu không có mã giảm giá nào
    if (discounts.length === 0) {
      return res.status(404).json({ message: 'No discounts found' });
    }

    // Trả về danh sách mã giảm giá
    res.status(200).json(discounts);
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({ message: error.message });
  }
};


// Cập nhật mã giảm giá
const updateDiscount = async (req, res) => {
  try {
    const { id } = req.params; // Lấy id từ params
    const { code, amount, type, expiresAt } = req.body; // Lấy dữ liệu từ body

    // Kiểm tra xem code có đủ 10 ký tự hay không
    if (!code || code.length !== 10) {
      return res.status(400).json({ message: 'Code phải có đúng 10 ký tự!' });
    }

    // Kiểm tra xem expiresAt có phải ngày hợp lệ và lớn hơn ngày hiện tại hay không
    const currentDate = new Date();
    const expiresDate = new Date(expiresAt);

    if (isNaN(expiresDate.getTime())) {
      return res.status(400).json({ message: 'Ngày hết hạn không hợp lệ!' });
    }

    if (expiresDate <= currentDate) {
      return res.status(400).json({ message: 'Ngày hết hạn phải lớn hơn ngày hiện tại!' });
    }

    // Tìm mã giảm giá theo ID và cập nhật
    const discount = await Discount.findByIdAndUpdate(
      id,
      { code, amount, type, expiresAt },
      { new: true }
    );

    // Kiểm tra xem mã giảm giá có tồn tại không
    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    // Trả về mã giảm giá đã cập nhật
    res.status(200).json(discount);
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({ message: error.message });
  }
};


// Xóa mã giảm giá
const deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const discount = await Discount.findByIdAndDelete(id);
    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }
    res.status(204).send(); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkDiscount = async (req, res) => {
  try {
    const { code } = req.body; // Lấy mã giảm giá từ request body

    // Tìm mã giảm giá trong cơ sở dữ liệu
    const discount = await Discount.findOne({ code });

    // Kiểm tra xem mã giảm giá có tồn tại không
    if (!discount) {
      return res.status(404).json({ message: 'Mã giảm giá không hợp lệ' });
    }

    // Kiểm tra xem mã giảm giá có còn hạn không
    if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
      return res.status(400).json({ message: 'Mã giảm giá đã hết hạn' });
    }

    // Kiểm tra xem mã giảm giá đã được sử dụng chưa
    if (discount.used) {
      return res.status(400).json({ message: 'Mã giảm giá đã được sử dụng' });
    }

    // Trả về mã giảm giá nếu hợp lệ
    res.status(200).json({
      message: 'Mã giảm giá hợp lệ',
      discount: {
        code: discount.code,
        amount: discount.amount,
        type: discount.type,
        expiresAt: discount.expiresAt,
      }
    });
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({ message: error.message });
  }
};

const getDiscountById = async (req,res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    res.status(200).json(discount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


module.exports = {
  changePassword,
  updateSettings,
  fetchSettings,
  createDiscount,
  getDiscounts,
  updateDiscount,
  deleteDiscount,
  checkDiscount,
  getDiscountById
};