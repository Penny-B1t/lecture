const MysqlRepository = require("../../main/repository/MySQLrepository");

test('always true', () => {
    expect(1).toBe(1);
});

describe(`repository Test`, () => {
    it('should initialize the connection pool successfully', () => {
        const mysqlRepository = new MysqlRepository();
        expect(mysqlRepository).toBeInstanceOf(MysqlRepository);
        expect(mysqlRepository['pool']).toBeDefined();
    });

    it('should handle error when executing a query with invalid SQL syntax', async () => {
        const mysqlRepository = new MysqlRepository();
        const invalidQuery = "SELECT * FORM non_existing_table";
        const result = await mysqlRepository.executeQuery(invalidQuery);
        expect(result).toBeUndefined();
    });
})

describe(`lectureController test`, () => {

    it(``, ()=>{
        expect(1).toBe(1);
    })
})