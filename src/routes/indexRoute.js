const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
  const coffeeData = [
    {
      country: "Brazil",
      flag: "🇧🇷",
      coffees: [
        { code: "BR001", name: "Coffee A", method: "Natural", price: 200000 },
        { code: "BR002", name: "Coffee B", method: "Washed", price: 250000 },
      ],
    },
    { 
      country: "Costa Rica",
      flag: "🇨🇷",
      coffees: [
        { code: "CR001", name: "Coffee C", method: "Honey", price: 300000 },
      ],
    },
    {
      country: "Guatemala",
      flag: "🇬🇹",
      coffees: [
        { code: "GT001", name: "Coffee D", method: "Natural", price: 280000 },
      ],
    },
  ];

  // Render trang chủ
  res.render("index", { coffeeData });
});

module.exports = router;
