const Category = require('../model/categoryModel');  // Model của category
const Country = require('../model/countryModel');  // Model của country

// Controller xử lý tạo category mới
exports.createCategory = async (req, res) => {
    try {
        // Lấy dữ liệu từ form
        const { name, country, description, status } = req.body;

        // Kiểm tra xem country có tồn tại không
        const selectedCountry = await Country.findById(country);
        if (!selectedCountry) {
            return res.status(400).json({ message: 'Quốc Gia không hợp lệ!' });
        }

        // Tạo một category mới
        const newCategory = new Category({
            name,
            flag_image: selectedCountry.flag,  // Lấy cờ của quốc gia
            description,
            status
        });

        // Lưu category vào cơ sở dữ liệu
        await newCategory.save();

        // Redirect về trang danh sách category
        res.redirect('/admin/categories');  // Giả sử có route để liệt kê category
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau!' });
    }
};
