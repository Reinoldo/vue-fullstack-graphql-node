const { ApolloServer } = require("apollo-server");
console.log(ApolloServer);
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
        deleteItem(item: ItemInput): Item!
    }
    

`;

const items = [
    { id: 1, type: "prefix", description: "reinoldo" },
    { id: 2, type: "sufix", description: "oliveira" },
    { id: 3, type: "sufix", description: "teste" },
    { id: 4, type: "prefix", description: "rei" }

]
const resolvers = {
    Query: {
        items(_, args) {
            console.log(args);

            return items.filter(item => item.type == args.type);
        }

    },
    Mutation: {
        saveItem(_, args) {
            const item = args.item;
            item.id = Math.floor(Math.random() * 1000);
            this.items.push(item);
            return item;
        },
        deleteItem(_, args) {
            const item = args.item;
            this.items.splice(args.item.id, 1);
            return item;
        }

    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen();