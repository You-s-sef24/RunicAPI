# Runic API

A RESTful backend API for an e-commerce store built with Node.js, Express.js, and MongoDB using Mongoose.

## Features

- User registration, login, logout, and profile management.
- Authentication and admin authorization.
- Product and category management.
- English and Arabic product and category content.
- Product image uploads using Multer.
- Featured products and bestsellers.
- Order creation and status management.
- Shipping rates management.
- Store settings and nail-cost configuration.
- Pagination for list endpoints where implemented.
- Automatic calculation of order subtotal, shipping cost, and total price.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer
- express-validator

## Project Structure

```text
project/
├── controllers/
│   ├── categories.js
│   ├── orders.js
│   ├── products.js
│   ├── settings.js
│   ├── shippingRate.js
│   └── users.js
├── middleware/
│   ├── checkAdmin.js
│   ├── upload.js
│   └── verifyToken.js
├── models/
│   ├── category.js
│   ├── order.js
│   ├── product.js
│   ├── settings.js
│   ├── shippingRate.js
│   └── user.js
├── routes/
├── utils/
│   ├── calculateSubtotal.js
│   └── deleteImages.js
├── validators/
├── uploads/
│   ├── category/
│   └── product/
├── app.js
└── server.js
```

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <project-folder>
```

### 2. Install dependencies

```bash
npm install
```

Ensure the required packages are installed:

```bash
npm install express mongoose multer express-validator
```

Install any other dependencies used by your authentication, database, and server configuration.

### 3. Configure environment variables

Create a `.env` file in the project root.

```env
PORT=3000
MONGODB_URI=<your-mongodb-connection-string>
SECRET_KEY=<your-jwt-secret>
```

These are example variable names. Use the exact names expected by your application.

Never commit real secrets or database credentials.

### 4. Create upload directories

Ensure these directories exist:

```text
uploads/
├── category/
└── product/
```

### 5. Start the server

Use the scripts defined in your package.json. For example:

```bash
npm run dev
```

or:

```bash
npm start
```

## Authentication and Authorization

The API uses authentication and authorization middleware.

- Public endpoints: registration and login.
- Authenticated endpoints: logout, profile management, order creation, and viewing orders.
- Admin endpoints: product management, category management, order management, shipping-rate management, and settings management.

Protected requests may require this header:

```http
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

The following examples assume your routers are mounted under `/api`. Adjust the prefixes to match your Express application.

### Users — /api/users

| Method | Endpoint  | Description                       |
| ------ | --------- | --------------------------------- |
| POST   | /register | Register a new user               |
| POST   | /login    | Log in                            |
| POST   | /logout   | Log out                           |
| GET    | /         | Get all users                     |
| GET    | /:id      | Get a user profile                |
| PUT    | /me       | Update the current user's profile |

The all-users endpoint requires authentication and checks admin authorization in the controller.

### Categories — /api/categories

| Method | Endpoint | Description          |
| ------ | -------- | -------------------- |
| GET    | /        | Get all categories   |
| GET    | /:id     | Get a category by ID |
| POST   | /        | Create a category    |
| PATCH  | /:id     | Update a category    |
| DELETE | /:id     | Delete a category    |

Creating or updating a category can include an image uploaded using the field name `image`.

### Products — /api/products

| Method | Endpoint              | Description               |
| ------ | --------------------- | ------------------------- |
| GET    | /                     | Get all products          |
| GET    | /category/:categoryId | Get products by category  |
| GET    | /featured             | Get featured products     |
| GET    | /bestsellers          | Get best-selling products |
| GET    | /:id                  | Get a product by ID       |
| POST   | /                     | Create a product          |
| PUT    | /:id                  | Update a product          |
| DELETE | /:id                  | Delete a product          |

Product creation and updates support up to five uploaded images using the field name `images`.

Register specific routes such as `/featured`, `/bestsellers`, and `/category/:categoryId` before `/:id`.

### Orders — /api/orders

| Method | Endpoint      | Description                    |
| ------ | ------------- | ------------------------------ |
| GET    | /             | Get all orders                 |
| GET    | /user/:userId | Get orders belonging to a user |
| GET    | /:id          | Get an order by ID             |
| POST   | /             | Create an order                |
| PUT    | /:id          | Update an order's status       |

Administrators can retrieve all orders and update order statuses. Users can access their own orders, subject to the authorization checks.

Allowed order statuses:

- `pending`
- `delivered`

### Shipping Rates — /api/shipping-rates

| Method | Endpoint | Description            |
| ------ | -------- | ---------------------- |
| GET    | /        | Get shipping rates     |
| POST   | /        | Create a shipping rate |
| PATCH  | /:id     | Update a shipping rate |
| DELETE | /:id     | Delete a shipping rate |

These routes require authentication and administrator authorization.

### Settings — /api/settings

| Method | Endpoint   | Description          |
| ------ | ---------- | -------------------- |
| GET    | /nail-cost | Get the nail cost    |
| PATCH  | /nail-cost | Update the nail cost |

The nail cost is used when calculating orders that include nails.

## Pagination

List endpoints that implement pagination accept two query parameters:

- `page`: page number, starting at 1.
- `limit`: number of results per page, defaulting to 10 and capped at 100.

Examples:

```http
GET /api/products?page=1&limit=10
GET /api/categories?page=2&limit=10
GET /api/users?page=1&limit=20
GET /api/orders?page=2&limit=10
```

Pagination must be implemented in the corresponding controller before it is available on an endpoint.

## Image Uploads

Multer stores images in the local uploads directory.

Examples of stored paths:

```text
product/image-name.jpg
category/image-name.jpg
```

The database stores relative image paths. The frontend should use the public URL configured by your Express application to display images.

Recommendations:

- Ensure upload directories exist.
- Set appropriate file-size limits.
- Validate uploaded file types and contents.
- Use persistent or cloud storage when local files are not guaranteed to persist.
- Avoid deleting shared default images when removing products or categories.

## Data Models

### User

- name
- email
- password
- isAdmin
- phone
- createdAt
- updatedAt

Passwords should be hashed before storage.

### Category

- name.en
- name.ar
- description.en
- description.ar
- image
- createdAt
- updatedAt

### Product

- name.en
- name.ar
- description.en
- description.ar
- price
- dimensions
- categoryId
- images
- featured
- createdAt
- updatedAt

### Order

- userId
- items
- shippingAddress
- government
- status
- nails
- nailsCost
- subTotal
- shippingCost
- total
- createdAt
- updatedAt

Each order item stores the product ID, localized product name, price, and quantity.

### Shipping Rate

- government
- name.en
- name.ar
- price
- isActive
- createdAt
- updatedAt

### Settings

- nailCost
- createdAt
- updatedAt

## Order Calculation

When a customer creates an order, the backend:

1. Validates the request.
2. Checks whether shipping is available for the selected government.
3. Retrieves product information and calculates the subtotal.
4. Calculates the additional nail cost when applicable.
5. Retrieves the shipping cost.
6. Calculates the final order total.
7. Creates the order with a pending status.

The calculation is:

total = subTotal + nailsCost + shippingCost

Prices and totals should be calculated on the server rather than trusted from client input.

## Error Handling

The controllers pass unexpected errors to Express using `next(err)`.

Common HTTP status codes include:

- 400 — Bad Request
- 401 — Unauthorized
- 403 — Forbidden
- 404 — Not Found
- 500 — Internal Server Error

The exact error response depends on the controller and error-handling middleware.

## Security Notes

- Hash passwords before saving them.
- Protect administrative endpoints with authentication and authorization.
- Validate request bodies and URL parameters.
- Validate uploaded files and limit their sizes.
- Keep secrets out of version control.
- Ensure image deletion cannot access files outside the uploads directory.
- Configure persistent storage for production deployments.
- Add appropriate rate limiting and production security protections.

## License

Add your preferred license information here.
