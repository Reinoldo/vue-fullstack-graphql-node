const { ApolloServer } = require("apollo-server");

const typeDefs = `
    type Item {
        id: Int
        type: String
        description: String
    }

    type Query{
        items (type: String): [Item]
    }

    input ItemInput{
        type: String
        description: String
    }

    type Mutation{
        saveItem(item: ItemInput): Item
        updateItem(id: Int!, type: String, description: String): Item
        deleteItem(id: Int): Boolean
    }
    

`;

const items = [
    { id: 1, type: "prefix", description: "reinoldo" },
    { id: 2, type: "suffix", description: "oliveira" },
    { id: 3, type: "suffix", description: "teste" },
    { id: 4, type: "prefix", description: "rei" }

]
const resolvers = {
    Query: {
        items(_, args) {
            return items.filter(item => item.type == args.type);
        }

    },
    Mutation: {
        saveItem(_, args) {
            const item = args.item;
            item.id = Math.floor(Math.random() * 1000);
            items.push(item);
            return item;
        },
        deleteItem(_, args) {
            const id = args.id;
            const item = items.find(item => item.id === id);
            if (!item) return false;
            items.splice(items.indexOf(item), 1);
            return true;
        }

    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen();

