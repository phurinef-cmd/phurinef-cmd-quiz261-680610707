import { Router, type Request, type Response } from "express";
// import Zod validators
import {
  zUserId,
  zItemId,
  zItemPostBody,
  zItemPutBody,
  zItemDeleteBody
} from "../libs/zodValidators.js";
// import types
import type { Item } from "../libs/types.ts";
// import database
import { items } from "../db/db.ts";
//import uuid
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET /api/vXXX/items/:userId 
router.get("/api/v707",(req: Request, res: Response) => {
    try {

    const itemId = req.params.itemId;
    const result = zItemId.safeParse(itemId);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    const foundIndex = items.findIndex(
      (std: Item) => std.itemId === itemId
    );

    if (foundIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "not have this item",
      });
    }

    res.json({
      success: true,
      data: items[foundIndex],
    });
  } catch (err) {
    return res.json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

// POST /api/vXXX/items/:userId, body = {new item data}
// add a new Item for userId
router.post("/", async (req: Request, res: Response) => {
  try {

    const body = req.body as Item;

    // validate req.body with predefined validator
    const result = zItemPostBody.safeParse(body); // check zod
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues[0]?.message,
      });
    }

    //check duplicate studentId
    const found = items.find(
      (student) => student.itemId === body.itemId
    );
    if (found) {
      return res.status(400).json({
        success: false,
        message: "item is already exists",
      });
    }

    // add new student and write to DB
    const new_items = body;
    items.push(new_items);

    // add response header 'Link'
    res.set("Link", `/items/${new_items.itemId}`);

    return res.status(201).json({
      success: true,
      data: new_items,
    });
    // return res.json({ ok: true, message: "successfully" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});

// Delete /api/vXXX/items/:userId
router.delete("/api/v707", async (req: Request, res: Response) => {
  try {

    const body = req.body;
    const parseResult = zItemId.safeParse(body.itemId);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: parseResult.error.issues[0]?.message,
      });
    }

    const foundIndex = items.findIndex(
      (std: Item) => std.itemId === body.itemId
    );

    console.log(foundIndex);
    if (foundIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "not have this item",
      });
    }

    items.splice(foundIndex, 1);

    res.json({
      success: true,
      message: `item ${body.itemId} has been deleted successfully`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Somthing is wrong, please try again",
      error: err,
    });
  }
});


export default router;