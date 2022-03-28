const CrudContract = artifacts.require("CrudContract");

contract("CrudContract", () => {
    let crudContract = null;
    before(async () => { // initialize the pointer to the deployed contract.
        crudContract = await CrudContract.deployed();
    })
    it('Should create a new user', async () => {
        await crudContract.create('Abdessamed');
        const user = await crudContract.read(1);
        assert(user[0].toNumber() === 1);
        assert(user[1] === 'Abdessamed');
    });
    it('Should update an existing user!', async () => {
        await crudContract.update(1, "Abdessamed_update");
        const user =  await crudContract.read(1);
        assert(user[0].toNumber() === 1);
        assert(user[1] === "Abdessamed_update");
    });

    it('Should not update non existing user!', async () => {
        try { 
            await crudContract.update(2, 'Non existing user!');
        } catch(error) {
            assert(error.message.includes('User can not be found!'))
            return;
        }   
        assert(false); // detecting if no error message is given.

    });

    it('Should delete an existing user!', async () => {
        await crudContract.destroy(1);
        try {
            await crudContract.read(1);
        } catch(error) {
            assert(error.message.includes("User can not be found!"));
            return;
        }
        assert(false);
    });
    
    it('Should not delete non existing user!', async () => {
        try {
            await crudContract.destroy(2);
        }catch(error) {
            assert(error.message.includes('User can not be found!'));
            return;
        }
        assert(false);
        
    })
})