const { ApolloServer, gql } = require('apollo-server')
const { buildFederatedSchema } = require('@apollo/federation')

const accounts = [
  {
    id: 1,
    name: 'indigov',
  },
]

const typeDefs = gql`
  type Account @key(fields: "id") {
    id: ID!
    name: String
  }
  extend type Query {
    account(id: ID!): Account
    accounts: [Account]
  }
`

const resolvers = {
  Account: {
    _resolveReference(object) {
      return accounts.find((account) => account.id === object.id)
    },
  },
  Query: {
    account(parent, { id }) {
      return accounts.find((account) => account.id === id)
    },
    accounts() {
      return accounts
    },
  },
}

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
})

const port = process.env.PORT || 3002

server.listen({ port }).then(({ url }) => {
  console.log(`Accounts service ready at ${url}`)
})
