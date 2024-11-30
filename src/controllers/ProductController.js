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
    const { 
      country, 
      code, 
      name, 
      product_type, 
      price, 
      description, 
      limit, 
      brew_type, 
      weight, 
      roast_level,
      status
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!name || !code || !price || !brew_type || !weight || !roast_level) {
      return res.status(400).json({
        success: false,
        message: 'Tên sản phẩm, mã sản phẩm, giá, kiểu pha chế, trọng lượng và kiểu rang là bắt buộc!',
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Giá sản phẩm phải lớn hơn 0!',
      });
    }

    // Kiểm tra `country`
    const countryData = await Country.findById(country);
    if (!countryData) {
      return res.status(400).json({
        success: false,
        message: 'Quốc gia không hợp lệ!',
      });
    }

    // Kiểm tra `product_type`
    const validProductTypes = ['general', 'specialty', 'lot'];
    if (product_type && !validProductTypes.includes(product_type)) {
      return res.status(400).json({
        success: false,
        message: `Loại sản phẩm không hợp lệ! Hợp lệ: ${validProductTypes.join(', ')}`,
      });
    }

    // Kiểm tra `brew_type`
    const validBrewTypes = ['Pour', 'Pour + Espresso', 'Espresso'];
    if (!validBrewTypes.includes(brew_type)) {
      return res.status(400).json({
        success: false,
        message: `Kiểu pha chế không hợp lệ! Hợp lệ: ${validBrewTypes.join(', ')}`,
      });
    }

    // Kiểm tra `weight`
    const validWeights = ['18 gram', '200 gram', '500 gram', '1kg', 'Vui lòng liên hệ'];
    if (!validWeights.includes(weight)) {
      return res.status(400).json({
        success: false,
        message: `Trọng lượng không hợp lệ! Hợp lệ: ${validWeights.join(', ')}`,
      });
    }

    // Kiểm tra `roast_level`
    const validRoastLevels = ['Light', 'Light Medium', 'Medium', 'Medium-Dark', 'Dark', 'Very Dark'];
    if (!validRoastLevels.includes(roast_level)) {
      return res.status(400).json({
        success: false,
        message: `Kiểu rang không hợp lệ! Hợp lệ: ${validRoastLevels.join(', ')}`,
      });
    }

    // Sử dụng giá trị `limit` từ input nếu hợp lệ, nếu không thì dùng giá trị mặc định là 2
    const productLimit = limit && limit > 0 ? limit : 2;

    // Tạo sản phẩm mới
    const newProduct = new Product({
      product_code: code,
      product_name: name,
      product_type: product_type || 'general', // Sử dụng giá trị mặc định nếu không truyền
      description: description || '',
      country: country,
      price: price,
      status: status || 'newlot',
      limit: productLimit,
      brew_type: brew_type,
      weight: weight,
      roast_level: roast_level,
    });

    // Lưu sản phẩm vào cơ sở dữ liệu
    await newProduct.save();

    // Trả về kết quả thành công
    res.json({
      success: true,
      message: 'Sản phẩm đã được tạo thành công!'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi tạo sản phẩm!',
    });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { _id, country, code, name, description, edit_product_type, price, limit, brew_type, weight, roast_level, status } = req.body;

    // Kiểm tra nếu thiếu bất kỳ trường nào quan trọng
    if (!_id || !name || !code || !price || !brew_type || !weight || !roast_level) {
      return res.status(400).json({ success: false, error: 'Các trường bắt buộc không được bỏ trống.' });
    }

    // Tạo object cập nhật các trường
    const updates = {
      country,
      product_code: code,
      product_name: name,
      description,
      product_type: edit_product_type,
      price,
      limit,
      brew_type,
      weight,
      roast_level,
      status
    };

    const updatedProduct = await Product.findByIdAndUpdate(_id, updates, { new: true, runValidators: true });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy sản phẩm.' });
    }

   res.redirect('/admin');

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Lỗi hệ thống',
      details: error.message,
    });
  }
};



const getProducts = async (req, res) => {
  try {
    // Nhóm sản phẩm theo country và lấy thông tin quốc gia
    const productsByCountry = await Product.aggregate([
      {
        $group: {
          _id: "$country", // Nhóm theo trường country
          products: { $push: "$$ROOT" } // Lấy tất cả thông tin sản phẩm trong nhóm này
        }
      },
      {
        $lookup: {
          from: "countries", // Tên collection quốc gia
          localField: "_id", // Trường dùng để nối với _id trong collection countries
          foreignField: "_id", // Trường trong collection countries để nối với _id của sản phẩm
          as: "countryInfo" // Tên trường mới chứa thông tin quốc gia
        }
      },
      {
        $unwind: "$countryInfo" // Chỉ lấy 1 quốc gia cho mỗi nhóm
      },
      {
        $sort: { "_id": 1 } // Sắp xếp theo tên quốc gia
      }
    ]);


    // Truyền dữ liệu nhóm sản phẩm theo country vào template
    res.render("index", { products: productsByCountry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi tải dữ liệu sản phẩm' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params; 
    
    // Kiểm tra ID sản phẩm hợp lệ
    if (!productId) {
      return res.status(400).json({ message: 'ID sản phẩm không hợp lệ!' });
    }

    // Tìm và xóa sản phẩm theo ID
    const product = await Product.findByIdAndDelete(productId);

    // Nếu không tìm thấy sản phẩm
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
    }

    // Trả về phản hồi thành công
    return res.status(200).json({
      success: true,
      message: 'Sản phẩm đã được xóa thành công.',
    });
  } catch (error) {
    console.error(error);
    // Trả về phản hồi lỗi khi có ngoại lệ
    return res.status(500).json({ message: 'Lỗi khi xóa sản phẩm' });
  }
};







module.exports = { createQuote, getCountries , updateProductLimit , updateProduct , getProducts , deleteProduct  };
