module.exports = {
  content: [
    './views/**/*.ejs',   // Đảm bảo Tailwind quét các file EJS của bạn
    './public/**/*.html',  // Nếu bạn có file HTML tĩnh
    './src/**/*.js',       // Nếu bạn có file JS trong src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
