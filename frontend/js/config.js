const CONFIG = {
    API_URL: "https://script.google.com/macros/s/AKfycbz-2Sf-yw2Y-Iq9ulp4UfktQf1gJHnnYq0U0ANl9hTGkh8ESaJPJ6IJaH9POT1L7Z8u/exec",
    BACKEND_URL: typeof window !== 'undefined' && window.location.origin.includes('localhost') ? "http://localhost:3000/api" : `${typeof window !== 'undefined' ? window.location.origin : ''}/api`,
    USE_DEMO_DATA: false,
    APP_NAME: "SKILLNEX",
    TAGLINE: "Learn Better. Grow Smarter."
};
