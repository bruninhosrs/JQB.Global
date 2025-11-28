const express = require("express");
const router = express.Router();
const Product = require("../models/Product");


// ROTA DE CADASTRO DO PRODUTO
router.post("/create", async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json({
            message: "Produto cadastrado com sucesso!",
            data: newProduct
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro ao cadastrar produto" });
    }
});

module.exports = router;
router.post("/", productController.create);
router.get("/", productController.getProduct);
router.put("/:id", productController.updatedProduct);

module.exports = router;
