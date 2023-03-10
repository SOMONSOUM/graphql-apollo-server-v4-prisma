export const userTypeDefs = `#graphql
  type User {
    id: Int
    name: String
    email: String!
    phoneNumber: String!
    token: String
    dateJoined: String
    lastLogin: String
  }
  input UserPayload {
    name: String
    phoneNumber: String
    email: String
    password: String
    avatar: String
  }

  type Query {
    user(id: Int): User
    me: User
  }

  type Mutation {
    updateUser(input: UserPayload!, id: String!): Ok
    userInvite(input: UserPayload): Ok
  }

  type Subscription {
    userInvite: User
  }
`;
