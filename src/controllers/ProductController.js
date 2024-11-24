const Product = require('../model/productModel');
const Country = require('../model/countryModel');


const updateProductLimit = async (req, res) => {
  try {
    const { productId } = req.params;
    const { newLimit } = req.body;

    if (!newLimit || newLimit <= 0) {
      return res.status(400).json({ error: 'Giới hạn phải là số nguyên dương.' });
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      { limit: newLimit },
      { new: true } // Trả về dữ liệu sau khi cập nhật
    );

    if (!product) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
    }

    return res.status(200).json({
      message: `Cập nhật giới hạn thành công cho sản phẩm: ${product.product_name}`,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Lỗi hệ thống',
      details: error.message,
    });
  }
};



const getCountries = async (req, res) => {
    try {
        const countries = await Country.find();  // Lấy tất cả quốc gia từ database
        res.render('createQuote', { countries });  // Gửi danh sách quốc gia vào view
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi khi tải dữ liệu quốc gia');
    }
};

const createQuote = async (req, res) => {
  try {
      const { country, code, name, product_type , price, description, limit } = req.body;

      // Kiểm tra các trường không hợp lệ
      if (!name || !code || !price) {
          return res.status(400).send('Tên sản phẩm, mã sản phẩm và giá là bắt buộc!');
      }

      if (price <= 0) {
          return res.status(400).send('Giá sản phẩm phải lớn hơn 0!');
      }

      // Kiểm tra xem quốc gia có tồn tại không
      const countryData = await Country.findById(country);
      if (!countryData) {
          return res.status(400).send('Quốc gia không hợp lệ!');
      }

      // Sử dụng giá trị limit từ input nếu có, nếu không thì dùng giá trị mặc định là 2
      const productLimit = limit && limit > 0 ? limit : 2;

      // Tạo sản phẩm mới
      const newProduct = new Product({
          product_code: code,
          product_name: name,
          product_type: product_type, // Có thể thay đổi nếu cần
          description: description,
          country: country,  // Lưu ObjectId của quốc gia
          price: price,
          status: 'active',
          limit: productLimit,  // Sử dụng giá trị limit từ input hoặc mặc định là 2
      });

      await newProduct.save();

      // Quay lại trang danh sách hoặc trang chi tiết của sản phẩm
      res.redirect('/admin');
  } catch (error) {
      console.error(error);
      res.status(500).send('Có lỗi xảy ra khi tạo sản phẩm!');
  }
};

const updateProduct = async (req, res) => {
  try {
    const { _id, country, code, name, description, edit_product_type, price, limit } = req.body;

    // Tạo object dữ liệu cập nhật
    const updates = {
      country,
      product_code: code,
      product_name: name,
      description,
      product_type: edit_product_type,
      price,
      limit,
    };

    // Thực hiện cập nhật trong database
    const updatedProduct = await Product.findByIdAndUpdate(_id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
    }

    return res.redirect('/admin');
  } catch (error) {
    return res.status(500).json({
      error: 'Lỗi hệ thống',
      details: error.message,
    });
  }
};



module.exports = { createQuote, getCountries , updateProductLimit , updateProduct };
