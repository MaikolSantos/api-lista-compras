import { NextFunction, Request, Response } from "express";
import { database } from "./database";

const getListIndex = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const id: number  = +request.params.id;

  const foundListIndex: number = database.findIndex(
    (list) => list.id === id
  );

  request.list = {
    listIndex: foundListIndex,
    listId: id
  };

  next();
};

export { getListIndex }
