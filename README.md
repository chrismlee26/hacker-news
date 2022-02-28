# Hacker-News Clone

- GraphQL, Apollo, TypeScript
- API Project

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

- `post` : Allows authenticated users to create a new link
- `signup` : Create an account for new user. To create a new user:

```
mutation {
  signup(name: "Sarah", email: "sarah@prisma.io", password: "graphql") {
    token
    user {
      id
    }
  }
}
```

- `login` : Login existing user
- `vote` : Allows authenticated users to vote for an existing link

#### Subscriptions:

- `newLink` : Receive realtime updates when a new link is created
- `newVote` : Receive realtime updates when a vote was submitted
