import { connect } from "amqplib";
import gTTS from "gtts";

const queueName = "task"

const consume = async (comsumer) => {
  const connection = await connect("amqp://localhost") // tao connection
  const channel = await connection.createChannel(); // tao channel

  // neu ma consumer chay truoc publisher thi phai tao queue truoc
  await channel.assertQueue(queueName, { durable: true })

  // truoc khi consume thi prefetch truoc 1 task
  // khong dispatch 1 task den 1 consumer tru khi 1 task truoc da xu ly xong va gui ack lai
  channel.prefetch(1);

  console.log(`Waiting for msg from queue ${queueName}`);

  // nhan message tu queueName, callback truyen tham so dau tien la msg
  // noAck: true -> se biet duoc msg da nhan duoc hay chua
  // nhan duoc -> xoa task khoi queue
  // noAck: false -> k tu xoa msg khoi queue
  channel.consume(queueName, (msg) => {
    // const secs = msg.content.toString().split('.').length - 1;

    console.log(`[x] ${comsumer} Received: ${msg.content.toString()} \n`)

    processTask(msg, comsumer);

    channel.ack(msg)

  }, { noAck: false })
}

consume("consumer1");
consume("consumer2")
consume("consumer3")

function processTask(msg, comsumer) {
  const gtts = new gTTS(msg.content.toString(), 'en');
  gtts.save(`output/${comsumer}_${Date.now()}.mp3`, function (err, result) {
    if (err) { throw new Error(err); }
    console.log(`${comsumer}: finished`);
  });
}
