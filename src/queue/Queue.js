const Bull = require("bull")

class Queue {

    constructor(queueName) {
        this._queue = new Bull(queueName, process.env.REDIS_URL);
    }

    publish(data) {
        return this._queue.add(data, { attempts: 2 })
    }

    consumer(consumerFunction, concurrency = 1) {
        this._queue.process(concurrency, consumerFunction);
    }
}

module.exports = Queue;