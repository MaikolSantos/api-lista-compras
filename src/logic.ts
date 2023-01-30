import { Request, Response } from "express";
import { database } from "./database";
import { IData, TData, TList } from "./interfaces";

const validateList = (payload: any) => {
  const payloadKeys: string[] = Object.keys(payload);
  const requiredKeysList: TList[] = ["listName", "data"];

  const joinedKeysList = requiredKeysList.join(", ");

  const existKeysList = requiredKeysList.every((key: string) =>
    payloadKeys.includes(key)
  );

  if (!existKeysList) {
    throw new Error(`Required keys: ${joinedKeysList}`);
  }

  const exceedsKeysList = payloadKeys.every((key: any) =>
    requiredKeysList.includes(key)
  );

  if (!exceedsKeysList) {
    throw new Error(`Required only keys: ${joinedKeysList}`);
  }

  if (existKeysList && exceedsKeysList) {
    if (typeof payload.listName !== "string") {
      throw new Error(`ListName isn't a string type`);
    }

    validateData(payload.data);
  }

  return payload;
};

const validateData = (data: any) => {
  data.map((item: any) => {
    const dataKeys = Object.keys(item);
    const requiredKeysData: TData[] = ["name", "quantity"];

    const joinedKeysData = requiredKeysData.join(", ");

    const existKeysData = requiredKeysData.every((key: string) =>
      dataKeys.includes(key)
    );

    if (!existKeysData) {
      throw new Error(`Required keys in data: ${joinedKeysData}`);
    }

    const exceedsKeysData = dataKeys.every((key: any) =>
      requiredKeysData.includes(key)
    );

    if (!exceedsKeysData) {
      throw new Error(`Required only keys in data: ${joinedKeysData}`);
    }
  });

  const validateTypesData = data.every(({ name, quantity }: any) => {
    return typeof name === "string" && typeof quantity === "string";
  });

  if (!validateTypesData) {
    throw new Error(`Name or quantity aren't a string type`);
  }

  return data;
};

const createList = (request: Request, response: Response): Response => {
  try {
    const body = validateList(request.body);

    if (database.length === 0) {
      body.id = 1;
    } else {
      body.id = database[database.length - 1].id + 1;
    }

    database.push(body);

    return response.status(201).json(body);
  } catch (error) {
    if (error instanceof Error) {
      return response.status(400).json({ message: error.message });
    }
    console.log(error);

    return response.status(500).json({ message: error });
  }
};

const readLists = (request: Request, response: Response): Response => {
  return response.status(200).json(database);
};

const readList = (request: Request, response: Response): Response => {
  const { listIndex, listId } = request.list;

  if (listIndex >= 0) {
    return response.status(200).json(database[listIndex]);
  } else {
    return response.status(404).json({
      message: `List with id ${listId} does not exist`,
    });
  }
};

const updateItem = (request: Request, response: Response): Response => {
  try {
    const { listIndex, listId } = request.list;
    const body = request.body;
    const name = request.params.name;

    if (listIndex < 0) {
      return response.status(404).json({
        message: `List with id ${listId} does not exist`,
      });
    }

    const foundItemIndex = database[listIndex].data.findIndex((item) => {
      return item.name === name;
    });

    if (foundItemIndex < 0) {
      return response.status(404).json({
        message: `Item with name ${name} does not exist`,
      });
    }

    validateData([body]);

    database[listIndex].data.map((item, i) => {
      if (item.name === name) {
        database[listIndex].data[i] = body;
      }
    });

    return response.status(200).json(body);
  } catch (error) {
    if (error instanceof Error) {
      return response.status(400).json({ message: error.message });
    }

    console.log(error);

    return response.status(500).json({ message: error });
  }
};

const deleteItemList = (request: Request, response: Response): Response => {
  const name: string = request.params.name;

  const { listIndex, listId } = request.list;

  if (listIndex >= 0) {
    let i: number = -1;

    database.map((list) => {
      if (list.id === listId) {
        i = list.data.findIndex((item: IData) => {
          return item.name === name;
        });

        i < 0 ? "" : list.data.splice(i, 1);
      }
    });

    if (i < 0) {
      return response.status(404).json({
        message: `Item with name ${name} does not exist`,
      });
    } else {
      return response.status(204).send();
    }
  } else {
    return response
      .status(404)
      .json({ message: `List with id ${listId} does not exist` });
  }
};

const deleteList = (request: Request, response: Response): Response => {
  const { listIndex, listId } = request.list;

  if (listIndex >= 0) {
    database.splice(listIndex, 1);

    return response.status(204).send();
  } else {
    return response.status(404).json({
      message: `List with id ${listId} does not exist`,
    });
  }
};

export {
  createList,
  readLists,
  readList,
  updateItem,
  deleteItemList,
  deleteList,
};
