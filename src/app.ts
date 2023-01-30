import express, { Application, json } from "express";

import {
  createList,
  deleteItemList,
  deleteList,
  readList,
  readLists,
  updateItem,
} from "./logic";

import { getListIndex } from "./middlewares";

const app: Application = express();
app.use(json());

app.post("/purchaseList", createList);
app.get("/purchaseList", readLists);
app.get("/purchaseList/:id", getListIndex, readList);
app.patch("/purchaseList/:id/:name", getListIndex, updateItem);
app.delete("/purchaseList/:id/:name", getListIndex, deleteItemList);
app.delete("/purchaseList/:id", getListIndex, deleteList);

const PORT: number = 3000;
app.listen(PORT, () => {
  return console.log(`The serve is running on http://localhost:${PORT}`);
});
