# Yoga Classes Registration 🧘‍♀️🧘‍♂️

This is a registration form for Yoga Classes. Here's what you need to know:

- You can enroll at any time of the month.
- Choose your batch timing from 6-7AM, 7-8AM, 8-9AM, or 5-6PM. Note: Once selected, you can only switch batches at the start of a new month.
- The monthly fee is Rs. 500, payable in one installment anytime within the month.

## Running the Project Locally

To run this project on your local machine, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the server folder in your code editor and run `npm install` in the terminal to install the necessary node modules.
3. Create a `.env` file inside the server folder and add your PostgreSQL connection string as `DATABASE_URL`.
4. Start the server by running `node index.js` in the terminal.
5. Start the client by initiating a live server on `index.html`.

## PostgreSQL Database Schema

Here's the schema for the PostgreSQL database used in this project:

```sql
CREATE TABLE users (
    UserID SERIAL PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Age INT NOT NULL CHECK (Age BETWEEN 18 AND 65),
    Email VARCHAR(100) UNIQUE,
    Password VARCHAR(100)
);

CREATE TABLE batches (
    BatchID SERIAL PRIMARY KEY,
    BatchTime VARCHAR(10) NOT NULL
);

CREATE TABLE enrollments (
    EnrollmentID SERIAL PRIMARY KEY,
    UserID INT REFERENCES users(UserID),
    BatchID INT REFERENCES batches(BatchID) CHECK (BatchID IN (1, 2, 3, 4)), -- Assuming 6-7AM = 1, 7-8AM = 2, 8-9AM = 3, 5-6PM = 4
    EnrollmentMonth DATE NOT NULL
);

CREATE TABLE payments (
    PaymentID SERIAL PRIMARY KEY,
    UserID INT REFERENCES users(UserID),
    Amount INT NOT NULL,
    PaymentDate DATE NOT NULL
);

```   

## Entity Relationship diagram:   
#### Description   

```
Entities:
1. Users
2. Batches
3. Enrollments
4. Payments

Attributes:
1. Users: UserID (Primary Key), Name, Age, Email (Unique), Password
2. Batches: BatchID (Primary Key), BatchTime
3. Enrollments: EnrollmentID (Primary Key), UserID (Foreign Key referencing Users.UserID), BatchID (Foreign Key referencing Batches.BatchID), EnrollmentMonth
4. Payments: PaymentID (Primary Key), UserID (Foreign Key referencing Users.UserID), Amount, PaymentDate

Relationships:
1. Users and Enrollments: One-to-One (One user can have only one enrollment)
2. Users and Payments: One-to-Many (One user can make multiple payments)
3. Batches and Enrollments: One-to-Many (One batch can have multiple enrollments)

```
