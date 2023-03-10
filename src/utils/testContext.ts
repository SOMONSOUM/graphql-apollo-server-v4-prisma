import { ApolloServer, BaseContext } from '@apollo/server'
import { schema } from '~/schema';


export const testServer = async () => {
    const server = new ApolloServer({
        schema: schema
    });

    const query = async<T extends BaseContext>(query: string, variables?: any, contextValue?: T) => {
        return {} = server.executeOperation({ query: `query ${query}`, variables }, { contextValue })
    }

    const mutate = async<T extends BaseContext> (mutation: string, variables?: any, contextValue?: T) => {
        return server.executeOperation({ query: `mutation ${mutation}`, variables, }, { contextValue })
    }

    return { query, mutate };
}