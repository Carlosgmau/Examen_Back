import { ApolloServer } from "apollo-server";
import { connectToMongoDB } from "./db/mongo";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { getUserFromToken } from "./auth";

(async () => {
  await connectToMongoDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => ({
      user: await getUserFromToken(req.headers.authorization)
    })
  });

  await server.listen({ port: 4000 });
  console.log("Server ready at http://localhost:4000/graphql");
})();
