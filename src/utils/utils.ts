export const isProductionEnv = (): boolean => {
  return process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging";
};

export const queryBuilder = (query: object, entity) => {
  for (const key in query) {
    if (typeof query[key] == "string" || typeof query[key] == "number" || typeof query[key] == "boolean") {
      entity[key] = query[key];
    } else if (typeof query[key] == "object") {
      entity[key] = Object.assign(entity[key], query[key]);
    } else {
      throw Error(`queryBuilder does not support type ${typeof query[key]} at key ${key}`);
    }
  }
  return entity;
};
