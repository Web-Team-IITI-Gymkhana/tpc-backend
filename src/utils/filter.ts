/* eslint-disable @typescript-eslint/no-shadow */
import { Op } from "sequelize";

export function parseFilter(filterBy: any) {
  const res = {};

  for (const key in filterBy) {
    const val = filterBy[key];
    if (val.eq !== undefined || val.lt !== undefined || val.gt !== undefined) res[key] = {};
    if (val.eq !== undefined) res[key][Op.in] = val.eq;
    if (val.gt !== undefined) res[key][Op.gt] = val.gt;
    if (val.lt !== undefined) res[key][Op.lt] = val.lt;
  }

  return res;
}

export function parseOrder(orderBy) {
  const order = [];

  function generateOrders(orderBy, prefix) {
    for (const key in orderBy) {
      if (typeof orderBy[key] === "object") generateOrders(orderBy[key], [...prefix, key]);
      else order.push([...prefix, key, orderBy[key]]);
    }
  }

  generateOrders(orderBy, []);

  return order;
}
