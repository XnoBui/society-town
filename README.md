# AI Twin Generator

A modern web application for generating and customizing AI Twins with an interactive 3D reveal experience.

## Features

- Interactive 3D Genesis Printer visualization
- Real-time gene selection and probability calculation
- Dynamic character type generation
- Responsive design with mobile support
- WebSocket-based live updates
- Modern UI with Apple-inspired design

## Tech Stack

- **Frontend:**
  - HTML5, CSS3, JavaScript
  - Three.js for 3D visualization
  - Particles.js for particle effects
  - Chart.js for probability visualization

- **Backend:**
  - FastAPI (Python)
  - WebSocket for real-time updates
  - PIL for image processing

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-twin-generator.git
   cd ai-twin-generator
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the server:
   ```bash
   python server.py
   ```

4. Open your browser and visit:
   ```
   http://localhost:8081
   ```

## Project Structure

```
.
├── server.py              # FastAPI server
├── static/
│   ├── css/
│   │   ├── styles.css    # Main styles
│   │   └── hero.css      # Hero section styles
│   ├── js/
│   │   ├── main.js       # Main JavaScript
│   │   ├── hero.js       # Hero section functionality
│   │   ├── three-setup.js # 3D setup
│   │   └── probability.js # Probability calculations
│   └── images/           # Static images
└── requirements.txt      # Python dependencies
```

## API Documentation

API documentation is available at:
```
http://localhost:8081/docs
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 