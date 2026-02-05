// Currency Conversion Service - Free API
const BASE_URL = 'https://api.exchangerate-api.com/v4/latest';

export const currencyService = {
  // Convert INR to other currencies
  convertFromINR: async (amount, toCurrency = 'USD') => {
    try {
      const response = await fetch(`${BASE_URL}/INR`);
      const data = await response.json();
      
      const rate = data.rates[toCurrency];
      const convertedAmount = (amount * rate).toFixed(2);
      
      return {
        originalAmount: amount,
        originalCurrency: 'INR',
        convertedAmount: parseFloat(convertedAmount),
        targetCurrency: toCurrency,
        rate: rate,
        lastUpdated: data.date
      };
    } catch (error) {
      console.error('Currency Conversion Error:', error);
      return null;
    }
  },

  // Get multiple currency conversions at once
  getMultipleRates: async (amount, currencies = ['USD', 'EUR', 'GBP', 'AED']) => {
    try {
      const response = await fetch(`${BASE_URL}/INR`);
      const data = await response.json();
      
      const conversions = {};
      currencies.forEach(currency => {
        conversions[currency] = {
          amount: (amount * data.rates[currency]).toFixed(2),
          rate: data.rates[currency]
        };
      });
      
      return conversions;
    } catch (error) {
      console.error('Multiple Rates Error:', error);
      return null;
    }
  }
};
