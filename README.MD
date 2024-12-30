[TYPESCRIPT__BADGE]: https://img.shields.io/badge/typescript-D4FAFF?style=for-the-badge&logo=typescript
[EXPRESS__BADGE]: https://img.shields.io/badge/express-005CFE?style=for-the-badge&logo=express

<h1 align="center" style="font-weight: bold;">Contact List API 💻</h1>

![typescript][TYPESCRIPT__BADGE]
![express][EXPRESS__BADGE]
<img src="https://img.shields.io/badge/MySQL-4479A1.svg?style=for-the-badge&logo=MySQL&logoColor=white">
<img src="https://img.shields.io/badge/Node.js-5FA04E.svg?style=for-the-badge&logo=nodedotjs&logoColor=white">
<img src="https://img.shields.io/badge/Docker-2496ED.svg?style=for-the-badge&logo=Docker&logoColor=white">
<img src="https://img.shields.io/badge/Vitest-6E9F18.svg?style=for-the-badge&logo=Vitest&logoColor=white">

<p align="center">
 <a href="#started">Getting Started</a> • 
  <a href="#routes">API Endpoints</a> •
 <a href="#tests">Getting Started</a>  
</p>

<p align="center">
  <b>Contact List Management API with Node.Js.</b>
</p>

<h2 id="started">🚀 Getting started</h2>

Perform the following steps to install the system

<h3>Prerequisites</h3>

Prerequisites necessary for running the project.

- [NodeJS](https://github.com/)
- [Git](https://github.com)
- [Docker](https://www.docker.com/)

<h3>Cloning</h3>

How to clone the project

```bash
git clone https://github.com/LucasLevingston/contact-list-system
```

<h3> Environment Variables</h2>

Use the `.env.example` as reference to create your configuration file `.env`

```yaml
DATABASE_URL="mysql://prisma:prismapass@localhost:3306/contact_system"
SHADOW_DATABASE_URL="mysql://prisma:prismapass@localhost:6033/contact_system"
PORT=3000
HOST=localhost
```

<h3>Starting</h3>

How to start the project

```bash
cd contact-list-system
npm install
npx prisma generate
```

Inicialize Container

```bash
docker-compose up -d
```

<h2 id="routes">📍 API Endpoints</h2>

Here you can list the main routes of your API and their descriptions.

| Route                                 | Description                                                                                                  | Body / Parameter                        | Response                                                                          |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------- | --------------------------------------------------------------------------------- |
| <kbd>POST /contacts</kbd>             | Add a new contact.                                                                                           | `{"name": "string", "phone": "string"}` | Return the created contact (id, name, and phone) with a status of 201.            |
| <kbd>GET /contacts</kbd>              | Returns a paginated list of contacts, sorted alphabetically by name.                                         |                                         | Return a list of contacts with a status of 200.                                   |
|                                       | **Optimization:** Use LIMIT and OFFSET for pagination and indexes in the database.                           |                                         |                                                                                   |
| <kbd>PATCH /contacts/id</kbd>         | Update an existing contact.                                                                                  | `{"name": "string", "phone": "string"}` | Return the updated contact with a status of 200.                                  |
| **Parameter:**                        | `id` (unique identifier of the contact to be updated)                                                        |                                         |                                                                                   |
| <kbd>DELETE /contacts/id</kbd>        | Delete an existing contact.                                                                                  |                                         | Return a success message with a status of 204.                                    |
| **Parameter:**                        | `id` (unique identifier of the contact to be deleted)                                                        |                                         |                                                                                   |
| <kbd>POST /groups</kbd>               | Create groups to link contacts.                                                                              | `{"name": "string"}`                    | Return the created group (id and name) with a status of 201.                      |
| <kbd>PATCH /groups/id</kbd>           | Update an existing group.                                                                                    | `{"name": "string"}`                    | Return the updated group with a status of 200.                                    |
| **Parameter:**                        | `id` (unique identifier of the group to be updated)                                                          |                                         |                                                                                   |
| <kbd>DELETE /groups/id</kbd>          | Delete an existing group.                                                                                    |                                         | Return a success message with a status of 204.                                    |
| **Parameter:**                        | `id` (unique identifier of the group to be deleted)                                                          |                                         |                                                                                   |
| <kbd>GET /groups/:id/contacts</kbd>   | List all contacts linked to a specific group.                                                                |                                         | Return a list of contacts belonging to a group, with a status of 200.             |
|                                       | **Challenge:** Ensure the query is optimized even with a large volume of data.                               |                                         |                                                                                   |
| <kbd>GET /report/contact-groups</kbd> | Returns a report with the number of contacts in each group, ordered by the highest number of contacts.       |                                         | Return an array with the groups and corresponding contacts, with a status of 200. |
|                                       | **Example:** `[{ "group": "Client X", "contact_count": 35 }, { "group": "Suppliers", "contact_count": 20 }]` |                                         |                                                                                   |

<h3 id="post-auth-detail">Access the following link to access the swagger documentation</h3>

```json
http://localhost:3000/api-docs
```

<h2 id="tests">🧪 Unit Tests </h2>

Use the following command to run unit tests with vitest on the test database

```bash
npm run test
```
