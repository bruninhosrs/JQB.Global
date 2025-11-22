const express = require("express");
const router = require("express").Router();

const productRouter = require("./product");



router.use("/produtos", productRouter);

module.exports = router;