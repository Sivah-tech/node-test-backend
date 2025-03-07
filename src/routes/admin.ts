import { Router } from "express";
import {
    getDashboardStats, getAllUsers, getUserInfo,updateAUser, deleteAUser, createUser
} from "../controllers/admin/admin";

import {
    getAllcategories, createCategory, getCategoryInfo,updateACategory, deleteACategory,
} from "../controllers/category/category";

import {
    getAllproduct, createProduct, getProductInfo,updateAProduct, deleteAProduct,getProductByCategory
} from "../controllers/product/product";



// import { checkAdminAuth } from "../middleware/check-auth";
import { upload } from "../configF/multer";
import { checkMulter } from "../lib/errors/error-response-handler"
import { checkAuth } from "src/middleware/check-auth";



const router = Router();

router.get("/dashboard", checkAuth, getDashboardStats)
router.route("/users").get(checkAuth, getAllUsers).post(checkAuth, createUser)
router.route("/user/:id").get(checkAuth, getUserInfo).patch(checkAuth, updateAUser).delete(checkAuth, deleteAUser)
// category and product

router.route("/categories").get(checkAuth, getAllcategories).post(checkAuth, createCategory)
router.route("/category/:id").get(checkAuth, getCategoryInfo).patch(checkAuth, updateACategory).delete(checkAuth, deleteACategory)

router.route("/products").get(checkAuth, getAllproduct).post(checkAuth, createProduct)
router.route("/product/:id").get(checkAuth, getProductInfo).patch(checkAuth, updateAProduct).delete(checkAuth, deleteAProduct)
router.route("/productbycategory/:id").get(checkAuth, getProductByCategory)


export { router }
