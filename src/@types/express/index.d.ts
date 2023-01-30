import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      list: {
        listIndex: number;
        listId: number;
      };
    }
  }
}
