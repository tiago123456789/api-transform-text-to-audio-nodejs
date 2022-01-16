require("dotenv").config();

const Constants = require("../constants/App")
const Queue = require("../queue/Queue");
const transformTextToAudio = require("./TransformTextToAudio");
const audioQueue = new Queue(Constants.QUEUE.AUDIO);

audioQueue.consumer(transformTextToAudio)