import redis from "async-redis";

class RedisClient {

  constructor() {
    this.instance = this.createInstance();
  }

  createInstance() {
    const client = redis.createClient(process.env.REDIS_URL);
    client.on("connect", () => {
      console.log("\n🎉 Redis client connected 🎉\n");
    });
    client.on("error", err => {
      console.error(`\n🚨 Redis client could not connect: ${err} 🚨\n`);
    });
    return client;
  }

  getInstance() {
    return this.instance;
  }
}

export default new RedisClient().getInstance();