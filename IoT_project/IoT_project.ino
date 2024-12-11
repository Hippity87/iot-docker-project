#include "DHT.h"
#include <Servo.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <WiFiNINA.h>
#include <ArduinoJson.h>

// Määritelmät
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

Servo myServo;
#define SERVOPIN 3

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// WiFi-tunnukset
const char* ssid = "MindYourOwnBusiness-WiFi-2G";
const char* password = "";

// Palvelimen osoite ja portti
const char* host = "192.168.1.105";
const int port = 8080;

float minTemp = 0, maxTemp = 0;

void setup() {
  Serial.begin(115200);

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("SSD1306 allocation failed");
    for (;;);
  }
  delay(2000);
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0, 0);

  dht.begin();
  myServo.attach(SERVOPIN);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  Serial.print("Device IP: ");
  Serial.println(WiFi.localIP());
  Serial.print("Subnet Mask: ");
  Serial.println(WiFi.subnetMask());
  Serial.print("Gateway: ");
  Serial.println(WiFi.gatewayIP());

}

void sendSensorData(float temp_cel, float humidity) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    if (client.connect(host, port)) {
      String jsonPayload = "{\"temperature\":" + String(temp_cel) + ",\"humidity\":" + String(humidity) + "}";

      client.println("POST /api/data HTTP/1.1");
      client.println("Host: 192.168.1.105");
      client.println("Content-Type: application/json");
      client.print("Content-Length: ");
      client.println(jsonPayload.length());
      client.println();
      client.println(jsonPayload);

      while (client.available()) {
        String response = client.readStringUntil('\n');
        Serial.println(response);
      }
      client.stop();
    } else {
      Serial.println("Connection to server failed");
    }
  } else {
    Serial.println("WiFi not connected");
  }
}

void fetchSettings() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    Serial.println("Attempting to connect to server...");
    if (client.connect(host, port)) {
      Serial.println("Connection successful!");
      // Lähetä HTTP GET -pyyntö
      client.println("GET /api/settings HTTP/1.1");
      client.println("Host: 192.168.1.105");
      client.println("Connection: close");
      client.println(); // Tyhjä rivi vaaditaan HTTP-protokollassa

      Serial.println("Request sent. Awaiting response...");
      // Odota palvelimen vastausta
      while (client.connected() || client.available()) {
        if (client.available()) {
          String line = client.readStringUntil('\n');
          Serial.println("Response: " + line);
          if (line.startsWith("{")) { // JSON alkaa tästä
            StaticJsonDocument<200> doc;
            DeserializationError error = deserializeJson(doc, line);
            if (!error) {
              minTemp = doc["min"].as<float>();
              maxTemp = doc["max"].as<float>();
              Serial.print("Updated minTemp: ");
              Serial.println(minTemp);
              Serial.print("Updated maxTemp: ");
              Serial.println(maxTemp);
            } else {
              Serial.println("JSON parsing error");
            }
          }
        }
      }
      client.stop();
      Serial.println("Disconnected from server.");
    } else {
      Serial.println("Connection to server failed. Check server status or network.");
    }
  } else {
    Serial.println("WiFi not connected. Unable to fetch settings.");
  }
}


void loop() {
  delay(2000);
  float humidity = dht.readHumidity();
  float temp_cel = dht.readTemperature();

  display.clearDisplay();
  display.setCursor(0, 0);

  if (isnan(humidity) || isnan(temp_cel)) {
    display.println("Sensor read failed");
  } else {
    display.print("Humidity: ");
    display.print(humidity);
    display.println(" %");
    display.print("Temp: ");
    display.print(temp_cel);
    display.println(" C");

    if (temp_cel > maxTemp) {
      myServo.write(90);
      display.println("Too Hot");
    } else if (temp_cel < minTemp) {
      myServo.write(0);
      display.println("Too Cold");
    } else {
      myServo.write(0);
      display.println("Just Right");
    }

    sendSensorData(temp_cel, humidity);
  }

  display.display();

  static unsigned long lastFetch = 0;
  if (millis() - lastFetch > 60000) {
    fetchSettings();
    lastFetch = millis();
  }
  delay(10000);
}
