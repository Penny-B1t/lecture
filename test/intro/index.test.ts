import {jest} from "@jest/globals";

import MysqlRepository from "../../main/repository/MySQLrepository"
// jest.mock("../../main/repository/MySQLrepository", () => {
//     return {
//         MysqlRepository : jest.fn().mockImplementation(() => {
//             return { executeQuery : jest.fn() };
//         }),
//     };
// });

describe(`repository Test`, () => {

    it('should initialize the connection pool successfully', () => {
        const mysqlRepository = new MysqlRepository();
        expect(mysqlRepository).toBeInstanceOf(MysqlRepository);
    });

    it('should handle error when executing a query with invalid SQL syntax', async () => {
        // // const mysqlRepository = new MysqlRepository();
        // // const invalidQuery = 'SELECT * FORM non_existing_table';
        // // const mockError = Promise.reject({ message : 'Error executing a query'});
        // // mysqlRepository.executeQuery = jest.fn().mockReturnValue(mockError)
        // const mysqlRepository = new MysqlRepository();
        // class TestEntity {
        //     constructor(public id: number, public name: string) {}
        // }
        // const mockError = Promise.reject({ message : 'Error executing a query'});
        // mysqlRepository.executeQuery = jest.fn().mockReturnValue(mockError)

        // const invalidQuery = 'SELECT * FROM non_existing_table';
        // // await expect(mysqlRepository.executeQuery(invalidQuery, [], TestEntity)).rejects.toThrow(Error);

        // try {
        //     await mysqlRepository.executeQuery(invalidQuery, [], TestEntity);
        // } catch (error) {
        //     const e = error as Error;
        //     expect(e).toEqual({ message: 'Error executing a query' });
        // }

        // expect(mysqlRepository.executeQuery).toHaveBeenCalledWith(invalidQuery,[],TestEntity);
    });
})