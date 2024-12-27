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
  <a href="#routes">API Endpoints</a>

</p>

<p align="center">
  <b>Simple description of what your project do or how to use it.</b>
</p>

<h2 id="started">🚀 Getting started</h2>

Here you describe how to run your project locally

<h3>Prerequisites</h3>

Here you list all prerequisites necessary for running your project. For example:

- [NodeJS](https://github.com/)
- [Git](https://github.com)
- [Docker](https://www.docker.com/)

<h3>Cloning</h3>

How to clone your project

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

How to start your project

```bash
cd contact-list-system
npm install
npx prisma generate
```

<h3>Inicialize Container</h3>

How to start your project

```bash
docker-compose up -d
```

<h2 id="routes">📍 API Endpoints</h2>

Here you can list the main routes of your API and their descriptions.

| Route                                 | Description                                                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| <kbd>GET /authenticate</kbd>          | Retrieves user info. See [response details](#get-auth-detail)                                          |
| <kbd>POST /authenticate</kbd>         | Authenticate user into the API. See [request details](#post-auth-detail)                               |
| <kbd>POST /contacts</kbd>             | Add a new contact.                                                                                     |
| **Body:**                             | `{"name": "string", "phone": "string"}`                                                                |
| **Response:**                         | Return the created contact (id, name, and phone) with a status of 201.                                 |
| <kbd>GET /contacts</kbd>              | Returns a paginated list of contacts, sorted alphabetically by name.                                   |
| **Optimization:**                     | Use LIMIT and OFFSET for pagination and indexes in the database.                                       |
| **Response:**                         | Return a list of contacts with a status of 200.                                                        |
| <kbd>PATCH /contacts/id</kbd>         | Update an existing contact.                                                                            |
| **Parameter:**                        | `id` (unique identifier of the contact to be updated)                                                  |
| **Body:**                             | `{"name": "string", "phone": "string"}`                                                                |
| **Response:**                         | Return the updated contact with a status of 200.                                                       |
| <kbd>DELETE /contacts/id</kbd>        | Delete an existing contact.                                                                            |
| **Parameter:**                        | `id` (unique identifier of the contact to be deleted)                                                  |
| **Response:**                         | Return a success message with a status of 204.                                                         |
| <kbd>POST /groups</kbd>               | Create groups to link contacts.                                                                        |
| **Body:**                             | `{"name": "string"}`                                                                                   |
| **Response:**                         | Return the created group (id and name) with a status of 201.                                           |
| <kbd>PATCH /groups/id</kbd>           | Update an existing group.                                                                              |
| **Parameter:**                        | `id` (unique identifier of the group to be updated)                                                    |
| **Body:**                             | `{"name": "string"}`                                                                                   |
| **Response:**                         | Return the updated group with a status of 200.                                                         |
| <kbd>DELETE /groups/id</kbd>          | Delete an existing group.                                                                              |
| **Parameter:**                        | `id` (unique identifier of the group to be deleted)                                                    |
| **Response:**                         | Return a success message with a status of 204.                                                         |
| <kbd>GET /groups/:id/contacts</kbd>   | List all contacts linked to a specific group.                                                          |
| **Response:**                         | Return a list of contacts belonging to a group, with a status of 200.                                  |
| **Challenge:**                        | Ensure the query is optimized even with a large volume of data.                                        |
| <kbd>GET /report/contact-groups</kbd> | Returns a report with the number of contacts in each group, ordered by the highest number of contacts. |
| **Response:**                         | Return an array with the groups and corresponding contacts, with a status of 200.                      |
| **Example:**                          | `[{ "group": "Client X", "contact_count": 35 }, { "group": "Suppliers", "contact_count": 20 }]`        |

<h3 id="post-auth-detail">Access the following link to access the documentation</h3>

```json
http://localhost:3000/api-docs
```
