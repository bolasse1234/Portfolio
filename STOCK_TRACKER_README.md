# Stock Tracker Pro 📈

A beautiful, dark-themed stock portfolio tracker with real-time price updates and comprehensive portfolio analytics. Built with vanilla JavaScript, featuring a world-class UI design with glassmorphism effects, smooth animations, and responsive layout.

![Stock Tracker Pro](https://img.shields.io/badge/Status-Live-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

## Features ✨

### Core Functionality
- **Real-time Stock Tracking**: Get live price updates using free stock APIs
- **Portfolio Management**: Add, track, and remove stocks from your portfolio
- **Profit/Loss Analytics**: Automatic calculation of gains, losses, and performance metrics
- **JSON Import/Export**: Backup and restore your portfolio data
- **Local Storage**: Your portfolio persists across sessions
- **Auto-refresh**: Prices update automatically every 60 seconds

### Design Highlights
- 🎨 **World-class Dark Theme**: Premium glassmorphism design with gradient accents
- ✨ **Smooth Animations**: Micro-interactions and transitions throughout
- 📱 **Fully Responsive**: Works beautifully on all devices
- 🎯 **Intuitive UX**: Clean, easy-to-use interface
- 🌈 **Dynamic Color Coding**: Instant visual feedback for gains and losses

## Demo 🚀

[View Live Demo](https://your-username.github.io/Portfolio/stock-tracker.html)

## Screenshots 📸

### Dashboard Overview
Beautiful summary cards showing total portfolio value, gains/losses, and holdings count.

### Stock Cards
Each stock displays:
- Current price and price change
- Entry price and quantity
- Total gain/loss in dollars and percentage
- Quick delete action

## Usage 🎯

### Adding Stocks

1. **Manual Entry**:
   - Enter stock symbol (e.g., AAPL, GOOGL, TSLA)
   - Enter your entry price
   - Enter quantity of shares
   - Click "Add to Portfolio"

2. **JSON Import**:
   - Click "Import JSON"
   - Paste your JSON data in the format below
   - Click "Import"

### JSON Format

```json
[
  {
    "symbol": "AAPL",
    "entryPrice": 150.00,
    "quantity": 10
  },
  {
    "symbol": "GOOGL",
    "entryPrice": 2800.00,
    "quantity": 5
  }
]
```

### Exporting Portfolio

Click "Export JSON" to download your portfolio data as a JSON file. This is useful for:
- Backing up your portfolio
- Sharing with others
- Migrating between devices

### Refreshing Prices

- Click the refresh button to manually update all stock prices
- Prices automatically update every 60 seconds
- Internet connection required for updates

## API Information 🔌

This application uses **free stock APIs** to fetch real-time prices:

### Primary: Yahoo Finance API
- **No API key required**
- **Free unlimited requests**
- **Real-time quotes**
- Most reliable for US stocks

### Fallback: Finnhub API
- **Free tier**: 60 API calls/minute
- **No credit card required**
- Get your free API key at [finnhub.io](https://finnhub.io)

To use your own Finnhub API key:
1. Sign up at [finnhub.io](https://finnhub.io)
2. Get your free API key
3. Open `stock-tracker.js`
4. Replace `this.API_KEY = 'demo'` with your key

## Installation 💻

### Option 1: Direct Use
Simply open `stock-tracker.html` in any modern web browser.

### Option 2: Local Server
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Then open http://localhost:8000/stock-tracker.html
```

### Option 3: Host on GitHub Pages
1. Push files to a GitHub repository
2. Go to Settings → Pages
3. Select your branch and save
4. Your site will be live at `https://username.github.io/repo-name/stock-tracker.html`

## Free Hosting Options 🌐

Deploy your stock tracker for free on:

### GitHub Pages (Recommended)
- **Free**: Unlimited bandwidth
- **Custom domain**: Supported
- **SSL**: Automatic
- [Setup Guide](https://pages.github.com/)

### Netlify
- **Free**: 100GB bandwidth/month
- **Continuous deployment**: From Git
- **Custom domain**: Free SSL
- [Deploy to Netlify](https://www.netlify.com/)

### Vercel
- **Free**: Unlimited bandwidth
- **Edge network**: Ultra-fast
- **Custom domain**: Free SSL
- [Deploy to Vercel](https://vercel.com/)

### Cloudflare Pages
- **Free**: Unlimited bandwidth
- **Global CDN**: Lightning fast
- **Custom domain**: Free SSL
- [Deploy to Cloudflare](https://pages.cloudflare.com/)

## Browser Compatibility 🌍

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+
- ⚠️ IE11 not supported (uses ES6+ features)

## Technologies Used 🛠️

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, animations, glassmorphism
- **JavaScript ES6+**: Classes, async/await, fetch API
- **LocalStorage API**: Data persistence
- **Yahoo Finance API**: Stock price data
- **Finnhub API**: Alternative stock data source

## Features Breakdown 📋

### Portfolio Summary
- Total portfolio value
- Total gain/loss ($ and %)
- Number of holdings
- Real-time updates

### Stock Cards
- Stock symbol and company identifier
- Entry price and quantity
- Current price with change indicator
- Profit/loss calculation
- Delete functionality

### Import/Export
- JSON-based backup system
- Merge imported stocks with existing portfolio
- Download portfolio as JSON file
- Date-stamped exports

### UI/UX Features
- Toast notifications for user feedback
- Loading indicators
- Responsive modal dialogs
- Smooth transitions and animations
- Color-coded performance indicators
- Empty state messaging

## Tips 💡

1. **Use Standard Symbols**: Use official ticker symbols (AAPL, not Apple)
2. **Regular Updates**: Click refresh to get latest prices
3. **Backup Regularly**: Export your portfolio JSON periodically
4. **Price Delays**: Free APIs may have 15-minute delays
5. **Test with Demo**: Try sample stocks first

## Add Sample Data 🧪

Open browser console and run:
```javascript
addSampleData()
```

This adds 5 sample stocks for testing purposes.

## Customization 🎨

### Change Color Scheme
Edit CSS variables in `stock-tracker.css`:
```css
:root {
    --accent-blue: #667eea;
    --accent-purple: #764ba2;
    --accent-green: #10b981;
    /* Modify these for different colors */
}
```

### Modify API
Change API endpoints in `stock-tracker.js`:
```javascript
this.API_BASE = 'your-api-endpoint';
```

## Troubleshooting 🔧

### Prices Not Updating
- Check internet connection
- Verify stock symbols are correct
- Try refreshing the page
- Check browser console for errors

### Import Not Working
- Ensure JSON is valid
- Check JSON format matches the example
- All required fields must be present

### Performance Issues
- Clear browser cache
- Remove old stocks
- Update your browser

## Future Enhancements 🚀

Potential features for future versions:
- Multiple portfolio support
- Historical price charts
- Dividend tracking
- Watchlist functionality
- Email/SMS alerts
- Portfolio comparison
- Dark/light theme toggle
- Currency conversion
- Crypto support

## License 📄

MIT License - feel free to use this project for personal or commercial purposes.

## Credits 👏

- Design inspired by leading fintech apps
- Icons: Custom SVG designs
- Fonts: Inter by Rasmus Andersson
- APIs: Yahoo Finance, Finnhub

## Support 💬

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [Your Email]
- Twitter: [Your Handle]

## Changelog 📝

### Version 1.0.0 (2025-11-01)
- Initial release
- Dark theme UI
- Real-time stock tracking
- JSON import/export
- Portfolio analytics
- Auto-refresh functionality
- LocalStorage persistence

---

Made with ❤️ by Bo Lasse (Venom)

**Happy Trading! 📊**
