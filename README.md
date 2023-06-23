# imgur
A project made for the interview for the organizators' team in HACKTUES 2023



Using:
-  nodejs with typescript for CRUD REST API, 
- prisma for orm 
- postgresql for database

```
            +--------------+
            |   Account    |
            +--------------+
       +----- id           |
       | 1  | email        |
       |    | userName     |
       |    | displayName  |
       |    | password     |
       |    +--------------+
       |           |
       |           | 
       |           |
       |    +--------------+
       |    |    Post      |
       |    +--------------+
       |    | id        --------+ 1
       |    | title        |    |
       |    | image        |    |
       | N  | state        |    |
       +----- senderId     |    |
       |    +--------------+    |
       |           |            |
       |           |            |
       |           |            |
       |    +--------------+    |
       |    |   Comment    |    |
       |    +--------------+    |
       |    | id        ------+ |
       | N  | body         | 1| |
       +----- senderId     |  | |
            | postId    --------+ N
            +--------------+  |
                   |          |
                   |          |
                   |          |
            +--------------+  |
            |CommentHistory|  |
            +--------------+  |
            | id           |  |
            | body         |  |
            | modifiedAt   | N|
            | commentId ------+
            +--------------+ 
```