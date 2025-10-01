export interface CountryCurrency {
  symbol: string;
  code: string;
  rate: number; // Rate relative to USD - always 1 for consistent values
  locale: string;
}

export const COUNTRY_CURRENCIES: Record<string, CountryCurrency> = {
  "United States": {
    symbol: "$",
    code: "USD",
    rate: 1,
    locale: "en-US"
  },
  "United Kingdom": {
    symbol: "£",
    code: "GBP",
    rate: 1, // Same value as USD, just different symbol
    locale: "en-GB"
  },
  "Germany": {
    symbol: "€",
    code: "EUR",
    rate: 1, // Same value as USD, just different symbol
    locale: "de-DE"
  },
  "France": {
    symbol: "€",
    code: "EUR",
    rate: 1, // Same value as USD, just different symbol
    locale: "fr-FR"
  },
  "Japan": {
    symbol: "¥",
    code: "JPY",
    rate: 1, // Same value as USD, just different symbol
    locale: "ja-JP"
  },
  "China": {
    symbol: "¥",
    code: "CNY",
    rate: 1, // Same value as USD, just different symbol
    locale: "zh-CN"
  },
  "India": {
    symbol: "₹",
    code: "INR",
    rate: 1, // Same value as USD, just different symbol
    locale: "en-IN"
  },
  "Canada": {
    symbol: "C$",
    code: "CAD",
    rate: 1, // Same value as USD, just different symbol
    locale: "en-CA"
  },
  "Australia": {
    symbol: "A$",
    code: "AUD",
    rate: 1, // Same value as USD, just different symbol
    locale: "en-AU"
  },
  "Brazil": {
    symbol: "R$",
    code: "BRL",
    rate: 1, // Same value as USD, just different symbol
    locale: "pt-BR"
  },
  "South Korea": {
    symbol: "₩",
    code: "KRW",
    rate: 1, // Same value as USD, just different symbol
    locale: "ko-KR"
  },
  "Italy": {
    symbol: "€",
    code: "EUR",
    rate: 1, // Same value as USD, just different symbol
    locale: "it-IT"
  },
  "Spain": {
    symbol: "€",
    code: "EUR",
    rate: 1, // Same value as USD, just different symbol
    locale: "es-ES"
  },
  "Netherlands": {
    symbol: "€",
    code: "EUR",
    rate: 1, // Same value as USD, just different symbol
    locale: "nl-NL"
  },
  "Switzerland": {
    symbol: "CHF",
    code: "CHF",
    rate: 1, // Same value as USD, just different symbol
    locale: "de-CH"
  },
  "Sweden": {
    symbol: "kr",
    code: "SEK",
    rate: 1, // Same value as USD, just different symbol
    locale: "sv-SE"
  },
  "Norway": {
    symbol: "kr",
    code: "NOK",
    rate: 1, // Same value as USD, just different symbol
    locale: "nb-NO"
  },
  "Denmark": {
    symbol: "kr",
    code: "DKK",
    rate: 1, // Same value as USD, just different symbol
    locale: "da-DK"
  },
  "Finland": {
    symbol: "€",
    code: "EUR",
    rate: 1, // Same value as USD, just different symbol
    locale: "fi-FI"
  },
  "Singapore": {
    symbol: "S$",
    code: "SGD",
    rate: 1, // Same value as USD, just different symbol
    locale: "en-SG"
  }
};

export function formatCurrency(amount: number, country: string): string {
  const currency = COUNTRY_CURRENCIES[country] || COUNTRY_CURRENCIES["United States"];
  // Use the original amount without conversion since all rates are 1
  const displayAmount = amount;
  
  // Format with the country's locale but use the symbol directly for consistency
  if (currency.code === "USD" || currency.code === "CAD" || currency.code === "AUD" || currency.code === "SGD") {
    return `${currency.symbol}${displayAmount.toLocaleString()}`;
  } else if (currency.code === "EUR" || currency.code === "GBP") {
    return `${currency.symbol}${displayAmount.toLocaleString()}`;
  } else if (currency.code === "JPY" || currency.code === "CNY") {
    return `${currency.symbol}${displayAmount.toLocaleString()}`;
  } else if (currency.code === "INR") {
    return `${currency.symbol}${displayAmount.toLocaleString()}`;
  } else if (currency.code === "BRL") {
    return `${currency.symbol}${displayAmount.toLocaleString()}`;
  } else if (currency.code === "KRW") {
    return `${currency.symbol}${displayAmount.toLocaleString()}`;
  } else if (currency.code === "CHF") {
    return `${currency.symbol}${displayAmount.toLocaleString()}`;
  } else if (currency.code === "SEK" || currency.code === "NOK" || currency.code === "DKK") {
    return `${displayAmount.toLocaleString()}${currency.symbol}`;
  } else {
    return `${currency.symbol}${displayAmount.toLocaleString()}`;
  }
}

export function getCurrencySymbol(country: string): string {
  const currency = COUNTRY_CURRENCIES[country] || COUNTRY_CURRENCIES["United States"];
  return currency.symbol;
}