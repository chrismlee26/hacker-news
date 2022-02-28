# Hacker-News Clone

- #### v1.0.0
- GraphQL, Apollo-Server, Prisma, TypeScript-Node
- API Project
- Project includes Pagination, Filter, Sort & Subscription (WebSockets: Apollo-Server)

## How to Run Project:

#### Add Dependencies:

```
npm i
```

#### To Run Application

```
npm run dev
```

#### View GraphQL Interface and access API:

```
http://localhost:3000
```

## This GraphQL Schema allows for the following operations:

#### Query:

- `feed` : Retrieves all links from the backend. Query allows for filter, sorting and pagination arguments

- Sample Query:

```
query {
  feed (take: #) {
    count
    links {
      id
      createdAt
      description
    }
  }
}
```

- Sample `feed` query to retrieve first 10 links from the server:

```
{
  feed(skip: 0, take: 10) {
    links {
      description
      url
      postedBy {
        name
      }
    }
  }
}

```

#### Mutations:

- `post` : Allows authenticated users to create a new link. To submit a post:

```
mutation {
  post(url: "www.prisma.io", description: "Next-generation Node.js and TypeScript ORM") {
    id
  }
}
```

- `signup` : Create an account for new user. To create a new user:

```
mutation {
  signup(name: "Chris", email: "chris@sample.io", password: "graphql") {
    token
    user {
      id
    }
  }
}
```

- For Signup, copy the authentication token and paste on the `Headers` tab.
  [x] | Authentication | Bearer **TOKEN_ID** |
  | --- | --- | --- |

- Invoke the post resolver and validate the provided JWT. With `authentication` header in place, send the following mutation to the server.

```
mutation {
  post(url: "nexusjs.org", description: "Code-First GraphQL schemas for JavaScript/TypeScript") {
    id
    description
    url
    postedBy {
      id
      name
      email
    }
  }
}
```

- `login` : Login existing user

```
mutation {
  login(email: "chris@sample.io", password: "graphql") {
    token
    user {
      email
      links {
        url
        description
      }
    }
  }
}
```

- `vote` : Allows authenticated users to vote for an existing link

```
mutation {
  vote(linkId: _LINK_ID_) {
    link {
      url
      description
    }
    user {
      name
      email
    }
  }
}
```

#### Subscriptions:

- `newLink` : Receive realtime updates when a new link is created
- `newVote` : Receive realtime updates when a vote was submitted
