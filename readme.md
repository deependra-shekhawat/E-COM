# E-COM Project

This project is a Node.js-based e-commerce application designed to handle various functionalities such as user management, product management, and order processing.

## Features
- User authentication and authorization
- Product catalog management
- Cart and order management
- RESTful APIs for seamless integration

---

## Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```bash
    cd E-COM
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Start the server:
    ```bash
    npm start
    ```

---

## API Endpoints

### 1. User APIs
- **Register User**
  - **Endpoint:** `POST /api/users/register`
  - **Request Body:**
     ```json
     {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "password123"
     }
     ```
  - **Sample Response:**
     ```json
     {
        "message": "User registered successfully",
        "userId": "12345"
     }
     ```

- **Login User**
  - **Endpoint:** `POST /api/users/login`
  - **Request Body:**
     ```json
     {
        "email": "john@example.com",
        "password": "password123"
     }
     ```
  - **Sample Response:**
     ```json
     {
        "message": "Login successful",
        "token": "jwt-token"
     }
     ```

---

### 2. Product APIs
- **Get All Products**
  - **Endpoint:** `GET /api/products`
  - **Sample Response:**
     ```json
     [
        {
          "id": "1",
          "name": "Laptop",
          "price": 1000,
          "description": "High-performance laptop"
        },
        {
          "id": "2",
          "name": "Phone",
          "price": 500,
          "description": "Latest smartphone"
        }
     ]
     ```

- **Add Product**
  - **Endpoint:** `POST /api/products`
  - **Request Body:**
     ```json
     {
        "name": "Tablet",
        "price": 300,
        "description": "Portable tablet"
     }
     ```
  - **Sample Response:**
     ```json
     {
        "message": "Product added successfully",
        "productId": "3"
     }
     ```

---

### 3. Order APIs
- **Create Order**
  - **Endpoint:** `POST /api/orders`
  - **Request Body:**
     ```json
     {
        "userId": "12345",
        "products": [
          { "productId": "1", "quantity": 1 },
          { "productId": "2", "quantity": 2 }
        ]
     }
     ```
  - **Sample Response:**
     ```json
     {
        "message": "Order created successfully",
        "orderId": "67890"
     }
     ```

- **Get User Orders**
  - **Endpoint:** `GET /api/orders/:userId`
  - **Sample Response:**
     ```json
     [
        {
          "orderId": "67890",
          "products": [
             { "productId": "1", "quantity": 1 },
             { "productId": "2", "quantity": 2 }
          ],
          "totalPrice": 2000
        }
     ]
     ```

---

## Sample Output

### Example: Fetching All Products
**Request:**
```bash
GET /api/products
```

**Response:**
```json
[
  {
     "id": "1",
     "name": "Laptop",
     "price": 1000,
     "description": "High-performance laptop"
  },
  {
     "id": "2",
     "name": "Phone",
     "price": 500,
     "description": "Latest smartphone"
  }
]
```

---