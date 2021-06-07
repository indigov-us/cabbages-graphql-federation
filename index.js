const { ApolloServer, gql } = require('apollo-server')
const { buildFederatedSchema } = require('@apollo/federation')

const cabbages = [
  {
    id: 1,
    name: 'Mark',
  },
]

const typeDefs = gql`
  type Cabbage @key(fields: "id") {
    id: ID!
    name: String
  }
  extend type Query {
    cabbage(id: ID!): Cabbage
    cabbages: [Cabbage]
  }
`

const resolvers = {
  Cabbage: {
    _resolveReference(object) {
      return cabbages.find((cabbages) => cabbages.id === object.id)
    },
  },
  Query: {
    cabbage(parent, { id }) {
      return cabbages.find((cabbages) => cabbages.id === id)
    },
    cabbages() {
      return cabbages
    },
  },
}

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  context: ({ req }) => {
    const authHeader = req.headers.authorization
    if (!authHeader) throw new Error('missing authorization header')
    const base64Token = authHeader.replace(/basic /i, '')
    const userPass = Buffer.from(base64Token, 'base64').toString()
    if (userPass !== 'ilike:cabbages') throw new Error('incorrect user/pass')
  },
})

const port = process.env.PORT || 4000

server.listen({ port }).then(({ url }) => {
  console.log(`Cabbages service ready at ${url}`)
})
