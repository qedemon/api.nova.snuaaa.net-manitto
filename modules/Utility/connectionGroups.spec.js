const getConnectionGroups = require("./connectionGroups");

test("connectionGroups", ()=>{
    const connections = [
        { follower_id: 3140, followee_id: 2377 },
        { follower_id: 3949, followee_id: 2446 },
        { follower_id: 4750, followee_id: 3222 },
        { follower_id: 1267, followee_id: 2752 },
        { follower_id: 3222, followee_id: 4434 },
        { follower_id: 2377, followee_id: 4750 },
        { follower_id: 4107, followee_id: 3140 },
        { follower_id: 3615, followee_id: 3949 },
        { follower_id: 2752, followee_id: 3615 },
        { follower_id: 2446, followee_id: 4107 }
      ];
    console.log(getConnectionGroups(connections));
})