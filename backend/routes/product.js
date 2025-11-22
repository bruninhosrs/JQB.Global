const express = require("express");
const router = require("express").Router();
const productController = require("../controllers/productController");


router.post("/", productController.create);

module.exports = router;

