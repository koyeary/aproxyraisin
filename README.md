# AProxyRaisin

AProxyRaisin is a simple proxy server designed to crawl and parse text from websites. It acts as an intermediary, fetching web content and extracting meaningful text data for further processing.

## Features

- Proxy server functionality to fetch web pages.
- Crawls and parses text content from websites.
- Lightweight and easy to set up.

## Requirements

- Node.js 14 or higher
- `axios` library
- `cheerio` library

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/koyeary/aproxyraisin.git
   cd aproxyraisin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the proxy server:

   ```bash
   node server.js
   ```

2. Use the server to fetch and parse text from a website by sending a request to the server's endpoint.

## Example

Send a request to the proxy server with the target URL:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"url": "https://example.com"}' http://localhost:5000/crawl
```

The server will return the parsed text content from the specified website.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
