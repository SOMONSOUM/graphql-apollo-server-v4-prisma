

export const authTypeDefs = `#graphql

  input UserLoginInput {
    phoneNumber: String!
    password: String!
  }

  type Token {
    token: String
  }

  input VerifyTokenInput {
    token: String
  }

  type Mutation {
    registerUser(input: UserPayload!): Ok
    loginUser(input: UserLoginInput!): User
    verifyToken(input: VerifyTokenInput!): User
    logout: Ok
  }
`;
