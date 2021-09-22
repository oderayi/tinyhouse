require("dotenv").config();

import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import {
    ApolloServerPluginLandingPageDisabled,
    ApolloServerPluginLandingPageGraphQLPlayground,
  } from "apollo-server-core";
import { typeDefs, resolvers } from "./graphql";
import { connectDatabase } from './database';


const mount = async (app: Application) => {
    const db = await connectDatabase();
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: () => ({ db }),
        plugins: [
          process.env.NODE_ENV === "production"
            ? ApolloServerPluginLandingPageDisabled()
            : ApolloServerPluginLandingPageGraphQLPlayground(),
        ],
      });
      server.start().then(() => {
        server.applyMiddleware({ app, path: "/api" });
        console.log(`[app]: http://localhost:${process.env.PORT}`);
      });
      
      app.get("/", (_req, res) => res.send("Hello World!"));
      
      app.listen(process.env.PORT);
}

mount(express());
