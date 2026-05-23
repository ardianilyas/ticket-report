export const CATEGORY_ROUTE = {
  GET_CATEGORIES: "/",
  GET_CATEGORY: "/:id",
  CREATE_CATEGORY: "/",
  UPDATE_CATEGORY: "/:id",
  DELETE_CATEGORY: "/:id",
}

export const CATEGORY_ROUTE_TEST = {
  GET_CATEGORIES: "/api/categories",
  GET_CATEGORY: (id: string) => `/api/categories/${id}`,
  CREATE_CATEGORY: "/api/categories",
  UPDATE_CATEGORY: (id: string) => `/api/categories/${id}`,
  DELETE_CATEGORY: (id: string) => `/api/categories/${id}`,
}