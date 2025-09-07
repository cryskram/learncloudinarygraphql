import { prisma } from "@/lib/prisma";
import { createSchema, createYoga } from "@graphql-yoga/node";
import gql from "graphql-tag";
import { NextRequest } from "next/server";

const schema = createSchema<{ request: NextRequest }>({
  typeDefs: gql`
        type Post {
            id: ID!
            title: String!
            content: String!
            imageUrl String
            createdAt: String!
        }

        type Query {
            posts: [Post!]!
        }

        type Mutation {
            createPost(title: String!, content: String!, imageUrl: String): Post!
        }
    `,
  resolvers: {
    Query: {
      posts: () => prisma.post.findMany({ orderBy: { createdAt: "desc" } }),
    },
    Mutation: {
      createPost: async (
        _: unknown,
        {
          title,
          content,
          imageUrl,
        }: { title: string; content: string; imageUrl: string }
      ) =>
        prisma.post.create({
          data: { title, content, imageUrl, authorId: "xyz" }, // id will be added when auth is built?
        }),
    },
  },
});

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Request, Response, Headers },
  graphiql: process.env.NODE_ENV === "development",
});

export async function GET(request: Request) {
  return yoga.fetch(request);
}

export async function POST(request: Request) {
  return yoga.fetch(request);
}
