import { connect } from "amqplib";

const queueName = "task";
const msg = process.argv.slice(2).join(' ') || "hello world";
const RMQ_HOST = "amqp://localhost"

const sendMsg = async () => {
  const connection = await connect(RMQ_HOST) // tao connection
  const channel = await connection.createChannel(); // tao channel

  // dua channel vao queue co ten la queueName
  // neu chua co queueName thi tao queue
  // durable: true -> rabbitMq restart thi tao lai queue
  await channel.assertQueue(queueName, { durable: true })

  // send tu channel vao queue, phai send Buffer
  channel.sendToQueue(queueName, Buffer.from(msg), { persistent: true });
  console.log(`Sent: ${msg}`);

  // dang la direct exchange ->
  // send thang tu channel sang exchange voi routing key la "hello"
  // send toi "hello" queue

  // dong connection
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500)
}

sendMsg();