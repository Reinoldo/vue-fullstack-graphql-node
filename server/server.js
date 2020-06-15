const { ApolloServer } = require("apollo-server");
const dns = require("dns");

const typeDefs = `
    type Item {
        id: Int
        type: String
        description: String
    }

    type Domain{
        name: String
        checkout: String
        available: Boolean
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
        generateDomains: [Domain]
        deleteItem(id: Int): Boolean
    }
    

`;

const items = [
    { id: 1, type: "prefix", description: "reinoldo" },
    { id: 2, type: "suffix", description: "oliveira" },
    { id: 3, type: "suffix", description: "teste" },
    { id: 4, type: "prefix", description: "rei" }

]

const isDomainAvailable = function (url) {
    return new Promise(function (resolve, reject) {

        dns.resolve(url, function (error) {
            if (error) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    })
};
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
        },
        async generateDomains() {
            const domains = [];
            for (const prefix of items.filter(item => item.type === "prefix")) {
                for (const suffix of items.filter(item => item.type === "suffix")) {
                    const name = prefix.description + suffix.description;
                    const url = name.toLowerCase();
                    const checkout = `https://checkout.hostgator.com.br/?a=add&sld=${url}&tld=.com`;
                    const available = await isDomainAvailable(`${url}.com.br`);
                    domains.push({ name, checkout, available });
                }
            }
            return domains;
        }

    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen();

