pragma solidity >=0.4.22 <0.9.0;

contract CrudContract {
    struct User{
        uint uid;
        string name;
    }
    uint nextId =1;

    User[] public users;

    function create(string memory _name) public {
        users.push(User(nextId, _name));
        nextId++;
    }

    function read(uint id) view public returns(uint, string memory){
        uint position = getUser(id);
        return (users[position].uid, users[position].name);
    }

    function update(uint id, string memory _name) public {
        uint position = getUser(id);
        users[position].name = _name;
    }

    function destroy(uint id) public {
        uint position = getUser(id);
        delete users[position];
    }



    function getUser(uint id) view internal returns(uint) { // returns position 
        for (uint i=0; i<users.length; i++) {
            if(users[i].uid == id) {
                return i;
            }
        }

        revert("User can not be found!");
    }
}