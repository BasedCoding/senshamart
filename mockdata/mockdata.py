import time
import json
import random
from paho.mqtt import client as mqtt_client

broker = 'test.mosquitto.org'
port = 1883
topic = "out/wmsaOr0eXoc4jcgUx1ectq9ICjASf-dBw-qdYlrqs1k=/0"
client_id = f'sensor-simulator-{random.randint(0, 1000)}'

def connect_mqtt():
    def on_connect(client, userdata, flags, rc, properties=None):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)
    client = mqtt_client.Client(mqtt_client.CallbackAPIVersion.VERSION1, client_id)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client

def publish(client):
    msg_count = 1
    while True:
        time.sleep(2)
        data = {
            "Timestamp": str(int(time.time())),
            "SensorID": "test-sensor-001",
            "Measuring": "Temperature",
            "Value": f"{random.uniform(10, 30):.2f}",
            "Unit": "Celsius"
        }
        msg = json.dumps(data)
        result = client.publish(topic, msg)
        status = result[0]
        if status == 0:
            print(f"Sent `{msg}` to topic `{topic}`")
        else:
            print(f"Failed to send message to topic {topic}")
        msg_count += 1
        if msg_count > 100:
            break

def run():
    client = connect_mqtt()
    client.loop_start()
    publish(client)
    client.loop_stop()

if __name__ == '__main__':
    run()
