export const PRODUCT_VALIDATION_MESSAGE = {
  id: {
    uuid: "Invalid product id format",
  },
  name: {
    min: "Product name is required",
  },
  description: {
    min: "Product description is required",
  },
  stock: {
    min: "Product stock is required",
  },
  unit: {
    min: "Product unit is required",
  },
  price: {
    min: "Product price is required",
  },
};

export const PRODUCT_NOT_FOUND = "Product not found";

export const PRODUCT_ROUTE_TEST = {
  GET_PRODUCTS: "/api/products",
  GET_PRODUCT: (id: string) => `/api/products/${id}`,
  CREATE_PRODUCT: "/api/products",
  UPDATE_PRODUCT: (id: string) => `/api/products/${id}`,
  DELETE_PRODUCT: (id: string) => `/api/products/${id}`,
}