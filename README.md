# tpc-backend

## Description

This repository contains all the code for tpc-backend.
The code is written in Typescript using the NestJS Framework.

# Getting Started

## Editor Settings

We use VSCode for development and the repository contains all the formatting settings for VSCode. However, for VSCode to pick them up automatically, two plugins need to be installed in VSCode:

1. ESLint
2. Editorconfig
3. Prettier (https://marketplace.visualstudio.com/items?itemName=SimonSiefke.prettier-vscode) - Please make sure you install this one - not the other prettier plugins.

Once the above plugins are installed, VSCode should automatically point out the unformatted code and linting errors. It should also format the document on save.

## Understanding NestJS

We are using NestJS as the basic framework for the tpc-backend code. NestJS has excellent documentation that you can read,
but if you are looking to get started quickly and understand NestJS faster, this blog is a great resource:
https://www.freecodecamp.org/news/build-web-apis-with-nestjs-beginners-guide/

## Installation

We use yarn for development.

```bash
$ yarn
```

## Running the app
create `.env` file by copying from `.env.example`

```bash
# watch mode
$ yarn start:dev
```

Server will be hosted at `http://localhost:3000` and will have Swagger UI to play with APIs

### Code Organization

The codebase comprises of the following key structures:

**Model**:

This is the structure of the entity that we store in DB. This should go to the models directory and Services should only be using them. A controller should never directly
us a model.

**Entity**:

This is the key class which will have all the fields related to an entity and can have util methods. Controllers should only use Entity class.
We use class-transformer to hide some fields from the entity while returning it as a response.

**Service**:

This is the file that interacts with DB or any other external source of data to get the data. They do not have core application logic and are only responsible for fetching the data.

**Controller**:

Controllers are called directly from routes and can talk to multiple services to get the data. The application logic lives in the controllers.
They receive the request as a DTO, use services to get Entity class and then return the entity as a response.

**DTO**:

We use DTOs to type the input request types. DTOs should have all validation built in.

We currently have one module, but later we should move to one module for Company, Job, etc as NestJS recommends.

### Using transactions in the codebase

Sequelize supports transactions and we might be needing them for different use cases. Instead of writing the transaction block multiple times in our codebase, we use a TransactionInterceptor that creates a transaction at the start of the request
and commits the transaction when the request code completes. To use this feature, do the following steps for an api call:

```
Add @UseInterceptors(TransactionInterceptor) decorator to the controller function.
Inject the transaction param in the function using @TransactionParam() transaction: Transaction
```

### API Routes Naming Convention

1. Use smaller case
2. Separate words with hyphens.
3. Use forward slashes to denote URI hierarchy
4. Avoid special characters


```

## Adding Migrations
Migrations are used to make changes in the DB Schema. You can read more on them [here](https://sequelize.org/docs/v6/other-topics/migrations/)

You can find all existing migrations in the folder: src/db/migrations

To add a migration, use the command:

> npx sequelize-cli migration:generate --name <migration_name>

By default, when you run backend using `yarn start` we do not execute the migrations.
To execute them, we need to run

>  yarn migrate:dev
