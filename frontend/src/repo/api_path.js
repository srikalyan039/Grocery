// Base URL pointing to Express Backend Port 3000
export const BASE_URL = "http://localhost:3000";

// API Endpoints
export const productUrl = `${BASE_URL}/api/v1/products`;
export const adminUrl = `${BASE_URL}/api/v1/admin`;
export const userUrl = `${BASE_URL}/api/v1/user`;
export const emailUrl = `${BASE_URL}/api/v1/user`; // alias in case any legacy component still imports emailUrl
export const cartUrl = `${BASE_URL}/api/v1/cart`;
export const imageUrl = BASE_URL;