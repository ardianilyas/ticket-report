export const VENDOR_VALIDATION_MESSAGE = {
  id: {
    uuid: "Invalid vendor id format",
  },
  name: {
    min: "Name is required",
  },
  email: {
    min: "Email is required",
  },
  phone: {
    min: "Phone is required",
  },
  address: {
    min: "Address is required",
  },
};

export const VENDOR_NOT_FOUND = "Vendor not found";

export const VENDOR_ROUTE = {
  GET_VENDORS: "/",
  GET_VENDOR: "/:id",
  CREATE_VENDOR: "/",
  UPDATE_VENDOR: "/:id",
  DELETE_VENDOR: "/:id",
}

export const VENDOR_ROUTE_TEST = {
  GET_VENDORS: "/api/vendors",
  GET_VENDOR: (id: string) => `/api/vendors/${id}`,
  CREATE_VENDOR: "/api/vendors",
  UPDATE_VENDOR: (id: string) => `/api/vendors/${id}`,
  DELETE_VENDOR: (id: string) => `/api/vendors/${id}`,
}