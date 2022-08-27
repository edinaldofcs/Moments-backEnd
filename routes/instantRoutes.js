const express = require("express");
const InstantController = require("../controllers/InstantController");
const router = express.Router();

router.post("/insert", InstantController.insert);
router.patch("/update/:id", InstantController.updateInstant);
router.patch("/like/:id", InstantController.addLike);
router.delete("/delete/:id", InstantController.deleteInstant);
router.get("/all", InstantController.listAll);

module.exports = {
  routes: router,
};
