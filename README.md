# IoT Environmental Monitoring and Control System

This project integrates hardware (Arduino Nano 33 IoT), software (Node.js backend and dashboard), and infrastructure (Docker) to provide real-time environmental monitoring and control.

## Features

- **Arduino Nano 33 IoT**: Reads temperature and humidity data from a DHT11 sensor, displays data on an OLED screen, and sends it to the backend via WiFi. Adjusts a servo motor based on temperature thresholds.
- **Backend (Node.js + Express)**: Receives and stores sensor data, manages temperature settings, and provides a REST API for the Arduino and dashboard.
- **Dashboard (HTML, CSS, JavaScript)**: Visualizes sensor data and allows users to modify temperature settings.
- **Docker Infrastructure**: Encapsulates the backend and dashboard for easy deployment and scalability.

## Installation and Setup

1.   **Clone the repository**  
   ```sh
   git clone <repo-url>
   cd <repo-folder>

2.   **Start the services with Docker**
  docker-compose up -d

3.   **Connect the Arduino**
        Install required libraries (DHT11, OLED, WiFiNINA).
        Configure WiFi credentials and backend URL in the Arduino code.
        Upload the code to the Arduino.

4.   **Access the dashboard**
        Open a browser and navigate to http://localhost (or your server’s IP address).

Future Improvements

    HTTPS encryption and Nginx-based reverse proxy.
    Persistent data storage in a database.
    Real-time graphical data visualization.

License

This project is licensed under the MIT License.

It also uses third-party dependencies that retain their respective licenses:

    Arduino libraries (MIT/LGPL)
    Node.js and Express (MIT)
    Docker (Apache 2.0)

See the LICENSE file for more details.
