Specifications

[X]    Books have a title, author, and genre

Users can

[ ]        Add books into the bookstore system via an admin page (create)
[ ]        See a list of books on the home page (read)
[ ]        Edit a book's title, author, or genre (update)
[ ]        Delete a book from the bookstore (delete)
[ ]        Search for books by title OR by author OR by genre (read)
[ ]        View book details on a book detail page (read)
[ ]    Lists of books are always paginated in groups of 10
[ ]    Book detail view is linked to from the listing and search pages
[ ]    Search results are presented in a new page
[ ]    Appropriate HTTP verbs are used for CRUD actions (for reference, follow the guidelines explained in this article)
[ ]        GET requests are only used for read actions
[ ]        POST requests are only used for create actions
[ ]        PUT or PATCH requests are only used for update actions
[ ]        DELETE requests are only used for delete actions
[ ]    All views are rendered on the server using server-side templates written with Pug or EJS
[X]    Web server can be started with the command npm start
[X]    Test suite can be run with the command npm test
[ ]    All features are added as pull requests
[X]    All pull requests are approved by at least one other member of the team using GitHub's pull request review feature (so that your teammate's approval is of the PR is documented)
[X]  Variables, functions, files, etc. have appropriate and meaningful names.
[ ]  Functions are small and serve a single purpose
[ ]  Code uses a linter and there are no linting errors.
[ ]  Code is well tested and all tests are passing.
[X]  The artifact produced is properly licensed, preferably with the MIT license.

Stretch

[ ]    App is deployed and live on the web (consider using Heroku)
[ ]    All source code is written with ES6
[ ]    Users have their own account and can sign up and sign in/out
[ ]    Users have one of three roles: admin, clerk, reader
[ ]        Users with role reader can only view and search for books
[ ]        Users with role clerk can edit books in addition to viewing/searching
[ ]        Users with role admin can perform all actions (create, read, update, delete) with books
