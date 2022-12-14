var express = require('express');
const { render, response } = require('../app')
const productHelpers = require('../helpers/product-helpers')
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
/* GET users listing. */
router.get('/', function (req, res, next) {
  productHelpers.getAllProducts().then((products) => {
    res.render('admin/view-products', { admin: true, products });
  })

});
router.get('/add-product', function (req, res) {

  res.render('admin/add-product')
})
router.post('/add-product', (req, res) => {


  productHelper.addProduct(req.body, (id) => {
    let Image = req.files.image
    console.log(id);
    Image.mv('./public/product-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.render("admin/add-product")
      } else {
        console.log(err);
      }
    })

  })
})

router.get('/delete-product/:id', (req, res) => {
  let proId = req.params.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response) => {
    res.redirect('/admin/')
  })

})

router.get('/edit-product/:id', async (req, res) => {
  let product = await productHelpers.getProductDetails(req.params.id)
  res.render('admin/edit-product', { product })
})


router.post('/edit-product/:id', (req, res) => {
  let id = req.params.id
  productHelpers.updateProduct(req.params.id, req.body).then((response) => {
    res.redirect('/admin')
    if (req.files.image) {
      let Image = req.files.image
      Image.mv('./public/product-images/' + id + '.jpg')
    }
  })

})
module.exports = router;

