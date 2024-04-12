import { Op } from "sequelize";

interface IOptions {
  offset?: number;
  limit?: number;
}

export function parseFilter(findOptions, filterBy) {
  if (filterBy === undefined) return;

  const res = {};
  for (const key in filterBy) {
    const val = filterBy[key];
    if (val.eq !== undefined || val.lt !== undefined || val.gt !== undefined || val.lk !== undefined) res[key] = {};
    if (val.eq !== undefined) res[key][Op.in] = val.eq;
    if (val.gt !== undefined) res[key][Op.gt] = val.gt;
    if (val.lt !== undefined) res[key][Op.lt] = val.lt;
    if (val.lk !== undefined) res[key][Op.iLike] = `%${val.lk}%`;
  }

  if (Object.keys(res).length > 0) findOptions.where = res;

  if (findOptions.include === undefined) return;

  for (const obj of findOptions.include) {
    parseFilter(obj, filterBy[obj.as]);
  }
}

export function parseOrder(orderBy) {
  const order = [];

  // eslint-disable-next-line @typescript-eslint/no-shadow
  function generateOrders(orderBy, prefix: string[] = []) {
    for (const key in orderBy) {
      if (typeof orderBy[key] === "object") generateOrders(orderBy[key], [...prefix, key]);
      else order.push([...prefix, key, orderBy[key]]);
    }
  }

  generateOrders(orderBy);

  return order;
}

export function parsePagesize(where) {
  const options: IOptions = {};

  if (where.from !== undefined) {
    options.offset = where.from;
  } else {
    where.from = 0;
  }

  if (where.to !== undefined) {
    options.limit = where.to - where.from + 1;
  }

  return options;
}
