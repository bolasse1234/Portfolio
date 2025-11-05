// Stock Tracker Pro - Main Application Logic

class StockTracker {
    constructor() {
        this.stocks = this.loadFromStorage() || [];
        this.API_KEY = 'demo'; // Users can get free key from finnhub.io
        this.API_BASE = 'https://finnhub.io/api/v1';
        this.FALLBACK_API = 'https://query1.finance.yahoo.com/v8/finance/chart/';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderStocks();
        this.updateSummary();
        // Auto-refresh every 60 seconds
        setInterval(() => this.refreshAllPrices(), 60000);
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('addStockForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addStock();
        });

        // Import/Export buttons
        document.getElementById('importJsonBtn').addEventListener('click', () => {
            this.openImportModal();
        });

        document.getElementById('exportJsonBtn').addEventListener('click', () => {
            this.exportToJson();
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshAllPrices();
        });

        // Modal controls
        document.getElementById('closeImportModal').addEventListener('click', () => {
            this.closeImportModal();
        });

        document.getElementById('cancelImport').addEventListener('click', () => {
            this.closeImportModal();
        });

        document.getElementById('confirmImport').addEventListener('click', () => {
            this.importFromJson();
        });

        // Close modal on outside click
        document.getElementById('importModal').addEventListener('click', (e) => {
            if (e.target.id === 'importModal') {
                this.closeImportModal();
            }
        });
    }

    async addStock() {
        const symbol = document.getElementById('stockSymbol').value.toUpperCase().trim();
        const entryPrice = parseFloat(document.getElementById('entryPrice').value);
        const quantity = parseFloat(document.getElementById('quantity').value);

        if (!symbol || !entryPrice || !quantity) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        // Check if stock already exists
        const existingStock = this.stocks.find(s => s.symbol === symbol);
        if (existingStock) {
            this.showToast('Stock already exists in portfolio', 'error');
            return;
        }

        const stockData = {
            symbol,
            entryPrice,
            quantity,
            currentPrice: entryPrice, // Will be updated
            addedAt: new Date().toISOString()
        };

        this.stocks.push(stockData);
        this.saveToStorage();

        // Clear form
        document.getElementById('addStockForm').reset();

        // Fetch current price
        await this.updateStockPrice(stockData);

        this.renderStocks();
        this.updateSummary();
        this.showToast(`${symbol} added to portfolio`, 'success');
    }

    deleteStock(symbol) {
        this.stocks = this.stocks.filter(s => s.symbol !== symbol);
        this.saveToStorage();
        this.renderStocks();
        this.updateSummary();
        this.showToast(`${symbol} removed from portfolio`, 'success');
    }

    async updateStockPrice(stock) {
        try {
            // Try Yahoo Finance API first (more reliable and no key needed)
            const price = await this.fetchPriceYahoo(stock.symbol);
            if (price) {
                stock.currentPrice = price;
                this.saveToStorage();
                return true;
            }

            // Fallback to Finnhub
            const finnhubPrice = await this.fetchPriceFinnhub(stock.symbol);
            if (finnhubPrice) {
                stock.currentPrice = finnhubPrice;
                this.saveToStorage();
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error fetching price for', stock.symbol, error);
            return false;
        }
    }

    async fetchPriceYahoo(symbol) {
        try {
            const response = await fetch(`${this.FALLBACK_API}${symbol}?interval=1d&range=1d`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            });

            if (!response.ok) throw new Error('Yahoo API failed');

            const data = await response.json();
            const quote = data.chart.result[0].meta;
            return quote.regularMarketPrice || quote.previousClose;
        } catch (error) {
            console.error('Yahoo API error:', error);
            return null;
        }
    }

    async fetchPriceFinnhub(symbol) {
        try {
            const response = await fetch(
                `${this.API_BASE}/quote?symbol=${symbol}&token=${this.API_KEY}`
            );

            if (!response.ok) throw new Error('Finnhub API failed');

            const data = await response.json();
            return data.c; // Current price
        } catch (error) {
            console.error('Finnhub API error:', error);
            return null;
        }
    }

    async refreshAllPrices() {
        const refreshBtn = document.getElementById('refreshBtn');
        const originalContent = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<div class="loading"></div>';
        refreshBtn.disabled = true;

        let successCount = 0;
        for (const stock of this.stocks) {
            const success = await this.updateStockPrice(stock);
            if (success) successCount++;

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        this.renderStocks();
        this.updateSummary();

        refreshBtn.innerHTML = originalContent;
        refreshBtn.disabled = false;

        if (successCount > 0) {
            this.showToast(`Updated ${successCount} of ${this.stocks.length} stocks`, 'success');
        } else if (this.stocks.length > 0) {
            this.showToast('Unable to update prices. Please try again later.', 'error');
        }
    }

    renderStocks() {
        const container = document.getElementById('stocksList');

        if (this.stocks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <h4>No stocks added yet</h4>
                    <p>Add your first stock to start tracking your portfolio</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.stocks.map(stock => this.renderStockCard(stock)).join('');

        // Attach delete handlers
        this.stocks.forEach(stock => {
            const deleteBtn = document.getElementById(`delete-${stock.symbol}`);
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.deleteStock(stock.symbol));
            }
        });
    }

    renderStockCard(stock) {
        const totalValue = stock.currentPrice * stock.quantity;
        const totalCost = stock.entryPrice * stock.quantity;
        const gainLoss = totalValue - totalCost;
        const gainLossPercent = ((gainLoss / totalCost) * 100).toFixed(2);
        const priceChange = stock.currentPrice - stock.entryPrice;
        const priceChangePercent = ((priceChange / stock.entryPrice) * 100).toFixed(2);

        const isPositive = gainLoss >= 0;
        const statusClass = isPositive ? 'positive' : 'negative';
        const symbol = isPositive ? '↑' : '↓';

        return `
            <div class="stock-card">
                <div class="stock-symbol-box">${stock.symbol.slice(0, 3)}</div>
                <div class="stock-info">
                    <div class="stock-symbol">${stock.symbol}</div>
                    <div class="stock-details">
                        ${stock.quantity} shares @ $${stock.entryPrice.toFixed(2)}
                    </div>
                </div>
                <div class="stock-price-info">
                    <div class="current-price">$${stock.currentPrice.toFixed(2)}</div>
                    <div class="price-change ${statusClass}">
                        ${symbol} $${Math.abs(priceChange).toFixed(2)} (${priceChangePercent}%)
                    </div>
                </div>
                <div class="stock-performance">
                    <div class="performance-value ${statusClass}">
                        ${isPositive ? '+' : ''}$${gainLoss.toFixed(2)}
                    </div>
                    <div class="performance-percent ${statusClass}">
                        ${isPositive ? '+' : ''}${gainLossPercent}%
                    </div>
                </div>
                <div class="stock-actions">
                    <button class="btn-delete" id="delete-${stock.symbol}" title="Remove from portfolio">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }

    updateSummary() {
        let totalValue = 0;
        let totalCost = 0;

        this.stocks.forEach(stock => {
            totalValue += stock.currentPrice * stock.quantity;
            totalCost += stock.entryPrice * stock.quantity;
        });

        const totalGainLoss = totalValue - totalCost;
        const totalGainLossPercent = totalCost > 0 ? ((totalGainLoss / totalCost) * 100).toFixed(2) : 0;

        document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
        document.getElementById('totalHoldings').textContent = this.stocks.length;

        const gainLossEl = document.getElementById('totalGainLoss');
        const gainLossPercentEl = document.getElementById('totalGainLossPercent');

        gainLossEl.textContent = `${totalGainLoss >= 0 ? '+' : ''}$${totalGainLoss.toFixed(2)}`;
        gainLossPercentEl.textContent = `${totalGainLoss >= 0 ? '+' : ''}${totalGainLossPercent}%`;

        const statusClass = totalGainLoss >= 0 ? 'positive' : 'negative';
        gainLossEl.className = `card-value ${statusClass}`;
        gainLossPercentEl.className = `card-change ${statusClass}`;

        // Update total change display
        const totalChangeEl = document.getElementById('totalChange');
        totalChangeEl.textContent = `${totalGainLoss >= 0 ? '+' : ''}$${totalGainLoss.toFixed(2)} (${totalGainLossPercent}%)`;
        totalChangeEl.className = `card-change ${statusClass}`;
    }

    openImportModal() {
        document.getElementById('importModal').classList.add('active');
    }

    closeImportModal() {
        document.getElementById('importModal').classList.remove('active');
        document.getElementById('jsonInput').value = '';
    }

    exportToJson() {
        const dataStr = JSON.stringify(this.stocks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `stock-portfolio-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        this.showToast('Portfolio exported successfully', 'success');
    }

    async importFromJson() {
        const jsonInput = document.getElementById('jsonInput').value.trim();

        if (!jsonInput) {
            this.showToast('Please paste JSON data', 'error');
            return;
        }

        try {
            const importedStocks = JSON.parse(jsonInput);

            if (!Array.isArray(importedStocks)) {
                throw new Error('Invalid format: expected an array');
            }

            // Validate each stock
            for (const stock of importedStocks) {
                if (!stock.symbol || !stock.entryPrice || !stock.quantity) {
                    throw new Error('Invalid stock data: missing required fields');
                }
            }

            // Merge with existing stocks (avoid duplicates)
            const existingSymbols = new Set(this.stocks.map(s => s.symbol));
            const newStocks = importedStocks.filter(s => !existingSymbols.has(s.symbol));

            if (newStocks.length === 0) {
                this.showToast('All stocks already exist in portfolio', 'error');
                return;
            }

            // Add current price and timestamp to new stocks
            newStocks.forEach(stock => {
                stock.currentPrice = stock.currentPrice || stock.entryPrice;
                stock.addedAt = stock.addedAt || new Date().toISOString();
            });

            this.stocks.push(...newStocks);
            this.saveToStorage();

            // Refresh prices for new stocks
            for (const stock of newStocks) {
                await this.updateStockPrice(stock);
            }

            this.renderStocks();
            this.updateSummary();
            this.closeImportModal();
            this.showToast(`Imported ${newStocks.length} stocks successfully`, 'success');
        } catch (error) {
            this.showToast(`Import failed: ${error.message}`, 'error');
        }
    }

    saveToStorage() {
        localStorage.setItem('stockPortfolio', JSON.stringify(this.stocks));
    }

    loadFromStorage() {
        const data = localStorage.getItem('stockPortfolio');
        return data ? JSON.parse(data) : null;
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('active');

        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new StockTracker();
});

// Add sample data helper (for demo purposes)
window.addSampleData = function() {
    const sampleStocks = [
        { symbol: 'AAPL', entryPrice: 150.00, quantity: 10 },
        { symbol: 'GOOGL', entryPrice: 2800.00, quantity: 5 },
        { symbol: 'MSFT', entryPrice: 300.00, quantity: 8 },
        { symbol: 'TSLA', entryPrice: 700.00, quantity: 3 },
        { symbol: 'AMZN', entryPrice: 3300.00, quantity: 2 }
    ];

    localStorage.setItem('stockPortfolio', JSON.stringify(sampleStocks.map(s => ({
        ...s,
        currentPrice: s.entryPrice,
        addedAt: new Date().toISOString()
    }))));

    location.reload();
};
