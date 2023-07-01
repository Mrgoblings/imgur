# Organizators' Team Interview Project - HACKTUES 2023 (imgur clone)

## Frontend Disclaimer
***IMPORTANT:*** THE FRONT END IS **NOT** MINE!1!!  (***IMPORTANT***)

Everything that is in folder "frontend" is made from Valentin Asenov, a fellow candidate for the it organizator position. - https://github.com/alt-plus-f4/imgur

ONLY the script "server_request.js" and the templates in folder "src" are made from me to connect backend and frontend

 

This project is developed as part of the interview process for the Organizators' Team in HACKTUES 2023.

## Technologies Used

- Node.js with TypeScript for building the CRUD REST API
- Prisma as the ORM (Object-Relational Mapping) tool
- PostgreSQL as the database


```
            +-----------------+
            |   Account       |
            +-----------------+
       +----- id              |
       | 1  | email           |
       |    | userName        |
       |    | displayName     |
       |    | createdAt       |
       |    | refreshToken    |
       |    | permissionLevel |
       |    +-----------------+
       |           |
       |           | 
       |           |
       |    +--------------+
       |    |    Post      |
       |    +--------------+
       |    | id        ---------+ 1
       |    | title        |     |
       |    | imageUrl     |     |
       |    | state        |     |
       |    | createdAt    |     |
       | N  | tags         |     |
       +----- senderId     |     |
       |    +--------------+     |
       |           |             |
       |           |             |
       |           |             |
       |    +--------------+     |
       |    |   Comment    |     |
       |    +--------------+     |
       |    | id        ------+  |
       | N  | body         | 1|  |
       +----- senderId     |  |  |
            | createdAt    |  )  |
            | postId    ---------+ N
            +--------------+  (
                   |          |
                   |          |
                   |          |
            +--------------+  |
            |CommentHistory|  |
            +--------------+  |
        +-----id           |  |
        | 1 | body         |  |
        |   | modifiedAt   | N|
        |   | commentId ------+
        |   +--------------+ 
        |          |          
        |          |          
        |          |          
        |   +--------------+  
        |   |    IpSeen    |  
        |   +--------------+  
        |   | id           |  
        |   | ip           |  
        | N | modifiedAt   | 
        +---- commentId    |
            +--------------+ 
```


## Project Structure

The project consists of the following main entities:

### Account

- `id`: Unique identifier for the account
- `email`: Email associated with the account (unique)
- `userName`: Username of the account (unique)
- `displayName`: Display name of the account
- `password`: Password of the account
- `createdAt`: Timestamp of when the account was created
- `refreshToken`: Refresh token associated with the account (optional and unique)
- `ipsSeen`: List of IP addresses seen for the account
- `permissionLevel`: Permission level of the account
- `posts`: Posts created by the account
- `comments`: Comments made by the account

### Post

- `id`: Unique identifier for the post
- `title`: Title of the post
- `imageUrl`: URL of the image associated with the post
- `state`: State of the post (e.g., DELETED, PRIVATE, UNLISTED, PUBLIC)
- `createdAt`: Timestamp of when the post was created
- `sender`: Account that created the post
- `tags`: Tags associated with the post
- `comments`: Comments made on the post

### Comments

- `id`: Unique identifier for the comment
- `body`: Body text of the comment
- `createdAt`: Timestamp of when the comment was created
- `sender`: Account that made the comment
- `onPost`: Post on which the comment was made
- `commentHistory`: History of modifications made to the comment

### CommentHistory

- `id`: Unique identifier for the comment history entry
- `body`: Body text of the comment at a specific point in time
- `modifiedAt`: Timestamp of when the comment was modified
- `comments`: Comment to which the history entry belongs

### IpSeen

- `id`: Unique identifier for the IP seen entry
- `ip`: IP address that was seen
- `account`: Account associated with the IP address

## Prerequisites

Before running the project, make sure you have the following:

- Node.js installed
- PostgreSQL database setup and accessible

## Getting Started

1. Clone the repository:
```
git clone <repository-url>
```


2. Install dependencies:
```
cd <project-folder>
npm install
```


3. Set up the .env and database:
   
- Create a `.env` file with your credentials.

```
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_SCHEMA=imgur
POSTGRES_USER=dummy_user
POSTGRES_PASSWORD=dummy_password
POSTGRES_DB=dummy_db

# JWT Configuration
JWT_EXPIRES_IN=20m
JWT_SECRET=<random_data>
RESET_TOKEN_SECRET=<random_data>

# Database URL
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/${POSTGRES_DB}?schema=${DB_SCHEMA}&sslmode=prefer

# Email Configuration
EMAIL_FROM_USERNAME="no-reply@example.com"
EMAIL_FROM_PASSWORD="password123"
EMAIL_SMTP="smtp.example.com"
EMAIL_PORT=587

# Cookie Configuration
COOKIE_JWT_KEY="YourCookieKey"
```
*The <random_data> should be a random string of at least 256 bytes (could use a crypto lirary for crypto.randomBits(512).toSting() or just some random text)*

- Create a PostgreSQL database (could be a docker).
  ```
  docker-compose --env-file .env up -d
  ```

4. Run database migrations:
```
npx prisma migrate dev
```


5. Start the application:
- Its on 2 different apis'
     - For authentication
     - For posts/coments 
```
npm run devStart
npm run devStartAuth
```

6. The two apis' should now be running at `http://localhost:3000` and `http://localhost:4000`.