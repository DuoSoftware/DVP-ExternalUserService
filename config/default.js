module.exports = {
  Redis: {
    mode: "instance", //instance, cluster, sentinel
    ip: "REDIS_URL",
    port: 6379,
    user: "USER",
    password: "PASSWORD",
    sentinels: {
      hosts: "SENTNELS_URL",
      port: 16389,
      name: "redis-cluster"
    }
  },
  Security: {
    mode: "instance", //instance, cluster, sentinel
    ip: "REDIS_URL",
    port: 6379,
    user: "USER",
    password: "PASSWORD",
    sentinels: {
      hosts: "SENTNELS_URL",
      port: 16389,
      name: "redis-cluster"
    }
  },
  Host: {
    profilesearch: "secondary",
    vdomain: "localhost",
    domain: "localhost",
    port: "3638",
    version: "1.0.0.0"
  },
  RabbitMQ: {
    ip: "URL",
    port: 5672,
    user: "USER",
    password: "PASSWORD",
    vhost: "/"
  },
  Mongo: {
    ip: "URL",
    port: "27017",
    dbname: "USER",
    password: "PASSWORD",
    user: "USER",
    replicaset: ""
  },
  LBServer: {
    ip: "LB_FRONTEND",
    port: "LB_PORT"
  }
};
