import redis from "async-redis";

const RedisHelper = (function() {
  let instance;

  function createInstance() {
    const client = redis.createClient(process.env.REDIS_URL);
    client.on("connect", () => {
      console.log("\n🎉 Redis client connected 🎉\n");
    });
    client.on("error", err => {
      console.error(`\n🚨 Redis client could not connect: ${err} 🚨\n`);
    });
    return client;
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

export default RedisHelper;
