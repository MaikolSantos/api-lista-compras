interface IData {
  name: string;
  quantity: string;
}

interface IList {
  listName: string;
  data: IData[];
}

interface IListResponse extends IList {
  id: number;
}

type TData = "name" | "quantity";

type TList = "listName" | "data";

export { IData, IList, IListResponse, TData, TList };
