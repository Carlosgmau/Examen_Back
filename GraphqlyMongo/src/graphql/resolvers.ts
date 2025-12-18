import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { signToken } from "../auth";
import {
  createTrainer,
  findTrainerByName,
  findTrainerById,
  addPokemonToTrainer,
  removePokemonFromTrainer
} from "../collections/trainers";
import {
  createPokemon,
  listPokemons,
  findPokemonById
} from "../collections/pokemons";
import {
  createOwnedPokemon,
  findOwnedByTrainer,
  findOwnedById,
  deleteOwnedPokemon
} from "../collections/ownedPokemons";



export const resolvers = {
  Query: {
    me: async (_: any, __: any, ctx: any) => {
      if (!ctx.user) return null;
      const owned = await findOwnedByTrainer(ctx.user._id);
      return { name: ctx.user.name, pokemons: owned };
    },
    pokemons: (_: any, { page, size }: any) =>
      listPokemons(page, size),
    pokemon: (_: any, { id }: any) => findPokemonById(id)
  },

  Mutation: {
    startJourney: async (_: any, { name, password }: any) => {
      const trainer = await createTrainer(name, password);
      return signToken(trainer._id.toString());
    },

    login: async (_: any, { name, password }: any) => {
      const trainer = await findTrainerByName(name);
      if (!trainer) throw new Error("Invalid credentials");

      const ok = await bcrypt.compare(password, trainer.password);
      if (!ok) throw new Error("Invalid credentials");

      return signToken(trainer._id.toString());
    },

    createPokemon: (_: any, args: any, ctx: any) => {
      if (!ctx.user) throw new Error("Unauthorized");
      return createPokemon(args);
    },

    catchPokemon: async (_: any, { pokemonId }: any, ctx: any) => {
      if (!ctx.user) throw new Error("Unauthorized");

      if (ctx.user.team.length >= 6)
        throw new Error("Equipo lleno");

      const owned = await createOwnedPokemon(
        new ObjectId(pokemonId),
        ctx.user._id
      );

      await addPokemonToTrainer(ctx.user._id, owned._id);
      return owned;
    },

    freePokemon: async (_: any, { ownedPokemonId }: any, ctx: any) => {
      if (!ctx.user) throw new Error("Unauthorized");

      const owned = await findOwnedById(ownedPokemonId);
      if (!owned || !owned.trainer.equals(ctx.user._id))
        throw new Error("Not allowed");

      await deleteOwnedPokemon(owned._id);
      await removePokemonFromTrainer(ctx.user._id, owned._id);

      const pokemons = await findOwnedByTrainer(ctx.user._id);
      return { name: ctx.user.name, pokemons };
    }
  },

  OwnedPokemon: {
    pokemon: (parent: any) =>
      findPokemonById(parent.pokemon.toString())
  }
};


