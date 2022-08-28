const express = require("express");
const InstantController = require("../controllers/InstantController");
const router = express.Router();

router.post("/insert/:collection", InstantController.insert);
router.patch("/update/:id/:collection", InstantController.updateInstant);
router.patch("/like/:id/:collection", InstantController.addLike);
router.delete("/delete/:id/:collection", InstantController.deleteInstant);
router.get("/all/:collection", InstantController.listAll);
router.get("/rooms", InstantController.listAllCollections);

module.exports = {
  routes: router,
};
