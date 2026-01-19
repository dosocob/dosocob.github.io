// ================================
// AI TRADING PLATFORM - JAVASCRIPT
// ================================

// Global State
const TradingPlatform = {
    // Portfolio State
    portfolio: {
        cash: 100000,
        holdings: {},
        transactions: [],
        startingCapital: 100000
    },

    // AI Model State
    aiModel: {
        accuracy: 87.3,
        predictionsMade: 1247,
        level: 12,
        iterations: 1890,
        learningHistory: []
    },

    // Market Data Cache
    marketData: {
        stocks: {},
        crypto: {},
        lastUpdate: null
    },

    // News Data
    newsData: [],

    // Current Symbol
    currentSymbol: 'AAPL',
    currentAssetType: 'stocks',

    // WebSocket connections
    ws: null
};

// ================================
// TRADING PLATFORM CONTROLS
// ================================

function openTradingPlatform(event) {
    if (event) event.preventDefault();

    const overlay = document.getElementById('trading-platform');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Initialize platform
    initializeTradingPlatform();
}

function closeTradingPlatform() {
    const overlay = document.getElementById('trading-platform');
    overlay.classList.remove('active');
    document.body.style.overflow = '';

    // Clean up WebSocket connections
    if (TradingPlatform.ws) {
        TradingPlatform.ws.close();
        TradingPlatform.ws = null;
    }
}

function initializeTradingPlatform() {
    // Load saved portfolio from localStorage
    loadPortfolioFromStorage();

    // Initialize real-time data
    initializeMarketData();

    // Load AI predictions
    generateAIPredictions();

    // Load news
    fetchMarketNews();

    // Update dashboard
    updateDashboard();

    // Start real-time updates
    startRealTimeUpdates();
}

// ================================
// TAB NAVIGATION
// ================================

document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');

            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            btn.classList.add('active');
            const activeContent = document.getElementById(`tab-${tabName}`);
            if (activeContent) {
                activeContent.classList.add('active');

                // Special initialization for specific tabs
                if (tabName === 'portfolio') {
                    updatePortfolioView();
                }
            }
        });
    });

    // Order type toggle
    const orderTypeSel = document.getElementById('order-type');
    if (orderTypeSel) {
        orderTypeSel.addEventListener('change', function() {
            const limitPriceGroup = document.getElementById('limit-price-group');
            if (this.value === 'limit' || this.value === 'stop') {
                limitPriceGroup.style.display = 'flex';
            } else {
                limitPriceGroup.style.display = 'none';
            }
        });
    }

    // Order tabs (Buy/Sell)
    const orderTabs = document.querySelectorAll('.order-tab');
    orderTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            orderTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const orderType = this.getAttribute('data-order');
            const tradeBtn = document.querySelector('.btn-trade');
            if (orderType === 'buy') {
                tradeBtn.classList.remove('sell');
                tradeBtn.classList.add('buy');
                tradeBtn.querySelector('span').textContent = 'Place Buy Order';
            } else {
                tradeBtn.classList.remove('buy');
                tradeBtn.classList.add('sell');
                tradeBtn.querySelector('span').textContent = 'Place Sell Order';
            }
        });
    });

    // Set today's date for backtest end date
    const btEndDate = document.getElementById('bt-end-date');
    if (btEndDate) {
        btEndDate.valueAsDate = new Date();
    }
});

// ================================
// REAL-TIME MARKET DATA
// ================================

async function initializeMarketData() {
    try {
        // Fetch initial stock data (using free APIs or simulated data)
        await fetchStockData('SPY');  // S&P 500 ETF
        await fetchStockData('QQQ');  // NASDAQ ETF
        await fetchCryptoData('BTCUSDT');
        await fetchCryptoData('ETHUSDT');
    } catch (error) {
        console.error('Error initializing market data:', error);
        // Use simulated data as fallback
        useSimulatedData();
    }
}

async function fetchStockData(symbol) {
    // Note: In production, you would use Alpha Vantage, Finnhub, or Polygon API
    // For demo, we'll use simulated data
    const simulatedPrice = 400 + Math.random() * 50;
    const simulatedChange = (Math.random() - 0.5) * 5;

    TradingPlatform.marketData.stocks[symbol] = {
        price: simulatedPrice,
        change: simulatedChange,
        changePercent: (simulatedChange / simulatedPrice) * 100,
        timestamp: Date.now()
    };

    updateMarketDisplay(symbol, 'stocks');
}

async function fetchCryptoData(symbol) {
    try {
        // Use Binance public API (free, no auth required)
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
        const data = await response.json();

        if (data && data.lastPrice) {
            TradingPlatform.marketData.crypto[symbol] = {
                price: parseFloat(data.lastPrice),
                change: parseFloat(data.priceChange),
                changePercent: parseFloat(data.priceChangePercent),
                volume: parseFloat(data.volume),
                timestamp: Date.now()
            };

            updateMarketDisplay(symbol, 'crypto');
        }
    } catch (error) {
        console.error(`Error fetching crypto data for ${symbol}:`, error);
        // Fallback to simulated data
        useSimulatedCryptoData(symbol);
    }
}

function useSimulatedCryptoData(symbol) {
    const basePrice = symbol === 'BTCUSDT' ? 45000 : 2500;
    const price = basePrice + (Math.random() - 0.5) * basePrice * 0.1;
    const change = (Math.random() - 0.5) * basePrice * 0.05;

    TradingPlatform.marketData.crypto[symbol] = {
        price: price,
        change: change,
        changePercent: (change / price) * 100,
        timestamp: Date.now()
    };

    updateMarketDisplay(symbol, 'crypto');
}

function updateMarketDisplay(symbol, type) {
    const data = TradingPlatform.marketData[type][symbol];
    if (!data) return;

    // Update dashboard displays
    let elementId = '';
    if (symbol === 'SPY') {
        elementId = 'sp500';
    } else if (symbol === 'QQQ') {
        elementId = 'nasdaq';
    } else if (symbol === 'BTCUSDT') {
        elementId = 'btc';
    } else if (symbol === 'ETHUSDT') {
        elementId = 'eth';
    }

    if (elementId) {
        const valueEl = document.getElementById(`${elementId}-value`);
        const changeEl = document.getElementById(`${elementId}-change`);

        if (valueEl) {
            valueEl.textContent = type === 'crypto' ?
                `$${data.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` :
                `${data.price.toFixed(2)}`;
        }

        if (changeEl) {
            const changeText = `${data.changePercent >= 0 ? '+' : ''}${data.changePercent.toFixed(2)}%`;
            changeEl.textContent = changeText;
            changeEl.className = data.changePercent >= 0 ? 'stat-change positive' : 'stat-change negative';
        }
    }
}

function useSimulatedData() {
    // S&P 500
    TradingPlatform.marketData.stocks['SPY'] = {
        price: 478.32,
        change: 2.45,
        changePercent: 0.51,
        timestamp: Date.now()
    };

    // NASDAQ
    TradingPlatform.marketData.stocks['QQQ'] = {
        price: 412.18,
        change: 3.12,
        changePercent: 0.76,
        timestamp: Date.now()
    };

    // Update displays
    updateMarketDisplay('SPY', 'stocks');
    updateMarketDisplay('QQQ', 'stocks');
}

function startRealTimeUpdates() {
    // Update market data every 5 seconds
    setInterval(() => {
        fetchCryptoData('BTCUSDT');
        fetchCryptoData('ETHUSDT');
        // For stocks, update during market hours or use simulated data
        fetchStockData('SPY');
        fetchStockData('QQQ');
    }, 5000);
}

// ================================
// AI PREDICTIONS
// ================================

function generateAIPredictions() {
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'BTC', 'ETH'];
    const predictions = [];

    symbols.forEach(symbol => {
        const isCrypto = symbol === 'BTC' || symbol === 'ETH';
        const confidence = 70 + Math.random() * 25; // 70-95%
        const direction = Math.random() > 0.5 ? 'BULLISH' : 'BEARISH';
        const basePrice = isCrypto ? (symbol === 'BTC' ? 45000 : 2500) : 150;
        const currentPrice = basePrice + (Math.random() - 0.5) * basePrice * 0.1;
        const targetChange = (Math.random() - 0.3) * 0.1; // -30% to +70% bias
        const targetPrice = currentPrice * (1 + targetChange);

        predictions.push({
            symbol,
            direction,
            confidence: confidence.toFixed(1),
            currentPrice: currentPrice.toFixed(2),
            targetPrice: targetPrice.toFixed(2),
            timeframe: Math.random() > 0.5 ? '1 day' : '1 week',
            reasoning: generateReasoning(symbol, direction, confidence)
        });
    });

    displayAIPredictions(predictions);
    return predictions;
}

function generateReasoning(symbol, direction, confidence) {
    const reasons = {
        BULLISH: [
            'Strong technical indicators with RSI showing oversold conditions',
            'Positive news sentiment with 85% bullish articles',
            'Institutional buying pressure detected',
            'Breaking above key resistance levels',
            'Volume surge indicating strong buyer interest'
        ],
        BEARISH: [
            'Overbought conditions on multiple timeframes',
            'Negative news sentiment affecting market perception',
            'Large institutional sell-offs detected',
            'Failed to break resistance, showing weakness',
            'Volume declining, indicating lack of buyer interest'
        ]
    };

    const reasonList = reasons[direction];
    const selectedReasons = [];
    const numReasons = Math.floor(confidence / 30) + 1;

    for (let i = 0; i < numReasons && i < reasonList.length; i++) {
        selectedReasons.push(reasonList[Math.floor(Math.random() * reasonList.length)]);
    }

    return selectedReasons;
}

function displayAIPredictions(predictions) {
    const container = document.getElementById('ai-predictions-list');
    if (!container) return;

    container.innerHTML = predictions.map(pred => `
        <div class="prediction-item" style="padding: 1.5rem; background: var(--bg-tertiary); border-radius: var(--radius-sm); margin-bottom: 1rem; border-left: 3px solid ${pred.direction === 'BULLISH' ? '#10b981' : '#ef4444'}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div>
                    <span style="font-size: 1.5rem; font-weight: 700;">${pred.symbol}</span>
                    <span class="signal-badge ${pred.direction.toLowerCase()}" style="margin-left: 1rem;">${pred.direction}</span>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 0.9rem; color: var(--text-tertiary);">Confidence</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${pred.confidence}%</div>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1rem;">
                <div>
                    <div style="font-size: 0.8rem; color: var(--text-tertiary);">Current Price</div>
                    <div style="font-size: 1.1rem; font-weight: 600;">$${pred.currentPrice}</div>
                </div>
                <div>
                    <div style="font-size: 0.8rem; color: var(--text-tertiary);">Target Price</div>
                    <div style="font-size: 1.1rem; font-weight: 600; color: ${pred.direction === 'BULLISH' ? '#10b981' : '#ef4444'};">$${pred.targetPrice}</div>
                </div>
                <div>
                    <div style="font-size: 0.8rem; color: var(--text-tertiary);">Timeframe</div>
                    <div style="font-size: 1.1rem; font-weight: 600;">${pred.timeframe}</div>
                </div>
            </div>
            <div style="margin-top: 1rem;">
                <div style="font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 0.5rem;">AI Analysis:</div>
                <ul style="font-size: 0.9rem; color: var(--text-secondary); margin-left: 1.5rem;">
                    ${pred.reasoning.map(r => `<li style="margin-bottom: 0.25rem;">${r}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');

    // Also update dashboard AI signals (show top 3)
    const topPredictions = predictions.slice(0, 3);
    updateDashboardSignals(topPredictions);
}

function updateDashboardSignals(predictions) {
    const container = document.getElementById('ai-signals');
    if (!container) return;

    container.innerHTML = predictions.map(pred => `
        <div class="signal-item">
            <div class="signal-header">
                <span class="signal-symbol">${pred.symbol}</span>
                <span class="signal-badge ${pred.direction.toLowerCase()}">${pred.direction}</span>
            </div>
            <div class="signal-details">
                <span>Confidence: <strong>${pred.confidence}%</strong></span>
                <span>Target: <strong>$${pred.targetPrice}</strong></span>
            </div>
        </div>
    `).join('');
}

// ================================
// NEWS & SENTIMENT ANALYSIS
// ================================

async function fetchMarketNews() {
    // In production, use Marketaux API (free 100 requests/day)
    // For demo, use simulated news with sentiment
    const simulatedNews = generateSimulatedNews();
    TradingPlatform.newsData = simulatedNews;

    displayNews(simulatedNews);
    updateNewsSentiment(simulatedNews);
}

function generateSimulatedNews() {
    const headlines = [
        { title: 'Tech stocks rally as AI sector shows strong growth', sentiment: 'positive', symbol: 'TECH' },
        { title: 'Federal Reserve hints at potential rate cuts in 2024', sentiment: 'positive', symbol: 'MARKETS' },
        { title: 'Bitcoin surges past $50K amid institutional buying', sentiment: 'positive', symbol: 'BTC' },
        { title: 'Nvidia announces new AI chip breakthrough', sentiment: 'positive', symbol: 'NVDA' },
        { title: 'Apple unveils new product lineup with strong pre-orders', sentiment: 'positive', symbol: 'AAPL' },
        { title: 'Energy sector faces headwinds from oversupply concerns', sentiment: 'negative', symbol: 'ENERGY' },
        { title: 'Market volatility expected ahead of earnings season', sentiment: 'neutral', symbol: 'MARKETS' },
        { title: 'Ethereum upgrade successfully implemented', sentiment: 'positive', symbol: 'ETH' },
        { title: 'Tesla reports record quarterly deliveries', sentiment: 'positive', symbol: 'TSLA' },
        { title: 'Gold prices stabilize amid geopolitical tensions', sentiment: 'neutral', symbol: 'GOLD' }
    ];

    return headlines.map((news, index) => ({
        ...news,
        time: `${Math.floor(Math.random() * 60)} minutes ago`,
        source: ['Reuters', 'Bloomberg', 'CNBC', 'WSJ', 'Financial Times'][Math.floor(Math.random() * 5)]
    }));
}

function displayNews(newsArray) {
    // Display in dashboard
    const dashboardFeed = document.getElementById('news-feed');
    if (dashboardFeed) {
        dashboardFeed.innerHTML = newsArray.slice(0, 5).map(news => `
            <div class="news-item">
                <div class="news-sentiment ${news.sentiment}">${news.sentiment.charAt(0).toUpperCase() + news.sentiment.slice(1)}</div>
                <div class="news-content">
                    <h4>${news.title}</h4>
                    <span class="news-time">${news.time} • ${news.source}</span>
                </div>
            </div>
        `).join('');
    }

    // Display in news tab
    const newsArticles = document.getElementById('news-articles');
    if (newsArticles) {
        newsArticles.innerHTML = newsArray.map(news => `
            <div class="news-item" style="padding: 1.5rem; background: var(--bg-glass); border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                <div style="display: flex; gap: 1rem; align-items: flex-start;">
                    <div class="news-sentiment ${news.sentiment}" style="flex-shrink: 0;">${news.sentiment.charAt(0).toUpperCase() + news.sentiment.slice(1)}</div>
                    <div style="flex: 1;">
                        <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--text-primary);">${news.title}</h4>
                        <div style="display: flex; gap: 1rem; font-size: 0.85rem; color: var(--text-tertiary);">
                            <span>${news.time}</span>
                            <span>•</span>
                            <span>${news.source}</span>
                            <span>•</span>
                            <span>${news.symbol}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function updateNewsSentiment(newsArray) {
    const sentimentCounts = {
        positive: 0,
        neutral: 0,
        negative: 0
    };

    newsArray.forEach(news => {
        sentimentCounts[news.sentiment]++;
    });

    const total = newsArray.length;
    const positivePercent = (sentimentCounts.positive / total) * 100;
    const neutralPercent = (sentimentCounts.neutral / total) * 100;
    const negativePercent = (sentimentCounts.negative / total) * 100;

    // Update gauge
    const gauge = document.getElementById('sentiment-gauge');
    if (gauge) {
        const gaugeValue = gauge.querySelector('.gauge-value');
        const gaugeLabel = gauge.querySelector('.gauge-label');

        if (gaugeValue) gaugeValue.textContent = `${Math.round(positivePercent)}%`;
        if (gaugeLabel) {
            if (positivePercent > 60) gaugeLabel.textContent = 'Bullish';
            else if (positivePercent < 40) gaugeLabel.textContent = 'Bearish';
            else gaugeLabel.textContent = 'Neutral';
        }

        // Update gauge visual
        gauge.style.background = `conic-gradient(#10b981 0% ${positivePercent}%, #1a1a2e ${positivePercent}% 100%)`;
    }

    // Update sentiment bars
    const bars = document.querySelectorAll('.sentiment-bar');
    if (bars[0]) {
        bars[0].querySelector('.bar').style.width = `${positivePercent}%`;
        bars[0].querySelector('span:last-child').textContent = `${Math.round(positivePercent)}%`;
    }
    if (bars[1]) {
        bars[1].querySelector('.bar').style.width = `${neutralPercent}%`;
        bars[1].querySelector('span:last-child').textContent = `${Math.round(neutralPercent)}%`;
    }
    if (bars[2]) {
        bars[2].querySelector('.bar').style.width = `${negativePercent}%`;
        bars[2].querySelector('span:last-child').textContent = `${Math.round(negativePercent)}%`;
    }
}

// ================================
// PAPER TRADING
// ================================

function executeTrade(side) {
    const symbol = document.getElementById('symbol-input').value.toUpperCase();
    const quantity = parseInt(document.getElementById('quantity').value);
    const orderType = document.getElementById('order-type').value;

    if (!symbol || !quantity || quantity <= 0) {
        alert('Please enter a valid symbol and quantity');
        return;
    }

    // Get current price (simulated or from market data)
    const price = getCurrentPrice(symbol);

    const totalCost = price * quantity;

    if (side === 'buy') {
        if (totalCost > TradingPlatform.portfolio.cash) {
            alert('Insufficient funds');
            return;
        }

        // Execute buy
        TradingPlatform.portfolio.cash -= totalCost;
        if (!TradingPlatform.portfolio.holdings[symbol]) {
            TradingPlatform.portfolio.holdings[symbol] = {
                shares: 0,
                avgCost: 0,
                totalCost: 0
            };
        }

        const holding = TradingPlatform.portfolio.holdings[symbol];
        holding.totalCost += totalCost;
        holding.shares += quantity;
        holding.avgCost = holding.totalCost / holding.shares;

    } else {
        // Execute sell
        if (!TradingPlatform.portfolio.holdings[symbol] || TradingPlatform.portfolio.holdings[symbol].shares < quantity) {
            alert('Insufficient shares to sell');
            return;
        }

        const holding = TradingPlatform.portfolio.holdings[symbol];
        const sellValue = price * quantity;

        TradingPlatform.portfolio.cash += sellValue;
        holding.shares -= quantity;

        if (holding.shares === 0) {
            delete TradingPlatform.portfolio.holdings[symbol];
        }
    }

    // Record transaction
    TradingPlatform.portfolio.transactions.push({
        date: new Date().toISOString(),
        symbol,
        type: side.toUpperCase(),
        quantity,
        price,
        total: totalCost
    });

    // Save to localStorage
    savePortfolioToStorage();

    // Update UI
    updateBalanceDisplay();
    addRecentOrder(symbol, side, quantity, price);
    updatePortfolioView();

    // Show success message
    alert(`${side.toUpperCase()} order executed: ${quantity} shares of ${symbol} at $${price.toFixed(2)}`);
}

function getCurrentPrice(symbol) {
    // Check if symbol is in market data
    if (TradingPlatform.marketData.stocks[symbol]) {
        return TradingPlatform.marketData.stocks[symbol].price;
    }
    if (TradingPlatform.marketData.crypto[symbol]) {
        return TradingPlatform.marketData.crypto[symbol].price;
    }

    // Generate realistic simulated price based on symbol
    const basePrice = 100 + Math.random() * 400;
    return basePrice;
}

function updateBalanceDisplay() {
    const cashEl = document.getElementById('cash-balance');
    const portfolioValueEl = document.getElementById('portfolio-value');

    if (cashEl) {
        cashEl.textContent = `$${TradingPlatform.portfolio.cash.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }

    // Calculate total portfolio value
    let totalValue = TradingPlatform.portfolio.cash;
    Object.keys(TradingPlatform.portfolio.holdings).forEach(symbol => {
        const holding = TradingPlatform.portfolio.holdings[symbol];
        const currentPrice = getCurrentPrice(symbol);
        totalValue += holding.shares * currentPrice;
    });

    if (portfolioValueEl) {
        portfolioValueEl.textContent = `$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
}

function addRecentOrder(symbol, side, quantity, price) {
    const ordersContainer = document.getElementById('recent-orders');
    if (!ordersContainer) return;

    const noOrders = ordersContainer.querySelector('.no-orders');
    if (noOrders) noOrders.remove();

    const orderEl = document.createElement('div');
    orderEl.className = 'order-item';
    orderEl.style.cssText = 'padding: 0.75rem; background: var(--bg-tertiary); border-radius: var(--radius-sm); margin-bottom: 0.5rem; font-size: 0.9rem;';
    orderEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
            <span style="font-weight: 600;">${symbol}</span>
            <span style="color: ${side === 'buy' ? '#10b981' : '#ef4444'};">${side.toUpperCase()}</span>
        </div>
        <div style="color: var(--text-secondary); font-size: 0.85rem;">
            ${quantity} shares @ $${price.toFixed(2)}
        </div>
    `;

    ordersContainer.insertBefore(orderEl, ordersContainer.firstChild);

    // Keep only last 5 orders visible
    while (ordersContainer.children.length > 5) {
        ordersContainer.removeChild(ordersContainer.lastChild);
    }
}

// ================================
// PORTFOLIO MANAGEMENT
// ================================

function updatePortfolioView() {
    const holdingsTbody = document.getElementById('holdings-tbody');
    const historyTbody = document.getElementById('history-tbody');

    // Update holdings table
    if (holdingsTbody) {
        const holdings = Object.keys(TradingPlatform.portfolio.holdings);

        if (holdings.length === 0) {
            holdingsTbody.innerHTML = '<tr class="no-holdings"><td colspan="7">No positions yet. Start trading to see your holdings here.</td></tr>';
        } else {
            holdingsTbody.innerHTML = holdings.map(symbol => {
                const holding = TradingPlatform.portfolio.holdings[symbol];
                const currentPrice = getCurrentPrice(symbol);
                const marketValue = holding.shares * currentPrice;
                const pl = marketValue - holding.totalCost;
                const plPercent = (pl / holding.totalCost) * 100;

                return `
                    <tr>
                        <td><strong>${symbol}</strong></td>
                        <td>${holding.shares}</td>
                        <td>$${holding.avgCost.toFixed(2)}</td>
                        <td>$${currentPrice.toFixed(2)}</td>
                        <td>$${marketValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td style="color: ${pl >= 0 ? '#10b981' : '#ef4444'};">${pl >= 0 ? '+' : ''}$${pl.toFixed(2)}</td>
                        <td style="color: ${plPercent >= 0 ? '#10b981' : '#ef4444'};">${plPercent >= 0 ? '+' : ''}${plPercent.toFixed(2)}%</td>
                    </tr>
                `;
            }).join('');
        }
    }

    // Update transaction history
    if (historyTbody) {
        const transactions = TradingPlatform.portfolio.transactions.slice().reverse();

        if (transactions.length === 0) {
            historyTbody.innerHTML = '<tr class="no-history"><td colspan="6">No transactions yet</td></tr>';
        } else {
            historyTbody.innerHTML = transactions.map(tx => {
                const date = new Date(tx.date);
                return `
                    <tr>
                        <td>${date.toLocaleDateString()} ${date.toLocaleTimeString()}</td>
                        <td><strong>${tx.symbol}</strong></td>
                        <td style="color: ${tx.type === 'BUY' ? '#10b981' : '#ef4444'};">${tx.type}</td>
                        <td>${tx.quantity}</td>
                        <td>$${tx.price.toFixed(2)}</td>
                        <td>$${tx.total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    </tr>
                `;
            }).join('');
        }
    }

    // Update portfolio summary
    updatePortfolioSummary();
}

function updatePortfolioSummary() {
    let totalValue = TradingPlatform.portfolio.cash;
    Object.keys(TradingPlatform.portfolio.holdings).forEach(symbol => {
        const holding = TradingPlatform.portfolio.holdings[symbol];
        const currentPrice = getCurrentPrice(symbol);
        totalValue += holding.shares * currentPrice;
    });

    const totalPL = totalValue - TradingPlatform.portfolio.startingCapital;
    const totalPLPercent = (totalPL / TradingPlatform.portfolio.startingCapital) * 100;

    const amountEl = document.querySelector('.portfolio-amount');
    const changeEl = document.querySelector('.portfolio-change');

    if (amountEl) {
        amountEl.textContent = `$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }

    if (changeEl) {
        changeEl.textContent = `${totalPL >= 0 ? '+' : ''}$${totalPL.toFixed(2)} (${totalPLPercent >= 0 ? '+' : ''}${totalPLPercent.toFixed(2)}%)`;
        changeEl.className = totalPL >= 0 ? 'portfolio-change positive' : 'portfolio-change negative';
    }
}

// ================================
// BACKTESTING
// ================================

async function runBacktest() {
    const symbol = document.getElementById('bt-symbol').value.toUpperCase();
    const startDate = new Date(document.getElementById('bt-start-date').value);
    const endDate = new Date(document.getElementById('bt-end-date').value);
    const capital = parseFloat(document.getElementById('bt-capital').value);
    const strategy = document.getElementById('bt-strategy').value;
    const timeframe = document.getElementById('bt-timeframe').value;

    if (!symbol || !startDate || !endDate || !capital) {
        alert('Please fill in all fields');
        return;
    }

    // Show loading state
    const resultsContent = document.getElementById('backtest-results-content');
    resultsContent.innerHTML = '<div class="results-placeholder"><p>Running backtest...</p></div>';

    // Simulate backtest (in production, this would call a backend API)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate backtest results
    const results = generateBacktestResults(symbol, startDate, endDate, capital, strategy);

    // Display results
    displayBacktestResults(results);
}

function generateBacktestResults(symbol, startDate, endDate, capital, strategy) {
    // Simulate backtest results
    const daysDiff = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    const numTrades = Math.floor(daysDiff / 5) + Math.floor(Math.random() * 20);

    const winRate = 0.5 + Math.random() * 0.3; // 50-80%
    const avgWin = 0.02 + Math.random() * 0.03; // 2-5%
    const avgLoss = -0.01 - Math.random() * 0.02; // -1 to -3%

    const wins = Math.floor(numTrades * winRate);
    const losses = numTrades - wins;

    const totalReturn = (wins * avgWin) + (losses * avgLoss);
    const finalCapital = capital * (1 + totalReturn);

    const maxDrawdown = -0.05 - Math.random() * 0.15; // -5 to -20%
    const sharpeRatio = 0.5 + Math.random() * 2; // 0.5 to 2.5

    const profitFactor = (wins * Math.abs(avgWin)) / (losses * Math.abs(avgLoss));

    // Generate equity curve data
    const equityCurve = [];
    let currentCapital = capital;
    const tradesPerPoint = Math.max(1, Math.floor(numTrades / 50));

    for (let i = 0; i <= numTrades; i += tradesPerPoint) {
        const progress = i / numTrades;
        const noise = (Math.random() - 0.5) * 0.02;
        const trend = totalReturn * progress;
        currentCapital = capital * (1 + trend + noise);
        equityCurve.push(currentCapital);
    }

    return {
        totalReturn: totalReturn * 100,
        finalCapital,
        sharpeRatio,
        maxDrawdown: maxDrawdown * 100,
        winRate: winRate * 100,
        numTrades,
        profitFactor,
        equityCurve
    };
}

function displayBacktestResults(results) {
    // Hide placeholder, show metrics
    document.getElementById('backtest-results-content').style.display = 'none';
    document.getElementById('backtest-metrics').style.display = 'grid';
    document.getElementById('equity-curve').style.display = 'block';

    // Update metrics
    document.getElementById('bt-return').textContent = `${results.totalReturn >= 0 ? '+' : ''}${results.totalReturn.toFixed(2)}%`;
    document.getElementById('bt-return').style.color = results.totalReturn >= 0 ? '#10b981' : '#ef4444';

    document.getElementById('bt-sharpe').textContent = results.sharpeRatio.toFixed(2);
    document.getElementById('bt-drawdown').textContent = `${results.maxDrawdown.toFixed(2)}%`;
    document.getElementById('bt-winrate').textContent = `${results.winRate.toFixed(1)}%`;
    document.getElementById('bt-trades').textContent = results.numTrades;
    document.getElementById('bt-profit-factor').textContent = results.profitFactor.toFixed(2);

    // Draw equity curve
    drawEquityCurve(results.equityCurve);

    // Train AI model with results
    trainAIWithBacktest(results);
}

function drawEquityCurve(equityCurve) {
    const canvas = document.getElementById('equity-chart');
    const ctx = canvas.getContext('2d');

    // Clear previous chart if exists
    if (window.equityChart) {
        window.equityChart.destroy();
    }

    window.equityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: equityCurve.map((_, i) => i),
            datasets: [{
                label: 'Portfolio Value',
                data: equityCurve,
                borderColor: 'rgb(102, 126, 234)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a8a8b3',
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#a8a8b3'
                    }
                }
            }
        }
    });
}

// ================================
// AI LEARNING SYSTEM
// ================================

function trainAIWithBacktest(results) {
    // Simulate AI learning from backtest results
    const improvement = (results.winRate - 50) * 0.1; // Learn from win rate

    TradingPlatform.aiModel.iterations += Math.floor(results.numTrades / 10);
    TradingPlatform.aiModel.accuracy += improvement * 0.01;

    // Cap accuracy at 95%
    if (TradingPlatform.aiModel.accuracy > 95) {
        TradingPlatform.aiModel.accuracy = 95;
    }

    // Update level
    TradingPlatform.aiModel.level = Math.floor(TradingPlatform.aiModel.iterations / 200) + 1;

    // Record learning
    TradingPlatform.aiModel.learningHistory.push({
        timestamp: Date.now(),
        improvement,
        accuracy: TradingPlatform.aiModel.accuracy,
        source: 'backtest'
    });

    // Update UI
    updateAIStats();

    console.log(`AI Model improved! New accuracy: ${TradingPlatform.aiModel.accuracy.toFixed(1)}%`);
}

function updateAIStats() {
    const stats = document.querySelectorAll('.ai-stat-card');
    if (stats[0]) {
        stats[0].querySelector('.ai-stat-value').textContent = `${TradingPlatform.aiModel.accuracy.toFixed(1)}%`;
    }
    if (stats[1]) {
        stats[1].querySelector('.ai-stat-value').textContent = TradingPlatform.aiModel.predictionsMade.toLocaleString();
    }
    if (stats[2]) {
        stats[2].querySelector('.ai-stat-value').textContent = `Level ${TradingPlatform.aiModel.level}`;
        stats[2].querySelector('.ai-stat-trend').textContent = `${TradingPlatform.aiModel.iterations.toLocaleString()} iterations`;
    }
}

function retrainModel() {
    const btn = event.target.closest('button');
    const originalText = btn.querySelector('span').textContent;

    btn.querySelector('span').textContent = 'Training...';
    btn.disabled = true;

    setTimeout(() => {
        // Simulate retraining
        TradingPlatform.aiModel.iterations += 500;
        TradingPlatform.aiModel.accuracy += 0.5 + Math.random();

        if (TradingPlatform.aiModel.accuracy > 95) {
            TradingPlatform.aiModel.accuracy = 95;
        }

        TradingPlatform.aiModel.level = Math.floor(TradingPlatform.aiModel.iterations / 200) + 1;

        updateAIStats();
        generateAIPredictions();

        btn.querySelector('span').textContent = 'Model Retrained Successfully!';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

        setTimeout(() => {
            btn.querySelector('span').textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 2000);
    }, 3000);
}

// ================================
// STORAGE & PERSISTENCE
// ================================

function savePortfolioToStorage() {
    localStorage.setItem('tradingPlatform.portfolio', JSON.stringify(TradingPlatform.portfolio));
    localStorage.setItem('tradingPlatform.aiModel', JSON.stringify(TradingPlatform.aiModel));
}

function loadPortfolioFromStorage() {
    const savedPortfolio = localStorage.getItem('tradingPlatform.portfolio');
    const savedAI = localStorage.getItem('tradingPlatform.aiModel');

    if (savedPortfolio) {
        TradingPlatform.portfolio = JSON.parse(savedPortfolio);
        updateBalanceDisplay();
    }

    if (savedAI) {
        TradingPlatform.aiModel = JSON.parse(savedAI);
        updateAIStats();
    }
}

// ================================
// SYMBOL LOADING
// ================================

function loadSymbol() {
    const symbol = document.getElementById('symbol-input').value.toUpperCase();
    const timeframe = document.getElementById('timeframe').value;

    if (!symbol) {
        alert('Please enter a symbol');
        return;
    }

    TradingPlatform.currentSymbol = symbol;

    // In a real implementation, this would load TradingView charts or fetch data
    // For now, update the placeholder
    const placeholder = document.querySelector('.chart-placeholder');
    if (placeholder) {
        placeholder.innerHTML = `
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <path d="M10 60L30 40L50 55L70 30L90 45" stroke="url(#gradient)" stroke-width="3" stroke-linecap="round"/>
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#667eea"/>
                        <stop offset="100%" stop-color="#764ba2"/>
                    </linearGradient>
                </defs>
            </svg>
            <h3>${symbol} - ${timeframe} Timeframe</h3>
            <p>Real-time chart data loading...</p>
            <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-tertiary);">
                In production, TradingView charts would display here with live data from MCP servers
            </p>
        `;
    }
}

function changeAssetType() {
    const assetType = document.getElementById('asset-type').value;
    TradingPlatform.currentAssetType = assetType;

    // Update symbol placeholder
    const symbolInput = document.getElementById('symbol-input');
    if (assetType === 'stocks') {
        symbolInput.placeholder = 'AAPL';
        symbolInput.value = 'AAPL';
    } else if (assetType === 'crypto') {
        symbolInput.placeholder = 'BTCUSDT';
        symbolInput.value = 'BTCUSDT';
    } else {
        symbolInput.placeholder = 'EURUSD';
        symbolInput.value = 'EURUSD';
    }
}

// ================================
// DASHBOARD UPDATE
// ================================

function updateDashboard() {
    updateBalanceDisplay();
    updateAIStats();
}

// ================================
// INITIALIZE
// ================================

// Auto-initialize when platform opens
window.openTradingPlatform = openTradingPlatform;
window.closeTradingPlatform = closeTradingPlatform;
window.loadSymbol = loadSymbol;
window.changeAssetType = changeAssetType;
window.executeTrade = executeTrade;
window.runBacktest = runBacktest;
window.retrainModel = retrainModel;
